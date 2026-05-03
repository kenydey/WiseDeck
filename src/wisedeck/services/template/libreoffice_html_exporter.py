"""
LibreOffice Impress → HTML export + asset inlining for single-string html_template storage.
"""

from __future__ import annotations

import base64
import logging
import mimetypes
import re
import subprocess
from html import escape
from pathlib import Path
from typing import List, Tuple
from urllib.parse import unquote

from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

_JS_SCHEME = re.compile(r"^\s*javascript\s*:", re.I)


def _dedupe_warnings(ws: List[str]) -> List[str]:
    seen: set[str] = set()
    out: List[str] = []
    for w in ws:
        if w not in seen:
            seen.add(w)
            out.append(w)
    return out


def run_soffice_convert_impress_html(soffice: str, src_path: Path, out_dir: Path) -> None:
    """Convert presentation to HTML using LibreOffice Impress HTML filter when available."""
    out_dir.mkdir(parents=True, exist_ok=True)
    last_err: str | None = None
    for conv in ("html:impress_html_Export", "html"):
        cmd = [
            soffice,
            "--headless",
            "--nologo",
            "--nofirststartwizard",
            "--norestore",
            "--convert-to",
            conv,
            "--outdir",
            str(out_dir),
            str(src_path),
        ]
        logger.info("LibreOffice HTML export: %s", " ".join(cmd))
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if proc.returncode != 0:
            last_err = (proc.stderr or proc.stdout or "").strip() or f"exit={proc.returncode}"
            logger.warning("LibreOffice convert-to %s failed: %s", conv, last_err)
            continue
        htmls = list(out_dir.glob("*.html")) + list(out_dir.rglob("*.html"))
        if htmls:
            return
        last_err = "no html produced"
    raise RuntimeError(f"LibreOffice HTML 导出失败: {last_err or 'unknown'}")


def _collect_html_paths(out_dir: Path, stem_hint: str) -> List[Path]:
    preferred = out_dir / f"{stem_hint}.html"
    if preferred.is_file():
        return [preferred]
    paths = sorted({p.resolve() for p in out_dir.glob("*.html")})
    if paths:
        return sorted(paths, key=lambda p: p.name)
    paths = sorted({p.resolve() for p in out_dir.rglob("*.html")})
    return sorted(paths, key=lambda p: str(p.relative_to(out_dir)))


def _read_binary_safe(rel_base: Path, href: str) -> bytes | None:
    if not href or href.startswith(("data:", "http://", "https://", "//")):
        return None
    if _JS_SCHEME.search(href):
        return None
    clean = href.split("?", 1)[0].split("#", 1)[0]
    clean = unquote(clean)
    try:
        path = (rel_base / clean).resolve()
    except (OSError, ValueError):
        return None
    try:
        path.relative_to(rel_base.resolve())
    except ValueError:
        return None
    if path.is_file():
        return path.read_bytes()
    return None


def _inline_assets_fragment(html_text: str, base_dir: Path, warnings: List[str]) -> str:
    soup = BeautifulSoup(html_text, "html.parser")

    script_tags = list(soup.find_all("script"))
    for tag in script_tags:
        tag.decompose()
    if script_tags:
        warnings.append("已移除 HTML 中的 <script> 标签（安全策略）")

    for link in list(soup.find_all("link")):
        rel = (link.get("rel") or [""])[0] if isinstance(link.get("rel"), list) else link.get("rel") or ""
        if "stylesheet" not in str(rel).lower():
            continue
        href = link.get("href")
        raw = _read_binary_safe(base_dir, href or "")
        if raw:
            style = soup.new_tag("style")
            style.string = raw.decode("utf-8", errors="replace")
            link.replace_with(style)
        else:
            warnings.append(f"跳过无法内联的样式表: {href}")
            link.decompose()

    for img in soup.find_all("img"):
        src = img.get("src") or ""
        raw = _read_binary_safe(base_dir, src)
        if raw:
            mime = mimetypes.guess_type(src)[0] or "application/octet-stream"
            b64 = base64.standard_b64encode(raw).decode("ascii")
            img["src"] = f"data:{mime};base64,{b64}"
        elif src.startswith("data:"):
            continue
        elif src.startswith(("http://", "https://")):
            warnings.append(f"保留外链图片（未内联）: {src[:80]}")
        elif src:
            warnings.append(f"无法内联图片: {src[:120]}")

    return str(soup)


def split_lo_merged_html_slide_fragments(html_doc: str) -> List[str]:
    """Parse merged LO export HTML (sections with class wd-lo-slide) into inner HTML fragments."""
    if not isinstance(html_doc, str) or not html_doc.strip():
        return []
    soup = BeautifulSoup(html_doc, "html.parser")
    out: List[str] = []
    for sec in soup.find_all("section"):
        classes = sec.get("class") or []
        if isinstance(classes, str):
            classes = [classes]
        if "wd-lo-slide" in classes:
            out.append(sec.decode_contents())
    return out


def wrap_lo_slide_fragment_html(fragment_inner: str, title: str = "Slide") -> str:
    """Single-slide HTML wrapper for LO body fragment (creative design style reference)."""
    safe = escape((title or "Slide").replace("<", "").replace(">", ""))
    inner = fragment_inner if isinstance(fragment_inner, str) else ""
    return f"""<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{safe}</title>
</head>
<body style="margin:0;padding:16px;background:#f5f5f5;">
<div style="background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.12);padding:8px;">
{inner}
</div>
</body>
</html>"""


def merge_and_wrap_impress_html(slides_html: List[str], title: str) -> str:
    safe = escape(title.replace("<", "").replace(">", ""))
    blocks = "".join(f'<section class="wd-lo-slide">{h}</section>' for h in slides_html)
    return f"""<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{safe}</title>
  <style>body{{margin:0;padding:16px;overflow-y:auto;background:#f5f5f5;}}
  .wd-lo-slide{{margin-bottom:24px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.12);padding:8px;}}</style>
</head>
<body>
{blocks}
</body>
</html>"""


def export_presentation_html_bundle(
    pptx_path: Path,
    *,
    work_dir: Path,
    soffice: str,
) -> Tuple[str, int, List[str]]:
    """
    Run LibreOffice HTML export from pptx_path into work_dir, inline assets, return full html string + slide count.
    """
    warnings: List[str] = []
    html_out = work_dir / "html_export"
    html_out.mkdir(parents=True, exist_ok=True)
    run_soffice_convert_impress_html(soffice, pptx_path, html_out)

    stem = pptx_path.stem
    paths = _collect_html_paths(html_out, stem)
    if not paths:
        raise FileNotFoundError("LibreOffice 未生成任何 HTML 文件")

    fragments: List[str] = []
    for hp in paths:
        raw = hp.read_text(encoding="utf-8", errors="replace")
        soup = BeautifulSoup(raw, "html.parser")
        body = soup.body
        inner = body.decode_contents() if body else raw
        inlined = _inline_assets_fragment(inner, hp.parent, warnings)
        fragments.append(inlined)

    slide_count = len(fragments)
    merged = merge_and_wrap_impress_html(fragments, stem)
    final_soup = BeautifulSoup(merged, "html.parser")
    if not final_soup.find("html"):
        raise ValueError("合并后的 HTML 结构无效")

    return str(final_soup), slide_count, _dedupe_warnings(warnings)


__all__ = [
    "export_presentation_html_bundle",
    "run_soffice_convert_impress_html",
    "merge_and_wrap_impress_html",
    "split_lo_merged_html_slide_fragments",
    "wrap_lo_slide_fragment_html",
]
