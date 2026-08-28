"""Build SlideDocument v1 from outline slide dict + generated HTML."""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

from bs4 import BeautifulSoup

from .pptist_background_utils import fix_slide_image_url
from .pptist_generation_service import PPTistGenerationService
from .schema.slide_document_v1 import SlideBackgroundSpec, SlideDocumentV1, SlideSlots

_DATE_PATTERNS = [
    re.compile(r"\d{4}[\-.]\d{2}[\-.]\d{2}"),
    re.compile(r"\d{4}年\d{1,2}月\d{1,2}日"),
]


def _extract_logo_src(soup: BeautifulSoup) -> Optional[str]:
    imgs = soup.find_all("img")
    best = None
    best_area = 10**9
    for img in imgs:
        src = img.get("src") or ""
        if not src:
            continue
        try:
            w = int(img.get("width") or "400")
            h = int(img.get("height") or "300")
        except ValueError:
            w, h = 400, 300
        area = w * h
        if area < best_area and area > 200:  # skip tiny icons/decorative
            best_area = area
            best = src
    return fix_slide_image_url(best) if best else None


def _extract_date(text: str) -> str:
    for pat in _DATE_PATTERNS:
        m = pat.search(text)
        if m:
            return m.group(0)
    return ""


def _extract_confidential(html_upper: str) -> str:
    if "CONFIDENTIAL" in html_upper:
        return "CONFIDENTIAL"
    if "机密" in html_upper:
        return "机密"
    return ""


def _subtitle_from_html(soup: BeautifulSoup, title_hint: str) -> str:
    for tag in soup.find_all(["h2", "h3"]):
        t = tag.get_text(strip=True)
        if t and t != title_hint:
            return t
    return ""


def _bullets_from_html(soup: BeautifulSoup) -> List[str]:
    out: List[str] = []
    for li in soup.find_all("li"):
        t = li.get_text(strip=True)
        if t:
            out.append(t)
    return out


def build_slide_document_v1(
    slide_data: Dict[str, Any],
    html_content: Optional[str],
    page_number: int,
    total_pages: int,
) -> SlideDocumentV1:
    """
    Deterministic slide document from outline fields + light HTML mining.
    Charts come from outline chart_config; bullets prefer outline content_points.
    """
    _ = total_pages  # reserved for future layout hints

    parser = PPTistGenerationService()
    parsed = parser._parse_html_styles(html_content)

    title = (slide_data.get("title") or "").strip()
    soup = BeautifulSoup(html_content or "", "html.parser")

    if not title:
        h1 = soup.find("h1")
        if h1:
            title = h1.get_text(strip=True)

    subtitle = _subtitle_from_html(soup, title)
    outline_bullets = slide_data.get("content_points") or []
    bullets: List[str] = [str(b).strip() for b in outline_bullets if str(b).strip()]
    if not bullets:
        bullets = _bullets_from_html(soup)

    chart_cfg = slide_data.get("chart_config")

    raw = (html_content or "").upper()
    confidential = _extract_confidential(raw)
    date_label = _extract_date(soup.get_text(" ", strip=True) if soup else "")
    logo_src = _extract_logo_src(soup)

    # Background spec
    bg_spec = SlideBackgroundSpec(type="solid", color=parsed.get("background") or "#f5f2eb")
    if parsed.get("background_type") == "image" and parsed.get("background_image"):
        bg_spec = SlideBackgroundSpec(
            type="image",
            color="#ffffff",
            image_src=fix_slide_image_url(parsed["background_image"]),
            image_size="cover",
        )
    elif parsed.get("background_type") == "gradient":
        # PPTist gradient object not reconstructed here — html preview uses CSS separately
        bg_spec = SlideBackgroundSpec(type="solid", color="#f5f2eb")

    if chart_cfg:
        layout_id = "content_chart"
    elif page_number == 1:
        layout_id = "cover"
    else:
        layout_id = "content_bullets"

    slots = SlideSlots(
        title=title,
        subtitle=subtitle,
        bullets=bullets,
        confidential=confidential,
        date=date_label,
        logo_src=logo_src,
    )

    return SlideDocumentV1(
        layout_id=layout_id,
        slots=slots,
        background=bg_spec,
        chart_config=chart_cfg if isinstance(chart_cfg, dict) else None,
    )


def merged_assembly_prefs(
    slide_data: Dict[str, Any],
    project_assembly_prefs: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    out: Dict[str, Any] = dict(project_assembly_prefs or {})
    sp = slide_data.get("assembly_prefs")
    if isinstance(sp, dict):
        out.update(sp)
    return out


async def assemble_generated_slide_outputs(
    slide_data: Dict[str, Any],
    html_content: Optional[str],
    page_number: int,
    total_pages: int,
    *,
    export_base_url: Optional[str] = None,
    project_assembly_prefs: Optional[Dict[str, Any]] = None,
    template_pack_id: Optional[str] = None,
):
    """
    Unified pipeline (priority):
      1) ``wds_aippt_v1`` / ``aippt`` payload → template-backed PPTist slide
      2) SlideDocument v1 → pptist_emitter

    Playwright / screenshot-based bridge and raster fallback have been removed.

    Returns (SlideDocumentV1, pptist_slide_dict, preview_html).

    Invariant (StrictPixel / SSOT): ``preview_html`` is always emitted via
    ``pptist_slide_to_preview_html(ppt)`` for the same ``ppt`` dict whose elements
    and background populate ``slides_data``, keeping raster/HTML previews aligned
    with the vector slide payload.
    """
    from .pptist_background_utils import normalize_slide_background
    from .pptist_preview_html import pptist_slide_to_preview_html
    from .render.pptist_emitter import emit_pptist_slide_dict

    sid = slide_data.get("id") or slide_data.get("slide_id")
    sid_str = str(sid) if sid else None

    doc = build_slide_document_v1(slide_data, html_content, page_number, total_pages)

    used_aippt = False
    ppt: Optional[Dict[str, Any]] = None

    raw_aippt = slide_data.get("wds_aippt_v1") or slide_data.get("aippt")
    if raw_aippt is not None:
        try:
            from .aippt_normalize import extract_slide_payload_for_page
            from .render.aippt_emitter import emit_pptist_from_wds_aippt
            from .schema.wds_aippt_v1 import parse_wds_aippt_slide

            payload = extract_slide_payload_for_page(raw_aippt, page_number)
            if payload:
                model = parse_wds_aippt_slide(payload)
                pack_id = template_pack_id or slide_data.get("wds_template_pack_id") or slide_data.get(
                    "template_pack_id"
                )
                ppt = emit_pptist_from_wds_aippt(model, slide_id=sid_str, template_pack_id=str(pack_id) if pack_id else None)
                ppt["elements_source"] = "aippt_template"
                used_aippt = True
        except Exception:
            ppt = None
            used_aippt = False

    if ppt is None:
        ppt = emit_pptist_slide_dict(doc, slide_id=sid_str)
        ppt["background"] = normalize_slide_background(ppt.get("background"))
        ppt.setdefault("elements_source", "slide_document")

    preview = pptist_slide_to_preview_html(ppt)
    return doc, ppt, preview
