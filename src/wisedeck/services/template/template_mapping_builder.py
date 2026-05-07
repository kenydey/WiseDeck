"""
Build logical mapping rules from extracted physical structures.

This is a lightweight, backward-compatible layer:
- The runtime renderer still uses marker tokens ({{PAGE_TITLE}}, {{CONTENT_AREA}}, ...).
- We additionally record shape_id-based mapping candidates for future native PPTX backfill.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple


def _pick_best_shape_for_role(
    shapes: List[Dict[str, Any]],
    *,
    role: str,
) -> Optional[Dict[str, Any]]:
    """
    Heuristic picker based on placeholder type and geometry.
    role: title | subtitle | body | chart | table
    """
    candidates: List[Tuple[float, Dict[str, Any]]] = []

    for sh in shapes:
        if not isinstance(sh, dict):
            continue
        if not sh.get("is_placeholder"):
            continue
        bbox = sh.get("bbox")
        if not (isinstance(bbox, list) and len(bbox) >= 4):
            continue
        l, t, w, h = bbox[:4]
        try:
            l, t, w, h = float(l), float(t), float(w), float(h)
        except Exception:
            continue

        ph = str(sh.get("placeholder_type") or "").upper()
        kind = str(sh.get("kind") or sh.get("shape_kind") or "").lower()

        score = 0.0
        if role == "title":
            if ph in {"TITLE", "CTRTITLE", "CENTERTITLE", "VERTICALTITLE"}:
                score += 10
            score += max(0.0, (0.30 - t) * 10)
            score += w * 2
        elif role == "subtitle":
            if ph in {"SUBTITLE"}:
                score += 10
            score += max(0.0, (0.40 - t) * 6)
            score += w * 1.2
        elif role == "body":
            if ph in {"BODY", "OBJECT"}:
                score += 10
            score += max(0.0, (t - 0.18) * 4)
            score += (w * h) * 2
        elif role == "chart":
            if ph in {"CHART"} or kind == "chart":
                score += 10
            score += (w * h) * 2
        elif role == "table":
            if ph in {"TBL", "TABLE"} or kind == "table":
                score += 10
            score += (w * h) * 2

        candidates.append((score, sh))

    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]


def _marker_for_role(role: str) -> str:
    return {
        "title": "PAGE_TITLE",
        "subtitle": "SUBTITLE",
        "body": "CONTENT_AREA",
        "chart": "CHART_AREA",
        "table": "TABLE_AREA",
    }.get(role, "")


def build_mapping_rules_from_physical_structure(
    physical_structure: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Output:
      {
        "schema_version": 1,
        "rules": {
          "fields": { title/subtitle/body/...: {marker, shape_candidates:[...]} },
          "layout_signatures": [{index, layout_name, markers, roles}],
        }
      }
    """
    if not isinstance(physical_structure, dict) or physical_structure.get("error"):
        return {"schema_version": 1, "error": "physical_structure_unavailable"}

    slides = physical_structure.get("slides") or []
    if not isinstance(slides, list) or not slides:
        return {"schema_version": 1, "error": "empty_slides"}

    layout_signatures: List[Dict[str, Any]] = []
    # Aggregate field candidates across slides (for global hints)
    fields: Dict[str, Dict[str, Any]] = {}

    for slide in slides:
        if not isinstance(slide, dict):
            continue
        idx = int(slide.get("index") or 0)
        layout_name = str(slide.get("layout_name") or "")
        shapes = slide.get("shapes") or []
        if not isinstance(shapes, list):
            shapes = []

        picked: Dict[str, Optional[Dict[str, Any]]] = {
            "title": _pick_best_shape_for_role(shapes, role="title"),
            "subtitle": _pick_best_shape_for_role(shapes, role="subtitle"),
            "body": _pick_best_shape_for_role(shapes, role="body"),
            "chart": _pick_best_shape_for_role(shapes, role="chart"),
            "table": _pick_best_shape_for_role(shapes, role="table"),
        }

        slide_markers: List[str] = []
        slide_roles: List[str] = []
        for role, sh in picked.items():
            if not sh:
                continue
            marker = _marker_for_role(role)
            if marker:
                slide_markers.append(marker)
                slide_roles.append(role)

            # add to global fields hints
            slot = fields.get(role)
            if slot is None:
                slot = {
                    "marker": marker,
                    "shape_candidates": [],
                }
                fields[role] = slot
            cand = {
                "slide_index": idx,
                "shape_id": sh.get("shape_id"),
                "placeholder_type": sh.get("placeholder_type"),
                "bbox": sh.get("bbox"),
                "layout_name": layout_name,
            }
            slot["shape_candidates"].append(cand)

        layout_signatures.append(
            {
                "index": idx,
                "layout_name": layout_name,
                "markers": sorted(set(slide_markers)),
                "roles": slide_roles,
            }
        )

    return {
        "schema_version": 1,
        "rules": {
            "fields": fields,
            "layout_signatures": layout_signatures,
        },
    }


__all__ = ["build_mapping_rules_from_physical_structure"]

