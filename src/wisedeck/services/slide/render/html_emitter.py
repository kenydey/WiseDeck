"""Absolute-layout HTML preview aligned to PPTist viewport coordinates."""

from __future__ import annotations

from html import escape

from ..canvas_constants import VIEWPORT_HEIGHT, VIEWPORT_WIDTH
from ..pptist_background_utils import fix_slide_image_url
from ..schema.slide_document_v1 import SlideDocumentV1
from typing import Literal

from .pptist_emitter import emit_pptist_slide_dict

PreviewChrome = Literal["editor", "export"]


def _css_background_from_doc(doc: SlideDocumentV1) -> str:
    bg = doc.background
    if bg.type == "solid":
        return bg.color
    if bg.type == "image" and bg.image_src:
        url = escape(fix_slide_image_url(bg.image_src))
        return f"#111 url({url}) center/cover no-repeat"
    return "#f5f2eb"


def emit_slide_document_html(
    doc: SlideDocumentV1,
    *,
    preview_chrome: PreviewChrome = "editor",
) -> str:
    """
    Build a self-contained HTML fragment sized to VIEWPORT_WIDTH × VIEWPORT_HEIGHT
    so iframe previews match PPTist logical coordinates.
    """
    ppt = emit_pptist_slide_dict(doc)
    bg_css = _css_background_from_doc(doc)

    parts = [
        f"""<div class="wds-slide-root" style="position:relative;width:{VIEWPORT_WIDTH}px;height:{VIEWPORT_HEIGHT}px;
            overflow:hidden;margin:0 auto;background:{bg_css};box-sizing:border-box;">"""
    ]

    for el in ppt.get("elements") or []:
        if el.get("type") == "text":
            txt = el.get("content") or ""
            left, top, w, h = el["left"], el["top"], el["width"], el["height"]
            color = escape(el.get("defaultColor") or "#333")
            fs = int(el.get("fontSize") or 18)
            align = escape(el.get("textAlign") or "left")
            weight = escape(el.get("fontWeight") or "normal")
            parts.append(
                f'<div class="wds-abs wds-text" style="position:absolute;left:{left}px;top:{top}px;'
                f"width:{w}px;height:{h}px;color:{color};font-size:{fs}px;text-align:{align};"
                f'font-weight:{weight};font-family:微软雅黑,Arial,sans-serif;line-height:1.35;'
                f'overflow:hidden;">{txt}</div>'
            )
        elif el.get("type") == "image":
            src = escape(fix_slide_image_url(el.get("src") or ""))
            left, top, w, h = el["left"], el["top"], el["width"], el["height"]
            parts.append(
                f'<img class="wds-abs" alt="" src="{src}" style="position:absolute;left:{left}px;top:{top}px;'
                f'width:{w}px;height:{h}px;object-fit:contain;" />'
            )
        elif el.get("type") == "chart":
            left, top, w, h = el["left"], el["top"], el["width"], el["height"]
            placeholder = escape("[图表] " + (doc.slots.title or "chart"))
            parts.append(
                f'<div class="wds-abs wds-chart-ph" style="position:absolute;left:{left}px;top:{top}px;'
                f'width:{w}px;height:{h}px;border:1px dashed #ccc;display:flex;align-items:center;'
                f'justify-content:center;color:#666;font-family:微软雅黑,sans-serif;font-size:14px;">{placeholder}</div>'
            )

    parts.append("</div>")
    body_bg = "#222" if preview_chrome == "export" else "#ffffff"
    wrapper = f"""<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>html,body{{margin:0;padding:0;background:{body_bg};}} </style></head><body>{"".join(parts)}</body></html>"""
    return wrapper
