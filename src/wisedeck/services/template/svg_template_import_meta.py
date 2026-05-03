"""Helpers for SVG template import / office-convert manifest metadata (native export contract)."""

from __future__ import annotations

import hashlib
import os
import re
from pathlib import Path
from typing import Any


def trim_svg_slide_xmls_for_persistence(slides: list[str]) -> tuple[list[str] | None, list[str]]:
    """Drop per-slide persistence when deck exceeds configured limits (JSON / DB size)."""
    warnings: list[str] = []
    if not slides:
        return None, warnings
    max_pages = int(os.getenv("WISEDECK_TEMPLATE_IMPORT_SVG_SLIDES_MAX_PAGES", "80"))
    max_chars = int(os.getenv("WISEDECK_TEMPLATE_IMPORT_SVG_SLIDES_MAX_TOTAL_CHARS", str(5 * 1024 * 1024)))
    if len(slides) > max_pages:
        warnings.append(
            f"逐页 SVG 未写入 import_summary：页数 {len(slides)} 超过上限 {max_pages}"
        )
        return None, warnings
    total_bytes = sum(len(s.encode("utf-8")) for s in slides)
    if total_bytes > max_chars:
        warnings.append(
            f"逐页 SVG 未写入 import_summary：总大小约 {total_bytes} 字节超过上限 {max_chars}"
        )
        return None, warnings
    return slides, warnings


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
    svg_slide_xmls: list[str] | None = None,
) -> dict[str, Any]:
    from wisedeck.svg_export.placeholder_adapter import scan_svg_placeholder_inner_names

    markers_union: set[str] = set()
    per_slide = svg_slide_xmls if svg_slide_xmls else []
    for xml in per_slide:
        markers_union.update(scan_svg_placeholder_inner_names(xml))
    if isinstance(svg_template, str) and svg_template.strip():
        markers_union.update(scan_svg_placeholder_inner_names(svg_template))
    markers = sorted(markers_union)
    joined = "|".join(markers)
    digest = hashlib.sha256(joined.encode("utf-8")).hexdigest() if joined else ""
    canvas_src = ""
    if per_slide:
        canvas_src = per_slide[0]
    elif isinstance(svg_template, str):
        canvas_src = svg_template
    out: dict[str, Any] = {
        "slide_count": int(slide_count or 0),
        "bundle_mode": bundle_mode,
        "source_filename": source_filename,
        "placeholder_markers": markers,
        "placeholder_hash": digest,
        "canvas_format_guess": guess_canvas_format_from_svg(canvas_src),
    }
    if isinstance(pptx_layout, dict) and pptx_layout:
        # Strip oversized / error-only payloads for DB friendliness
        if not pptx_layout.get("error"):
            out["pptx_layout"] = pptx_layout
    if isinstance(template_provenance, str) and template_provenance.strip():
        out["template_provenance"] = template_provenance.strip()

    if svg_slide_xmls:
        out["svg_slide_xmls"] = svg_slide_xmls
        out["visual_persistence_version"] = 1
        out["native_export_mode"] = "per_slide"
        out["visual_mode"] = "merged_and_pages"
    elif isinstance(svg_template, str) and svg_template.strip():
        out["native_export_mode"] = "legacy_single"

    return out
