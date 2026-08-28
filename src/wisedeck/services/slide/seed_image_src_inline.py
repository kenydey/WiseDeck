"""Inline WiseDeck /api/image/view/{id} URLs into data URLs after pptx_bridge seed.

Reduces reliance on browser GET + disk cache for embedded PPTist; complements public_* read fix.
"""

from __future__ import annotations

import asyncio
import base64
import logging
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

from ..image.models import ImageFormat

logger = logging.getLogger(__name__)

MAX_INLINE_IMAGE_BYTES = 4 * 1024 * 1024

_FORMAT_TO_MIME: Dict[ImageFormat, str] = {
    ImageFormat.JPEG: "image/jpeg",
    ImageFormat.JPG: "image/jpeg",
    ImageFormat.PNG: "image/png",
    ImageFormat.GIF: "image/gif",
    ImageFormat.WEBP: "image/webp",
    ImageFormat.BMP: "image/bmp",
    ImageFormat.TIFF: "image/tiff",
}

_DATA_URL_RE = re.compile(r"""src\s*=\s*["'](data:image/[^"']+)["']""", re.IGNORECASE)
_IMG_BY_ID_RE_TEMPLATE = r'<img\b[^>]*\bsrc\s*=\s*["\'][^"\']*/api/image/view/{image_id}[^"\']*["\'][^>]*>'


def extract_api_view_image_id(src: str) -> Optional[str]:
    if not src or not isinstance(src, str):
        return None
    marker = "/api/image/view/"
    if marker not in src:
        return None
    tail = src[src.index(marker) + len(marker) :]
    image_id = tail.split("?")[0].split("#")[0].strip()
    return image_id or None


def _should_try_inline_src(src: str) -> bool:
    if not isinstance(src, str):
        return False
    s = src.strip().lower()
    if s.startswith("data:"):
        return False
    return "/api/image/view/" in src


def _slide_html_blobs(slide: Dict[str, Any]) -> List[str]:
    out: List[str] = []
    for key in ("html_content", "pptist_aligned_preview_html"):
        val = slide.get(key)
        if isinstance(val, str) and val.strip():
            out.append(val)
    return out


def _data_url_from_slide_html(slide: Dict[str, Any], image_id: str) -> Optional[str]:
    """Best-effort: reuse inline data: URL already present in slide HTML snapshots."""
    marker = f"/api/image/view/{image_id}"
    for html in _slide_html_blobs(slide):
        if marker not in html:
            continue
        img_pat = re.compile(_IMG_BY_ID_RE_TEMPLATE.format(image_id=re.escape(image_id)), re.IGNORECASE)
        for img_m in img_pat.finditer(html):
            tag = img_m.group(0)
            dm = _DATA_URL_RE.search(tag)
            if dm:
                return dm.group(1)
        for m in _DATA_URL_RE.finditer(html):
            data_url = m.group(1)
            if data_url and len(data_url) > 32:
                return data_url
    for html in _slide_html_blobs(slide):
        matches = _DATA_URL_RE.findall(html)
        if len(matches) == 1:
            return matches[0]
    return None


def _alternate_api_src_from_slide_html(slide: Dict[str, Any], image_id: str) -> Optional[str]:
    """If html references another scoped key for the same asset, return that view URL."""
    if "_" not in image_id:
        return None
    content_hash = image_id.split("_", 1)[1]
    if len(content_hash) < 32:
        return None
    for html in _slide_html_blobs(slide):
        for m in re.finditer(
            rf'/api/image/view/(u\d+_{re.escape(content_hash)})(?:\?|["\'#>])',
            html,
            re.IGNORECASE,
        ):
            return f"/api/image/view/{m.group(1)}"
    return None


async def _inline_element_src_from_bytes(el: Dict[str, Any], raw: bytes, fmt: ImageFormat) -> bool:
    if len(raw) > MAX_INLINE_IMAGE_BYTES:
        return False
    mime = _FORMAT_TO_MIME.get(fmt, "image/jpeg")
    b64 = base64.standard_b64encode(raw).decode("ascii")
    el["src"] = f"data:{mime};base64,{b64}"
    return True


async def _resolve_image_bytes_for_inline(
    image_service: Any,
    image_id: str,
    slide: Dict[str, Any],
    src: str,
) -> Optional[tuple[bytes, ImageFormat]]:
    """Resolve file bytes for an API view URL, with public_* / hash cross-key discovery."""
    candidates: List[str] = [image_id]
    if image_id.startswith("public_") and "_" in image_id:
        content_hash = image_id.split("_", 1)[1]
        if len(content_hash) >= 32:
            try:
                alt_key = await image_service.cache_manager.discover_cache_key_by_content_hash(
                    content_hash
                )
                if alt_key and alt_key not in candidates:
                    candidates.append(alt_key)
            except Exception as exc:
                logger.debug("discover_cache_key_by_content_hash failed for %s: %s", image_id, exc)

    alt_src = _alternate_api_src_from_slide_html(slide, image_id)
    if alt_src:
        alt_id = extract_api_view_image_id(alt_src)
        if alt_id and alt_id not in candidates:
            candidates.append(alt_id)

    for cid in candidates:
        try:
            info = await image_service.get_image(cid)
            if info and info.local_path:
                p = Path(info.local_path)
                if p.is_file():
                    raw = await asyncio.to_thread(p.read_bytes)
                    fmt = info.metadata.format if info.metadata else ImageFormat.JPEG
                    return raw, fmt
        except Exception as exc:
            logger.debug("get_image failed for candidate %s: %s", cid, exc)

    data_url = _data_url_from_slide_html(slide, image_id)
    if data_url:
        return None  # caller handles data URL separately

    return None


async def inline_wisedeck_api_image_urls_in_slides_data(slides_data: List[Any]) -> int:
    """Rewrite image ``src`` pointing at ``/api/image/view/...`` to data URLs when file is small enough.

    Mutates ``slides_data`` in place. Returns number of elements inlined.
    """
    from ..image.image_service import get_image_service

    image_service = get_image_service()
    if not image_service.initialized:
        await image_service.initialize()

    inlined = 0
    for slide in slides_data:
        if not isinstance(slide, dict):
            continue
        elements = slide.get("elements")
        if not isinstance(elements, list):
            continue
        for el in elements:
            if not isinstance(el, dict) or el.get("type") != "image":
                continue
            src = el.get("src")
            if not _should_try_inline_src(src):
                continue
            image_id = extract_api_view_image_id(src)
            if not image_id:
                continue
            try:
                resolved = await _resolve_image_bytes_for_inline(
                    image_service, image_id, slide, src
                )
                if resolved:
                    raw, fmt = resolved
                    if await _inline_element_src_from_bytes(el, raw, fmt):
                        inlined += 1
                        continue

                data_url = _data_url_from_slide_html(slide, image_id)
                if data_url and len(data_url) <= MAX_INLINE_IMAGE_BYTES * 2:
                    el["src"] = data_url
                    inlined += 1
                    logger.debug("seed inline from html_content data URL: image_id=%s", image_id)
                    continue

                if image_id.startswith("public_"):
                    logger.warning(
                        "seed inline: public_* image not on disk (may 404 in editor): image_id=%s src=%s",
                        image_id,
                        src[:120],
                    )
            except Exception as e:
                logger.warning("seed inline failed for image_id=%s: %s", image_id, e)
                continue

    if inlined:
        logger.info("pptx_bridge seed: inlined %s image element(s) as data URLs", inlined)
    return inlined
