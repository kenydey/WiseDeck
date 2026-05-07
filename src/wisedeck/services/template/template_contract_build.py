"""Build persisted template_contract payload from workspace manifest (no FastAPI deps)."""

from __future__ import annotations

from typing import Any, Optional


def slim_python_pptx_manifest(py: object) -> Optional[dict[str, Any]]:
    if not isinstance(py, dict):
        return None
    if py.get("error"):
        return {"error": str(py.get("error"))[:400]}
    slim: dict[str, Any] = {}
    for k in ("slide_count", "slide_layouts", "errors"):
        if k in py:
            slim[k] = py[k]
    return slim if slim else None


def build_template_contract_from_manifest(
    manifest: dict[str, Any],
    *,
    slide_count: int,
    source_filename: str,
) -> dict[str, Any]:
    """Subset of workspace manifest stored on GlobalMasterTemplate for structured export / prompts."""
    out: dict[str, Any] = {
        "slide_count": int(slide_count or 0),
        "source_filename": source_filename or "",
        "pptx_readable": manifest.get("pptx_readable"),
        "pptx_readable_summary": manifest.get("pptx_readable_summary"),
        "layout_package": manifest.get("layout_package"),
        "pptx_layout": manifest.get("pptx_layout"),
    }
    # Newer structured import layers (optional, backward-compatible)
    for k in ("physical_structure", "mapping_rules", "layout_signatures", "static_elements"):
        v = manifest.get(k)
        if v is not None:
            out[k] = v
    slim_py = slim_python_pptx_manifest(manifest.get("python_pptx"))
    if slim_py is not None:
        out["python_pptx_meta"] = slim_py

    summary = manifest.get("pptx_readable_summary") if isinstance(manifest.get("pptx_readable_summary"), dict) else {}
    out["per_slide_layout_signatures"] = list(summary.get("per_slide_layout_signatures") or [])
    out["slide_notes_excerpts"] = list(summary.get("slide_notes_excerpts") or [])
    return out
