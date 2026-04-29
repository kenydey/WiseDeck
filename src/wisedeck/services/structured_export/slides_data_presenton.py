"""
Helpers to merge editor slides_data with outline for structured export.

Editor iframe slides use HTML (`html_content`); Presenton pdf-maker expects
`layout_group` + `layout` + structured `content`. Optional keys on each
slides_data row allow aligning export templates with preview when supplied.
"""

from __future__ import annotations

from typing import Any, Dict, Optional, Tuple


def presenton_hints_from_slides_data_row(row: Dict[str, Any]) -> Tuple[Optional[str], Optional[str]]:
    """
    Read optional Presenton layout hints from one slides_data dict.

    Supported keys (first match wins full-layout form):

    - ``structured_export_layout``: full id ``templateGroup:layoutId`` (recommended).
    - ``presenton_layout_full``: same as above.

    Separate keys:

    - ``structured_export_layout_group`` / ``presenton_layout_group``
    - ``structured_export_layout`` / ``presenton_layout`` — layout id without group,
      or full id if it contains ':'.

    Returns ``(layout_group, layout)`` where ``layout`` must include ':' for Presenton ids.
    """
    if not row:
        return None, None

    full = row.get("structured_export_layout") or row.get("presenton_layout_full")
    if isinstance(full, str):
        fs = full.strip()
        if fs and ":" in fs:
            group = fs.split(":", 1)[0].strip()
            return (group or None, fs)

    lg = row.get("structured_export_layout_group") or row.get("presenton_layout_group")
    lay = row.get("structured_export_layout") or row.get("presenton_layout")
    lg_s = lg.strip() if isinstance(lg, str) else None
    lay_s = lay.strip() if isinstance(lay, str) else None
    if not lg_s and not lay_s:
        return None, None
    if lay_s and ":" in lay_s:
        return lay_s.split(":", 1)[0].strip() or None, lay_s
    if lg_s and lay_s:
        return lg_s, f"{lg_s}:{lay_s}"
    return lg_s, lay_s


def merge_outline_slide_with_slides_data(
    outline_slide: Dict[str, Any],
    slides_data_row: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """Prefer titles/points from slides_data when present; chart_config stays from outline."""
    merged = dict(outline_slide)
    if not slides_data_row or not isinstance(slides_data_row, dict):
        return merged

    t = slides_data_row.get("title")
    if isinstance(t, str) and t.strip():
        merged["title"] = t.strip()

    cp = slides_data_row.get("content_points")
    if isinstance(cp, list) and len(cp) > 0:
        merged["content_points"] = cp
    elif isinstance(slides_data_row.get("bullet_points"), list) and slides_data_row["bullet_points"]:
        merged["content_points"] = slides_data_row["bullet_points"]

    st = slides_data_row.get("slide_type")
    if isinstance(st, str) and st.strip():
        merged["slide_type"] = st.strip()

    return merged
