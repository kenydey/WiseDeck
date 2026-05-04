"""
Map pptx_readable (pptxtojson fork) placeholder OOXML types → WiseDeck SVG markers / layout hints.

Single source for OOXML → marker names; template_office_svg_placeholder_inject imports ooxml_placeholder_type_to_marker.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Set

_MAX_SLIDES_SIGNATURES = 80
_NOTE_EXCERPT_CHARS = 120
_SLIDE_NOTES_TOTAL_MAX_BYTES = 8192


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

    def walk(el: Any) -> None:
        if not isinstance(el, dict):
            return
        out.append(el)
        if el.get("type") == "group" and isinstance(el.get("elements"), list):
            for child in el["elements"]:
                walk(child)

    for slide in slides:
        if not isinstance(slide, dict):
            continue
        for bucket in ("elements", "layoutElements"):
            for el in slide.get(bucket) or []:
                walk(el)
    return out


def collect_markers_union(pptx_readable: Dict[str, Any]) -> Set[str]:
    markers: Set[str] = set()

    def walk_element(el: Any) -> None:
        if not isinstance(el, dict):
            return
        if el.get("isPlaceholder") and el.get("placeholderType"):
            m = ooxml_placeholder_type_to_marker(str(el["placeholderType"]))
            if m:
                markers.add(m)
        if el.get("type") == "group" and isinstance(el.get("elements"), list):
            for child in el["elements"]:
                walk_element(child)

    for slide in pptx_readable.get("slides") or []:
        if not isinstance(slide, dict):
            continue
        for bucket in ("elements", "layoutElements"):
            for el in slide.get(bucket) or []:
                walk_element(el)
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


def _walk_slide_elements(slide: Dict[str, Any]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []

    def walk(el: Any) -> None:
        if not isinstance(el, dict):
            return
        out.append(el)
        if el.get("type") == "group" and isinstance(el.get("elements"), list):
            for child in el["elements"]:
                walk(child)

    for bucket in ("elements", "layoutElements"):
        for el in slide.get(bucket) or []:
            walk(el)
    return out


def collect_markers_for_slide(slide: Dict[str, Any]) -> Set[str]:
    markers: Set[str] = set()

    def walk_element(el: Any) -> None:
        if not isinstance(el, dict):
            return
        if el.get("isPlaceholder") and el.get("placeholderType"):
            m = ooxml_placeholder_type_to_marker(str(el["placeholderType"]))
            if m:
                markers.add(m)
        if el.get("type") == "group" and isinstance(el.get("elements"), list):
            for child in el["elements"]:
                walk_element(child)

    for bucket in ("elements", "layoutElements"):
        for el in slide.get(bucket) or []:
            walk_element(el)
    return markers


def count_element_types_for_slide(slide: Dict[str, Any]) -> Dict[str, int]:
    counts: Dict[str, int] = {}
    for el in _walk_slide_elements(slide if isinstance(slide, dict) else {}):
        k = str(el.get("type") or "unknown")
        counts[k] = counts.get(k, 0) + 1
    return counts


def _truncate_note_excerpt(note: Any, max_chars: int = _NOTE_EXCERPT_CHARS) -> str:
    if note is None:
        return ""
    s = str(note).replace("\r\n", "\n").replace("\r", "\n").strip()
    if not s:
        return ""
    if len(s) <= max_chars:
        return s
    return s[: max_chars - 1] + "…"


def _build_slide_notes_excerpts(slides: List[Dict[str, Any]]) -> List[str]:
    excerpts: List[str] = []
    total = 0
    cap_hit = False
    for slide in slides:
        if not isinstance(slide, dict):
            excerpts.append("")
            continue
        if cap_hit:
            excerpts.append("")
            continue
        ex = _truncate_note_excerpt(slide.get("note"))
        b = len(ex.encode("utf-8"))
        if total + b > _SLIDE_NOTES_TOTAL_MAX_BYTES:
            budget = max(0, _SLIDE_NOTES_TOTAL_MAX_BYTES - total - 4)
            if budget <= 0:
                excerpts.append("")
                cap_hit = True
                continue
            cut = ex.encode("utf-8")[:budget].decode("utf-8", errors="ignore")
            excerpts.append((cut + "…") if cut else "")
            cap_hit = True
        else:
            excerpts.append(ex)
            total += b
    return excerpts


def build_per_slide_layout_signatures(pptx_readable: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Compact per-slide signature for prompts / policy (pptxtojson-derived).
    """
    if not isinstance(pptx_readable, dict) or pptx_readable.get("error"):
        return []
    slides = pptx_readable.get("slides") or []
    if not isinstance(slides, list):
        return []
    out: List[Dict[str, Any]] = []
    notes_excerpts = _build_slide_notes_excerpts([s for s in slides if isinstance(s, dict)])
    for i, slide in enumerate(slides[:_MAX_SLIDES_SIGNATURES], start=1):
        if not isinstance(slide, dict):
            continue
        markers = sorted(collect_markers_for_slide(slide))
        kinds = count_element_types_for_slide(slide)
        note_ex = notes_excerpts[i - 1] if i - 1 < len(notes_excerpts) else _truncate_note_excerpt(slide.get("note"))
        out.append(
            {
                "index": i,
                "placeholder_markers": markers,
                "element_kinds": kinds,
                "has_chart": bool(kinds.get("chart")),
                "has_table": bool(kinds.get("table")),
                "has_diagram": bool(kinds.get("diagram")),
                "has_math": bool(kinds.get("math")),
                "note_excerpt": note_ex,
            }
        )
    return out


