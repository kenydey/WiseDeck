"""Visual SSOT sync between PPTist elements and main-editor HTML previews."""

from __future__ import annotations

import logging
from html import escape
from typing import Any, Dict, List, Literal, Optional, Tuple

PreviewChrome = Literal["editor", "export"]

from .canvas_constants import VIEWPORT_HEIGHT, VIEWPORT_WIDTH
from .pptist_background_utils import fix_slide_image_url, normalize_slide_background
from .schema.slide_document_v1 import SlideBackgroundSpec, SlideDocumentV1

logger = logging.getLogger(__name__)

# PPTist element type -> html preview renderer support (Phase B matrix).
PPTIST_ELEMENT_HTML_COVERAGE: Dict[str, str] = {
    "text": "full",
    "image": "full",
    "chart": "placeholder",
    "line": "basic",
    "shape": "basic",
    "table": "basic",
    "latex": "placeholder",
    "video": "placeholder",
    "audio": "placeholder",
}


def _bg_css(bg: Dict[str, Any]) -> str:
    bg = normalize_slide_background(bg)
    btype = bg.get("type") or "solid"
    if btype == "solid":
        return bg.get("color") or "#ffffff"
    if btype == "image":
        img = bg.get("image") or {}
        src = fix_slide_image_url(img.get("src") or "")
        return f"#111 url({escape(src)}) center/cover no-repeat"
    if btype == "gradient":
        return "#f5f2eb"
    return "#ffffff"


def _rotate_style(rotate: float) -> str:
    if not rotate:
        return ""
    return f"transform:rotate({rotate}deg);transform-origin:top left;"


def append_element_preview_html(el: Dict[str, Any], parts: List[str]) -> None:
    """Append one element's absolute-layout HTML to parts (shared by preview emitters)."""
    et = el.get("type")
    left = float(el.get("left") or 0)
    top = float(el.get("top") or 0)
    width = float(el.get("width") or 0)
    height = float(el.get("height") or 0)
    rotate = float(el.get("rotate") or 0)
    rot = _rotate_style(rotate)

    if et == "text":
        color = escape(el.get("defaultColor") or "#333")
        fs = int(el.get("fontSize") or 18)
        align = escape(el.get("textAlign") or "left")
        weight = escape(el.get("fontWeight") or "normal")
        content = el.get("content") or "<p></p>"
        parts.append(
            f'<div style="position:absolute;left:{left}px;top:{top}px;width:{width}px;height:{height}px;'
            f'color:{color};font-size:{fs}px;text-align:{align};font-weight:{weight};'
            f'font-family:微软雅黑,Arial,sans-serif;line-height:{el.get("lineHeight") or 1.35};'
            f'{rot}overflow:hidden;">{content}</div>'
        )
    elif et == "image":
        src = fix_slide_image_url(el.get("src") or "")
        parts.append(
            f'<img alt="" src="{escape(src)}" style="position:absolute;left:{left}px;top:{top}px;'
            f'width:{width}px;height:{height}px;{rot}object-fit:contain;" />'
        )
    elif et == "chart":
        parts.append(
            f'<div style="position:absolute;left:{left}px;top:{top}px;width:{width}px;height:{height}px;'
            f'border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;'
            f'color:#666;font-family:微软雅黑,sans-serif;font-size:12px;{rot}">[chart]</div>'
        )
    elif et == "line":
        color = escape(el.get("color") or "#333333")
        sw = float(el.get("width") or 2)
        parts.append(
            f'<svg style="position:absolute;left:{left}px;top:{top}px;width:{max(width, 1)}px;'
            f'height:{max(height, 1)}px;overflow:visible;{rot}" '
            f'xmlns="http://www.w3.org/2000/svg">'
            f'<line x1="0" y1="0" x2="{max(width, 1)}" y2="{max(height, 1)}" '
            f'stroke="{color}" stroke-width="{sw}" /></svg>'
        )
    elif et == "shape":
        fill = escape(el.get("fill") or "transparent")
        outline = el.get("outline") if isinstance(el.get("outline"), dict) else {}
        ocolor = escape(outline.get("color") or "transparent")
        owidth = float(outline.get("width") or 0)
        border = f"border:{owidth}px solid {ocolor};" if owidth > 0 and ocolor != "transparent" else ""
        parts.append(
            f'<div style="position:absolute;left:{left}px;top:{top}px;width:{width}px;height:{height}px;'
            f"background:{fill};{border}{rot}box-sizing:border-box;opacity:{el.get('opacity', 1)};"
            f'"></div>'
        )
    elif et == "table":
        parts.append(
            f'<div class="wds-table-ph" style="position:absolute;left:{left}px;top:{top}px;'
            f'width:{width}px;height:{height}px;border:1px solid #ccc;{rot}'
            f'display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;">'
            f"[table]</div>"
        )


def _preview_body_background(chrome: PreviewChrome) -> str:
    return "#222" if chrome == "export" else "#ffffff"


def is_export_chrome_preview_html(html: str) -> bool:
    """True when HTML uses dark export letterbox (unsuitable for main editor iframe)."""
    if not html or not isinstance(html, str):
        return True
    normalized = html.replace(" ", "").lower()
    return "background:#222" in normalized


