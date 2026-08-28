"""Emit PPTist-compatible slide dict from SlideDocument v1."""

from __future__ import annotations

import json
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from ..canvas_constants import VIEWPORT_HEIGHT, VIEWPORT_WIDTH
from ..pptist_background_utils import normalize_slide_background
from ..schema.slide_document_v1 import SlideBackgroundSpec, SlideDocumentV1

_LAYOUT_PATH = Path(__file__).resolve().parent.parent / "layouts" / "pptist_layouts.json"


def _new_id() -> str:
    return uuid.uuid4().hex[:10]


def _load_layouts() -> Dict[str, Any]:
    data = json.loads(_LAYOUT_PATH.read_text(encoding="utf-8"))
    return data.get("layouts") or {}


_LAYOUTS_CACHE: Optional[Dict[str, Any]] = None


def _layouts() -> Dict[str, Any]:
    global _LAYOUTS_CACHE
    if _LAYOUTS_CACHE is None:
        _LAYOUTS_CACHE = _load_layouts()
    return _LAYOUTS_CACHE


def _bg_to_pptist(bg: SlideBackgroundSpec) -> Dict[str, Any]:
    if bg.type == "solid":
        raw = {"type": "solid", "color": bg.color}
    elif bg.type == "image" and bg.image_src:
        raw = {
            "type": "image",
            "color": bg.color,
            "image": {"src": bg.image_src, "size": bg.image_size},
        }
    elif bg.type == "gradient" and bg.gradient:
        raw = {"type": "gradient", "gradient": bg.gradient}
    else:
        raw = {"type": "solid", "color": "#ffffff"}
    return normalize_slide_background(raw)


def _wrap_text_html(text: str) -> str:
    from html import escape

    if not text:
        return "<p></p>"
    parts = [escape(line) for line in text.split("\n") if line.strip() or len(text.split("\n")) == 1]
    if len(parts) == 1:
        return f"<p>{parts[0]}</p>"
    return "".join(f"<p>{p}</p>" for p in parts)


def _text_el(region: Dict[str, Any], content: str, extra: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    el = {
        "id": _new_id(),
        "type": "text",
        "left": float(region["left"]),
        "top": float(region["top"]),
        "width": float(region["width"]),
        "height": float(region["height"]),
        "rotate": 0,
        "content": _wrap_text_html(content),
        "defaultFontName": "微软雅黑",
        "defaultColor": region.get("defaultColor", "#333333"),
        "lineHeight": 1.35,
        "wordSpace": 0,
        "opacity": 1,
        "paragraphSpace": 6,
        "vertical": False,
        "textType": "content",
    }
    if region.get("fontSize"):
        el["fontSize"] = int(region["fontSize"])
    if region.get("fontWeight"):
        el["fontWeight"] = region["fontWeight"]
    if region.get("textAlign"):
        el["textAlign"] = region["textAlign"]
    if extra:
        el.update(extra)
    return el


def _logo_el(region: Dict[str, Any], src: str) -> Dict[str, Any]:
    return {
        "id": _new_id(),
        "type": "image",
        "left": float(region["left"]),
        "top": float(region["top"]),
        "width": float(region["width"]),
        "height": float(region["height"]),
        "rotate": 0,
        "fixedRatio": True,
        "src": src,
        "outline": {"style": "solid", "width": 0, "color": "#000000"},
    }


def _outline_chart_to_element(chart_cfg: Dict[str, Any], region: Dict[str, Any]) -> Dict[str, Any]:
    ctype = (chart_cfg.get("type") or "bar").lower()
    alias = {
        "bar": "bar",
        "column": "column",
        "line": "line",
        "pie": "pie",
        "doughnut": "ring",
        "donut": "ring",
        "ring": "ring",
        "area": "area",
        "radar": "radar",
        "scatter": "scatter",
    }
    chart_type = alias.get(ctype, "bar")
    raw = chart_cfg.get("data") or {}
    labels = list(raw.get("labels") or [])
    datasets = raw.get("datasets") or []
    legends: List[str] = []
    series: List[List[float]] = []
    for i, ds in enumerate(datasets):
        legends.append(str(ds.get("label") or f"Series {i + 1}"))
        vals = ds.get("data") or []
        series.append([float(v) if isinstance(v, (int, float)) else 0.0 for v in vals])

    theme = chart_cfg.get("themeColors")
    if not isinstance(theme, list) or len(theme) < 2:
        theme = ["#4472c4", "#ed7d31", "#a5a5a5", "#ffc000"]

    return {
        "id": _new_id(),
        "type": "chart",
        "left": float(region["left"]),
        "top": float(region["top"]),
        "width": float(region["width"]),
        "height": float(region["height"]),
        "rotate": 0,
        "chartType": chart_type,
        "data": {"labels": labels, "legends": legends, "series": series},
        "themeColors": theme,
        "options": chart_cfg.get("options") or {},
        "textColor": chart_cfg.get("textColor") or "#333333",
        "lineColor": chart_cfg.get("lineColor") or "#e5e5e5",
    }


def emit_pptist_slide_dict(doc: SlideDocumentV1, slide_id: Optional[str] = None) -> Dict[str, Any]:
    layouts = _layouts()
    regions_all = (layouts.get(doc.layout_id) or {}).get("regions") or {}
    elements: List[Dict[str, Any]] = []

    slots = doc.slots

    if doc.layout_id == "cover":
        if slots.title and "title" in regions_all:
            elements.append(_text_el(regions_all["title"], slots.title, {"textType": "heading"}))
        if slots.subtitle and "subtitle" in regions_all:
            elements.append(_text_el(regions_all["subtitle"], slots.subtitle))
        if slots.confidential and "confidential" in regions_all:
            elements.append(_text_el(regions_all["confidential"], slots.confidential))
        if slots.date and "date" in regions_all:
            elements.append(_text_el(regions_all["date"], slots.date))
        if slots.logo_src and "logo" in regions_all:
            elements.append(_logo_el(regions_all["logo"], slots.logo_src))

    elif doc.layout_id == "content_bullets":
        if slots.title and "title" in regions_all:
            elements.append(_text_el(regions_all["title"], slots.title, {"textType": "heading"}))
        body = "\n".join(f"• {b}" for b in slots.bullets) if slots.bullets else ""
        if body and "bullet_list" in regions_all:
            elements.append(_text_el(regions_all["bullet_list"], body))

    elif doc.layout_id == "content_chart":
        if slots.title and "title" in regions_all:
            elements.append(_text_el(regions_all["title"], slots.title, {"textType": "heading"}))
        if doc.chart_config and "chart" in regions_all:
            elements.append(_outline_chart_to_element(doc.chart_config, regions_all["chart"]))
        sidebar_txt = "\n".join(f"• {b}" for b in slots.bullets) if slots.bullets else ""
        if sidebar_txt and "sidebar" in regions_all:
            elements.append(_text_el(regions_all["sidebar"], sidebar_txt))

    sid = slide_id or _new_id()
    return {
        "id": sid,
        "elements": elements,
        "notes": [],
        "remark": "",
        "background": _bg_to_pptist(doc.background),
        "animations": [],
    }


def canvas_size_dict() -> Dict[str, float]:
    return {"width": VIEWPORT_WIDTH, "height": VIEWPORT_HEIGHT}