def _schema_props_for_markers(
    markers: Set[str],
    *,
    has_chart: bool,
    has_table: bool,
) -> tuple[Dict[str, Any], Dict[str, Any], List[str]]:
    props: Dict[str, Any] = {}
    sample: Dict[str, Any] = {}
    bindings: List[str] = []
    if "PAGE_TITLE" in markers:
        props["title"] = {"type": "string"}
        sample["title"] = "示例标题"
    if "SUBTITLE" in markers:
        props["subtitle"] = {"type": "string"}
        sample["subtitle"] = "示例副标题"
    if "CONTENT_AREA" in markers:
        props["content_points"] = {"type": "array", "items": {"type": "string"}}
        sample["content_points"] = ["要点一", "要点二"]
    if has_chart:
        props["chart_config"] = {"type": ["object", "null"]}
        sample["chart_config"] = {"type": "bar", "data": {"labels": [], "datasets": []}}
        bindings.append("chart_config")
    if has_table:
        props["table_config"] = {"type": ["object", "null"]}
        sample["table_config"] = None
        bindings.append("table_config")
    return props, sample, bindings


def build_per_slide_data_schemas(pptx_readable: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Per-slide JSON-schema style hints for layout_package overlay."""
    if not isinstance(pptx_readable, dict) or pptx_readable.get("error"):
        return []
    slides = pptx_readable.get("slides") or []
    if not isinstance(slides, list):
        return []
    out: List[Dict[str, Any]] = []
    for i, slide in enumerate(slides[:_MAX_SLIDES_SIGNATURES], start=1):
        if not isinstance(slide, dict):
            continue
        markers = collect_markers_for_slide(slide)
        kinds = count_element_types_for_slide(slide)
        has_chart = bool(kinds.get("chart"))
        has_table = bool(kinds.get("table"))
        props, sample, bindings = _schema_props_for_markers(
            markers, has_chart=has_chart, has_table=has_table
        )
        schema = {"type": "object", "properties": props}
        out.append(
            {
                "index": i,
                "schema": schema,
                "sample_data": sample,
                "chart_bindings": bindings,
                "placeholder_markers": sorted(markers),
            }
        )
    return out


def build_pptx_readable_summary_for_manifest(pptx_readable: Dict[str, Any]) -> Dict[str, Any]:
    """Compact summary for manifest.json / AI prompts."""
    if not isinstance(pptx_readable, dict) or pptx_readable.get("error"):
        return {}
    slides = pptx_readable.get("slides") or []
    markers = sorted(collect_markers_union(pptx_readable))
    counts = count_element_types(pptx_readable)
    theme_colors = (pptx_readable.get("themeColors") or [])[:12]
    per_slide = build_per_slide_layout_signatures(pptx_readable)
    notes_list = [s.get("note_excerpt", "") for s in per_slide] if per_slide else []
    return {
        "slide_count": len(slides) if isinstance(slides, list) else 0,
        "theme_colors": theme_colors,
        "theme_palette": list(theme_colors),
        "used_fonts": (pptx_readable.get("usedFonts") or [])[:32],
        "placeholder_markers_union": markers,
        "element_type_counts": counts,
        "truncated": bool(pptx_readable.get("truncated")),
        "canvas_pt": pptx_readable.get("size"),
        "per_slide_layout_signatures": per_slide,
        "slide_notes_excerpts": notes_list,
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

    props, sample, bindings = _schema_props_for_markers(
        markers, has_chart=chart_n > 0, has_table=table_n > 0
    )

    schema = {"type": "object", "properties": props}
    per_slide = build_per_slide_data_schemas(pptx_readable)

    return {
        "data_schema": schema,
        "sample_data": sample,
        "chart_bindings": bindings if bindings else [],
        "markers_union": sorted(markers),
        "element_type_counts": counts,
        "per_slide_data_schemas": per_slide,
    }
