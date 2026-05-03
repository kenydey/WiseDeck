"""
HTML slide placeholders: allowed marker names (aligned with svg_native / pptx_readable) and per-slide requirements.
"""

from __future__ import annotations

import re
from typing import Any, Dict, FrozenSet, Optional, Set

# Align with global_master_template_service SVG validation allowed_exact + structured-import markers + TOC patterns.
_BASE_ALLOWED = frozenset(
    {
        "TITLE",
        "SUBTITLE",
        "DATE",
        "AUTHOR",
        "AUTHOR_EN",
        "CHAPTER_NUM",
        "CHAPTER_TITLE",
        "CHAPTER_TITLE_EN",
        "PAGE_TITLE",
        "CONTENT_AREA",
        "PAGE_NUM",
        "SOURCE",
        "THANK_YOU",
        "ENDING_SUBTITLE",
        "CLOSING_MESSAGE",
        "CONTACT_INFO",
        "CHART_AREA",
        "TABLE_AREA",
    }
)

_PLACEHOLDER_INNER_RE = re.compile(r"\{\{\s*([A-Z0-9_]+)\s*\}\}")


def _toc_like(inner: str) -> bool:
    return bool(re.match(r"^TOC_ITEM_\d+(?:_(?:TITLE|DESC))?$", inner))


def is_allowed_placeholder_inner(inner: str) -> bool:
    if not inner or inner != inner.upper():
        return False
    if inner in _BASE_ALLOWED:
        return True
    return _toc_like(inner)


ALLOWED_HTML_PLACEHOLDER_INNERS: FrozenSet[str] = frozenset(_BASE_ALLOWED)


def extract_placeholder_inners_from_html(html: str) -> Set[str]:
    """Return uppercase inner names found as {{NAME}} in HTML text."""
    if not html or not isinstance(html, str):
        return set()
    found: Set[str] = set()
    for m in _PLACEHOLDER_INNER_RE.finditer(html):
        inner = (m.group(1) or "").strip().upper()
        if inner:
            found.add(inner)
    return found


def _markers_union_from_template(template_record: Optional[Dict[str, Any]]) -> Set[str]:
    if not isinstance(template_record, dict):
        return set()
    imp = template_record.get("import_summary")
    if not isinstance(imp, dict):
        return set()
    tc = imp.get("template_contract")
    summary = tc.get("pptx_readable_summary") if isinstance(tc, dict) else None
    raw: Any = []
    if isinstance(summary, dict):
        raw = summary.get("placeholder_markers_union") or []
    if not raw and isinstance(imp, dict):
        raw = imp.get("placeholder_markers") or []
    out: Set[str] = set()
    if isinstance(raw, list):
        for x in raw:
            if isinstance(x, str) and x.strip():
                out.add(x.strip().upper())
    return out


def _slide_hints_chart_table(slide_data: Optional[Dict[str, Any]]) -> tuple[bool, bool]:
    if not isinstance(slide_data, dict):
        return False, False
    st = str(slide_data.get("slide_type") or slide_data.get("type") or "").lower()
    wants_chart = any(
        k in st for k in ("chart", "graph", "数据", "figure")
    ) or bool(slide_data.get("chart_config") or slide_data.get("chart"))
    wants_table = any(k in st for k in ("table", "表格")) or bool(slide_data.get("table_config") or slide_data.get("table"))
    return wants_chart, wants_table


def required_markers_for_slide(
    template_record: Optional[Dict[str, Any]],
    slide_data: Optional[Dict[str, Any]],
    page_number: int,
) -> Set[str]:
    """
    Markers we deterministically enforce for this slide.
    Empty set means skip enforcement (no structured contract / union).
    """
    union = _markers_union_from_template(template_record)
    if not union:
        return set()

    union_ok = {m for m in union if is_allowed_placeholder_inner(m)}
    required: Set[str] = set()

    if "PAGE_TITLE" in union_ok:
        required.add("PAGE_TITLE")

    if "SUBTITLE" in union_ok and page_number <= 1:
        required.add("SUBTITLE")

    if "CONTENT_AREA" in union_ok:
        pts = slide_data.get("bullet_points") if isinstance(slide_data, dict) else None
        content = slide_data.get("content") if isinstance(slide_data, dict) else None
        points = slide_data.get("points") if isinstance(slide_data, dict) else None
        body_txt = slide_data.get("body") if isinstance(slide_data, dict) else None
        has_body = bool(
            pts or content or points or body_txt or (page_number > 1)
        )
        if has_body:
            required.add("CONTENT_AREA")

    wants_chart, wants_table = _slide_hints_chart_table(slide_data if isinstance(slide_data, dict) else None)
    if "CHART_AREA" in union_ok and wants_chart:
        required.add("CHART_AREA")
    if "TABLE_AREA" in union_ok and wants_table:
        required.add("TABLE_AREA")

    for m in union_ok:
        if _toc_like(m):
            required.add(m)

    return {m for m in required if is_allowed_placeholder_inner(m)}
