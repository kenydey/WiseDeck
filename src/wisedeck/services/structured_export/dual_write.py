"""
Dual-write: optional per-slide ``presenton_slide`` on ``slides_data[]`` (Presenton slide JSON).

When every slide row carries a complete ``presenton_slide`` dict, export can assemble the same
outer presentation wrapper as ``deck_to_presenton_presentation_json`` for validation / dual-write
metadata (``X-WiseDeck-Presentation-Source``).

Otherwise callers fall back to building from ``StructuredSlideDeckModel``.
"""

from __future__ import annotations

import copy
import uuid
from typing import Any, Dict, List, Optional


def _slide_row_ready_for_dual_write(row: Dict[str, Any]) -> bool:
    ps = row.get("presenton_slide")
    if not isinstance(ps, dict):
        return False
    lay = ps.get("layout")
    if not lay or ":" not in str(lay).strip():
        return False
    return isinstance(ps.get("content"), dict)


def try_assemble_presentation_from_dual_write(
    *,
    outline_slides: List[Any],
    slides_data: Optional[List[Any]],
    title: str,
    language: str,
) -> Optional[Dict[str, Any]]:
    """
    If ``slides_data[i].presenton_slide`` is complete for every outline slide index, build the
    outer Presenton presentation wrapper JSON.

    Returns None when lengths mismatch or any row is incomplete.
    """
    n = len(outline_slides)
    if n == 0:
        return None
    sd = slides_data if isinstance(slides_data, list) else []
    if len(sd) < n:
        return None

    assembled_slides: List[Dict[str, Any]] = []
    for i in range(n):
        row = sd[i]
        if not isinstance(row, dict) or not _slide_row_ready_for_dual_write(row):
            return None
        ps = row["presenton_slide"]
        slide = copy.deepcopy(ps)
        slide["index"] = i
        assembled_slides.append(slide)

    return {
        "id": str(uuid.uuid4()),
        "language": language,
        "layout": {"name": "mixed", "ordered": True, "slides": []},
        "n_slides": len(assembled_slides),
        "title": title,
        "slides": assembled_slides,
        "theme": None,
    }


def upsert_presenton_snapshots_on_slides_data(
    slides_data: Optional[List[Any]],
    outline_slide_count: int,
    presentation_slides: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Merge ``presentation_slides`` (from ``deck_to_presenton_presentation_json``) into
    ``slides_data[i].presenton_slide`` without removing other keys (e.g. ``html_content``).
    """
    out: List[Dict[str, Any]] = []
    base = slides_data if isinstance(slides_data, list) else []
    for i in range(outline_slide_count):
        row = dict(base[i]) if i < len(base) and isinstance(base[i], dict) else {}
        if i < len(presentation_slides):
            snap = copy.deepcopy(presentation_slides[i])
            snap["index"] = i
            row["presenton_slide"] = snap
        out.append(row)
    return out
