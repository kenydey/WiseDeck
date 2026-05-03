"""
Map pptx_readable (pptxtojson fork) placeholder OOXML types → WiseDeck SVG markers / layout hints.
Aligned with template_office_svg_placeholder_inject._PH_TYPE_TO_MARKER semantics.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Set


def ooxml_placeholder_type_to_marker(ph_type: str) -> Optional[str]:
    """OOXML p:ph type (e.g. ctrTitle, subTitle, body) → inner marker name without braces."""
    if not ph_type or not isinstance(ph_type, str):
        return None
    token = ph_type.strip().split(".")[-1].split("(")[0].strip().upper().replace(" ", "").replace("-", "")
    aliases = {
        "TITLE": "PAGE_TITLE",
        "CTRTITLE": "PAGE_TITLE",
        "CENTERTITLE": "PAGE_TITLE",
        "VERTICALTITLE": "PAGE_TITLE",
        "SUBTITLE": "SUBTITLE",
        "BODY": "CONTENT_AREA",
        "OBJECT": "CONTENT_AREA",
        "PIC": "CONTENT_AREA",
        "PICTURE": "CONTENT_AREA",
        "CHART": "CHART_AREA",
        "TBL": "TABLE_AREA",
        "TABLE": "TABLE_AREA",
    }
    return aliases.get(token)


def _walk_elements(slides: List[Any]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for slide in slides:
        if not isinstance(slide, dict):
            continue
        for bucket in ("elements", "layoutElements"):
            for el in slide.get(bucket) or []:
                if isinstance(el, dict):
                    out.append(el)
                if isinstance(el, dict) and el.get("type") == "group" and isinstance(el.get("elements"), list):
                    for child in el["elements"]:
                        if isinstance(child, dict):
                            out.append(child)
    return out


def collect_markers_union(pptx_readable: Dict[str, Any]) -> Set[str]:
    markers: Set[str] = set()
    for slide in pptx_readable.get("slides") or []:
        if not isinstance(slide, dict):
            continue
        for bucket in ("elements", "layoutElements"):
            for el in slide.get(bucket) or []:
                if not isinstance(el, dict):
                    continue
                if el.get("isPlaceholder") and el.get("placeholderType"):
                    m = ooxml_placeholder_type_to_marker(str(el["placeholderType"]))
                    if m:
                        markers.add(m)
                if el.get("type") == "group" and isinstance(el.get("elements"), list):
                    for child in el["elements"]:
                        if isinstance(child, dict) and child.get("isPlaceholder") and child.get("placeholderType"):
                            m = ooxml_placeholder_type_to_marker(str(child["placeholderType"]))
                            if m:
                                markers.add(m)
    return markers


def count_element_types(pptx_readable: Dict[str, Any]) -> Dict[str, int]:
    counts: Dict[str, int] = {}
    slides = pptx_readable.get("slides") or []
    if not isinstance(slides, list):
        return counts
    for el in _walk_elements(slides):
        k = str(el.get("type") or "unknown")
        counts[k] = counts.get(k, 0) + 1
    return counts


def build_pptx_readable_summary_for_manifest(pptx_readable: Dict[str, Any]) -> Dict[str, Any]:
    """Compact summary for manifest.json / AI prompts."""
    if not isinstance(pptx_readable, dict) or pptx_readable.get("error"):
        return {}
    slides = pptx_readable.get("slides") or []
    markers = sorted(collect_markers_union(pptx_readable))
    counts = count_element_types(pptx_readable)
    return {
        "slide_count": len(slides) if isinstance(slides, list) else 0,
        "theme_colors": (pptx_readable.get("themeColors") or [])[:12],
        "used_fonts": (pptx_readable.get("usedFonts") or [])[:32],
        "placeholder_markers_union": markers,
        "element_type_counts": counts,
        "truncated": bool(pptx_readable.get("truncated")),
        "canvas_pt": pptx_readable.get("size"),
    }


def summarize_pptx_readable_for_layout_overlay(pptx_readable: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Produce layout_package-oriented overlay: JSON Schema-ish properties + sample_data + chart_bindings hint.
    Returns None when unreadable / errored / empty slides.
    """
    if not isinstance(pptx_readable, dict) or pptx_readable.get("error"):
        return None
    slides = pptx_readable.get("slides") or []
    if not isinstance(slides, list) or not slides:
        return None

    markers = collect_markers_union(pptx_readable)
    counts = count_element_types(pptx_readable)
    chart_n = int(counts.get("chart") or 0)
    table_n = int(counts.get("table") or 0)

    props: Dict[str, Any] = {}
    sample: Dict[str, Any] = {}

    if "PAGE_TITLE" in markers:
        props["title"] = {"type": "string"}
        sample["title"] = "示例标题"
    if "SUBTITLE" in markers:
        props["subtitle"] = {"type": "string"}
        sample["subtitle"] = "示例副标题"
    if "CONTENT_AREA" in markers:
        props["content_points"] = {"type": "array", "items": {"type": "string"}}
        sample["content_points"] = ["要点一", "要点二"]
    if chart_n:
        props["chart_config"] = {"type": ["object", "null"]}
        sample["chart_config"] = {"type": "bar", "data": {"labels": [], "datasets": []}}
    if table_n:
        props["table_config"] = {"type": ["object", "null"]}
        sample["table_config"] = None

    if not props and chart_n == 0 and table_n == 0:
        return None

    schema = {"type": "object", "properties": props}
    bindings: List[str] = []
    if chart_n or "chart_config" in props:
        bindings.append("chart_config")
    if table_n:
        bindings.append("table_config")

    return {
        "data_schema": schema,
        "sample_data": sample,
        "chart_bindings": bindings if bindings else [],
        "markers_union": sorted(markers),
        "element_type_counts": counts,
    }
