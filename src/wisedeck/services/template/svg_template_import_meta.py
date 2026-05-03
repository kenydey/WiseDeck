"""Helpers for SVG template import / office-convert manifest metadata (native export contract)."""

from __future__ import annotations

import hashlib
import re
from pathlib import Path
from typing import Any


def scan_svg_dir_placeholder_markers(svg_dir: Path) -> list[str]:
    from wisedeck.svg_export.placeholder_adapter import scan_svg_placeholder_inner_names

    union: set[str] = set()
    if not svg_dir.is_dir():
        return []
    for p in sorted(svg_dir.glob("slide_*.svg")):
        try:
            txt = p.read_text(encoding="utf-8")
        except OSError:
            continue
        union.update(scan_svg_placeholder_inner_names(txt))
    return sorted(union)


def guess_canvas_format_from_svg(svg_xml: str) -> str | None:
    if not isinstance(svg_xml, str) or not svg_xml.strip():
        return None
    vb = re.search(
        r"viewBox\s*=\s*[\"']([^\"']+)[\"']",
        svg_xml,
        re.I,
    )
    if not vb:
        return None
    parts = vb.group(1).replace(",", " ").split()
    if len(parts) < 4:
        return None
    try:
        w, h = float(parts[2]), float(parts[3])
    except ValueError:
        return None
    if w <= 0 or h <= 0:
        return None
    ar = w / h
    if abs(ar - 16 / 9) < 0.02:
        return "16:9"
    if abs(ar - 4 / 3) < 0.02:
        return "4:3"
    return None


def build_import_summary(
    *,
    svg_template: str | None,
    slide_count: int,
    bundle_mode: str | None,
    source_filename: str | None,
    pptx_layout: dict[str, Any] | None = None,
    template_provenance: str | None = None,
) -> dict[str, Any]:
    from wisedeck.svg_export.placeholder_adapter import scan_svg_placeholder_inner_names

    markers: list[str] = []
    if isinstance(svg_template, str) and svg_template.strip():
        markers = scan_svg_placeholder_inner_names(svg_template)
    joined = "|".join(markers)
    digest = hashlib.sha256(joined.encode("utf-8")).hexdigest() if joined else ""
    out: dict[str, Any] = {
        "slide_count": int(slide_count or 0),
        "bundle_mode": bundle_mode,
        "source_filename": source_filename,
        "placeholder_markers": markers,
        "placeholder_hash": digest,
        "canvas_format_guess": guess_canvas_format_from_svg(svg_template or ""),
    }
    if isinstance(pptx_layout, dict) and pptx_layout:
        # Strip oversized / error-only payloads for DB friendliness
        if not pptx_layout.get("error"):
            out["pptx_layout"] = pptx_layout
    if isinstance(template_provenance, str) and template_provenance.strip():
        out["template_provenance"] = template_provenance.strip()
    return out
