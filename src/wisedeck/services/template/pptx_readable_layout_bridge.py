"""
Map pptx_readable (pptxtojson) placeholder geometry → layout hint shape list
compatible with template_office_svg_placeholder_inject (normalized 0..1 bbox).
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional


def _shape_kind_from_element(el: Dict[str, Any]) -> str:
    t = str(el.get("type") or "").lower()
    if t == "chart":
        return "chart"
    if t == "table":
        return "table"
    if t == "image":
        return "picture"
    if t in ("text", "shape"):
        return "text"
    return "other"


def _walk_placeholder_elements(slide: Dict[str, Any]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []

    def walk(el: Any) -> None:
        if not isinstance(el, dict):
            return
        if el.get("isPlaceholder") and el.get("placeholderType"):
            out.append(el)
        if el.get("type") == "group" and isinstance(el.get("elements"), list):
            for child in el["elements"]:
                walk(child)

    for bucket in ("elements", "layoutElements"):
        for el in slide.get(bucket) or []:
            walk(el)
    return out


def slide_layout_hints_from_pptx_readable_slide(
    pptx_readable: Dict[str, Any],
    slide_index: int,
) -> Optional[Dict[str, Any]]:
    """
    Build one slide entry like extract_pptx_layout_hints slides[] item:
      {index, shapes: [{bbox, placeholder_type, is_placeholder, shape_kind}]}
    slide_index is 1-based (matches slide_01.svg).
    """
    if not isinstance(pptx_readable, dict) or pptx_readable.get("error"):
        return None
    slides = pptx_readable.get("slides") or []
    if not isinstance(slides, list) or slide_index < 1 or slide_index > len(slides):
        return None
    slide = slides[slide_index - 1]
    if not isinstance(slide, dict):
        return None

    size = pptx_readable.get("size") or {}
    sw = float(size.get("width") or 0)
    sh = float(size.get("height") or 0)
    if sw <= 0 or sh <= 0:
        return None

    shapes_out: List[Dict[str, Any]] = []
    for el in _walk_placeholder_elements(slide):
        ph_type = el.get("placeholderType")
        if not ph_type:
            continue
        try:
            left = float(el.get("left", 0) or 0)
            top = float(el.get("top", 0) or 0)
            width = float(el.get("width", 0) or 0)
            height = float(el.get("height", 0) or 0)
        except (TypeError, ValueError):
            continue
        bbox = [
            round(left / sw, 4),
            round(top / sh, 4),
            round(width / sw, 4),
            round(height / sh, 4),
        ]
        token = str(ph_type).strip().split(".")[-1]
        shapes_out.append(
            {
                "bbox": bbox,
                "placeholder_type": token,
                "is_placeholder": True,
                "shape_kind": _shape_kind_from_element(el),
            }
        )

    if not shapes_out:
        return None
    return {"index": slide_index, "shapes": shapes_out}


def build_pptx_layout_hints_overlay_from_readable(
    pptx_readable: Dict[str, Any],
) -> Optional[Dict[str, Any]]:
    """Minimal pptx_layout-shaped dict using only pptxtojson geometry (for SVG inject)."""
    if not isinstance(pptx_readable, dict) or pptx_readable.get("error"):
        return None
    slides = pptx_readable.get("slides") or []
    if not isinstance(slides, list) or not slides:
        return None
    slides_out: List[Dict[str, Any]] = []
    for i in range(1, len(slides) + 1):
        one = slide_layout_hints_from_pptx_readable_slide(pptx_readable, i)
        if one:
            slides_out.append(one)
    if not slides_out:
        return None
    size = pptx_readable.get("size") or {}
    return {
        "schema_version": 1,
        "source": "pptx_readable_geometry",
        "slide_width_emu": 0,
        "slide_height_emu": 0,
        "slide_count": len(slides),
        "slides": slides_out,
        "canvas_pt": {"width": size.get("width"), "height": size.get("height")},
    }