def pptist_elements_to_preview_html(
    slide: Dict[str, Any],
    *,
    preview_chrome: PreviewChrome = "editor",
) -> str:
    """Render slide dict (elements + background) to full HTML document for iframe preview."""
    els: List[Dict[str, Any]] = slide.get("elements") if isinstance(slide.get("elements"), list) else []
    bg_css = _bg_css(slide.get("background") or {})
    body_bg = _preview_body_background(preview_chrome)

    parts = [
        f'<div class="wds-slide-root" style="position:relative;width:{VIEWPORT_WIDTH}px;height:{VIEWPORT_HEIGHT}px;'
        f'overflow:hidden;margin:0 auto;background:{bg_css};box-sizing:border-box;">'
    ]
    for el in els:
        if isinstance(el, dict):
            append_element_preview_html(el, parts)
    parts.append("</div>")
    return (
        '<!DOCTYPE html><html><head><meta charset="utf-8"/>'
        f'<style>html,body{{margin:0;padding:0;background:{body_bg};}}</style>'
        "</head><body>"
        + "".join(parts)
        + "</body></html>"
    )


def _parse_slide_document(raw: Any) -> Optional[SlideDocumentV1]:
    if not raw or not isinstance(raw, dict):
        return None
    try:
        return SlideDocumentV1.model_validate(raw)
    except Exception as exc:
        logger.debug("slide_document parse skipped: %s", exc)
        return None


def touch_slide_document_from_elements(row: Dict[str, Any]) -> Dict[str, Any]:
    """Phase C: refresh slide_document background from PPTist row (slots unchanged)."""
    doc = _parse_slide_document(row.get("slide_document"))
    if doc is None:
        return row
    bg = row.get("background")
    if isinstance(bg, dict):
        nb = normalize_slide_background(bg)
        btype = nb.get("type") or "solid"
        if btype == "solid":
            doc.background = SlideBackgroundSpec(type="solid", color=nb.get("color") or "#ffffff")
        elif btype == "image":
            img = nb.get("image") or {}
            doc.background = SlideBackgroundSpec(
                type="image",
                color=nb.get("color") or "#ffffff",
                image_src=img.get("src"),
                image_size=img.get("size") or "cover",
            )
    out = dict(row)
    out["slide_document"] = doc.model_dump(mode="json")
    return out


def pptist_seed_fields_from_row(row: Dict[str, Any]) -> Dict[str, Any]:
    """Prefer slide_document-derived PPTist fields when opening full editor (Phase C)."""
    if not isinstance(row, dict):
        return row
    doc = _parse_slide_document(row.get("slide_document"))
    if doc is None:
        return row
    try:
        from .render.pptist_emitter import emit_pptist_slide_dict

        ppt = emit_pptist_slide_dict(doc, slide_id=str(row.get("id")) if row.get("id") else None)
        out = dict(row)
        out["elements"] = ppt.get("elements", row.get("elements", []))
        out["background"] = ppt.get("background", row.get("background"))
        if not out.get("elements_source"):
            out["elements_source"] = "slide_document"
        return out
    except Exception as exc:
        logger.debug("pptist_seed_fields_from_row failed: %s", exc)
        return row


def enrich_slide_row_for_editor_preview(
    row: Dict[str, Any],
    *,
    attach_resolved_preview_html: bool = False,
    preview_chrome: PreviewChrome = "editor",
) -> Dict[str, Any]:
    """Optionally attach resolved_preview_html (sync API / save with flag only)."""
    if not isinstance(row, dict):
        return row
    out = dict(row)
    if not attach_resolved_preview_html:
        return out
    doc = _parse_slide_document(row.get("slide_document"))
    if doc is not None:
        try:
            from .render.html_emitter import emit_slide_document_html

            out["resolved_preview_html"] = emit_slide_document_html(doc, preview_chrome=preview_chrome)
            return out
        except Exception as exc:
            logger.debug("emit_slide_document_html failed: %s", exc)
    try:
        out["resolved_preview_html"] = pptist_elements_to_preview_html(row, preview_chrome=preview_chrome)
    except Exception:
        pass
    return out


def enrich_slides_data_for_editor(
    slides_data: List[Any],
    *,
    attach_resolved_preview_html: bool = False,
    preview_chrome: PreviewChrome = "editor",
) -> List[Any]:
    return [
        enrich_slide_row_for_editor_preview(
            r,
            attach_resolved_preview_html=attach_resolved_preview_html,
            preview_chrome=preview_chrome,
        )
        if isinstance(r, dict)
        else r
        for r in slides_data
    ]


def sync_visual_ssot_on_row(
    row: Dict[str, Any],
    *,
    sync_html_content: bool = False,
) -> Dict[str, Any]:
    """
    Regenerate pptist_aligned_preview_html from elements / slide_document.
    Does not overwrite html_content unless sync_html_content=True.
    """
    if not isinstance(row, dict):
        return row
    out = touch_slide_document_from_elements(row)
    doc = _parse_slide_document(out.get("slide_document"))
    preview = ""
    if doc is not None:
        try:
            from .render.html_emitter import emit_slide_document_html

            preview = emit_slide_document_html(doc, preview_chrome="editor")
        except Exception as exc:
            logger.warning("sync visual via slide_document failed: %s", exc)
    if not preview:
        preview = pptist_elements_to_preview_html(out, preview_chrome="editor")
    out["pptist_aligned_preview_html"] = preview
    if sync_html_content and preview:
        out["html_content"] = preview
    return out


def sync_visual_ssot_on_slides(
    slides_data: List[Any],
    *,
    sync_html_content: bool = False,
    only_user_edit: bool = True,
) -> Tuple[List[Any], int]:
    """Apply sync_visual_ssot_on_row to each slide; returns (slides, count_updated)."""
    out: List[Any] = []
    n = 0
    for row in slides_data:
        if not isinstance(row, dict):
            out.append(row)
            continue
        if only_user_edit and row.get("elements_source") != "user_edit":
            out.append(row)
            continue
        synced = sync_visual_ssot_on_row(row, sync_html_content=sync_html_content)
        out.append(synced)
        n += 1
    return out, n
