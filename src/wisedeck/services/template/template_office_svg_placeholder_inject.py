"""
Inject ppt-master-style {{MARKER}} text into per-slide SVGs using PPTX layout hints (Round C).

Only runs when pptx_layout hints exist; best-effort coordinate mapping (normalized EMU bbox → SVG px).
"""

from __future__ import annotations

import os
import re
from typing import Any, Dict, List, Optional, Set

from wisedeck.services.template.pptx_readable_placeholders import ooxml_placeholder_type_to_marker

_MAX_DISTINCT_MARKERS = 12
_INJECT_ENABLED = (os.getenv("WISEDECK_ENABLE_SVG_PLACEHOLDER_INJECTION") or "").strip().lower() in (
    "1",
    "true",
    "yes",
    "on",
)
_FALLBACK_ENABLED = (os.getenv("WISEDECK_ENABLE_SVG_PLACEHOLDER_FALLBACK") or "").strip().lower() in (
    "1",
    "true",
    "yes",
    "on",
)


def _svg_pixel_size(svg_xml: str) -> tuple[float, float]:
    vb = re.search(r"viewBox\s*=\s*[\"']([^\"']+)[\"']", svg_xml, re.I)
    if vb:
        parts = vb.group(1).replace(",", " ").split()
        if len(parts) >= 4:
            try:
                w, h = float(parts[2]), float(parts[3])
                if w > 0 and h > 0:
                    return w, h
            except ValueError:
                pass
    wm = re.search(r"\bwidth\s*=\s*[\"']([\d.]+)", svg_xml, re.I)
    hm = re.search(r"\bheight\s*=\s*[\"']([\d.]+)", svg_xml, re.I)
    if wm and hm:
        try:
            w, h = float(wm.group(1)), float(hm.group(1))
            if w > 0 and h > 0:
                return w, h
        except ValueError:
            pass
    return 1280.0, 720.0


def inject_pptx_placeholders_into_slide_svg(
    svg_xml: str,
    *,
    slide_layout: Optional[Dict[str, Any]],
) -> str:
    """
    Append <text> nodes with {{MARKER}} for placeholder shapes (python-pptx hints).
    Uses the same OOXML type → marker mapping as pptx_readable_placeholders.
    Skips shapes without placeholder metadata; skips duplicate markers already in SVG.
    """
    if not isinstance(svg_xml, str) or not svg_xml.strip():
        return svg_xml
    if not isinstance(slide_layout, dict):
        return svg_xml
    shapes = slide_layout.get("shapes") or []
    if not isinstance(shapes, list) or not shapes:
        return svg_xml

    w_px, h_px = _svg_pixel_size(svg_xml)
    placed: Set[str] = set()
    fragments: List[str] = []

    for sh in shapes:
        if not isinstance(sh, dict):
            continue
        ph = sh.get("placeholder_type")
        if not ph or not sh.get("is_placeholder"):
            continue
        marker = ooxml_placeholder_type_to_marker(str(ph))
        if not marker or marker in placed:
            continue
        token = "{{" + marker + "}}"
        if token in svg_xml:
            placed.add(marker)
            continue
        bbox = sh.get("bbox")
        if not isinstance(bbox, list) or len(bbox) < 4:
            continue
        try:
            l, t, bw, bh = float(bbox[0]), float(bbox[1]), float(bbox[2]), float(bbox[3])
        except (TypeError, ValueError):
            continue
        cx = (l + bw / 2.0) * w_px
        cy = (t + bh / 2.0) * h_px
        fs = max(12.0, min(44.0, bh * h_px * 0.45))
        fragments.append(
            f'<text x="{cx:.1f}" y="{cy:.1f}" font-family="Arial,sans-serif" font-size="{fs:.1f}" '
            f'fill="#1a1a1a" text-anchor="middle" dominant-baseline="middle">{token}</text>'
        )
        placed.add(marker)
        if len(placed) >= _MAX_DISTINCT_MARKERS:
            break

    if not fragments:
        return svg_xml

    # Insert before closing </svg> (last occurrence)
    lower = svg_xml.lower()
    idx = lower.rfind("</svg>")
    if idx < 0:
        return svg_xml
    insert = "\n" + "\n".join(fragments) + "\n"
    return svg_xml[:idx] + insert + svg_xml[idx:]


_FALLBACK_LAYOUT: Dict[str, Any] = {
    "shapes": [
        {
            "bbox": [0.05, 0.04, 0.9, 0.12],
            "placeholder_type": "TITLE",
            "is_placeholder": True,
            "shape_kind": "text",
        },
        {
            "bbox": [0.05, 0.22, 0.9, 0.65],
            "placeholder_type": "BODY",
            "is_placeholder": True,
            "shape_kind": "text",
        },
    ],
}


_REQUIRED_MARKERS = {"PAGE_TITLE", "CONTENT_AREA"}


def _svg_has_required_markers(svg_xml: str) -> bool:
    """Return True when the SVG already contains all required placeholder tokens."""
    for marker in _REQUIRED_MARKERS:
        if ("{{" + marker + "}}") not in svg_xml:
            return False
    return True


def inject_placeholders_into_workspace_svgs(
    svg_dir: Any,
    pptx_layout: Optional[Dict[str, Any]],
    *,
    pptx_readable: Optional[Dict[str, Any]] = None,
) -> None:
    """Mutate slide_*.svg files on disk.

    When pptx_readable is present, prefer pptxtojson placeholder geometry per slide;
    otherwise use python-pptx pptx_layout hints.
    After each slide, if required markers (PAGE_TITLE, CONTENT_AREA) are still
    missing, falls back to injecting them at canonical positions.
    This guarantees downstream placeholder scanning always finds markers.
    """
    if not _INJECT_ENABLED:
        return
    from pathlib import Path

    from wisedeck.services.template.pptx_readable_layout_bridge import (
        slide_layout_hints_from_pptx_readable_slide,
    )

    root = Path(svg_dir)
    if not root.is_dir():
        return

    has_hints = (
        isinstance(pptx_layout, dict)
        and not pptx_layout.get("error")
        and isinstance(pptx_layout.get("slides"), list)
        and len(pptx_layout["slides"]) > 0
    )

    if has_hints:
        slides = pptx_layout["slides"]
        by_index = {
            int(s.get("index", -1)): s
            for s in slides
            if isinstance(s, dict) and int(s.get("index", -1)) > 0
        }
    else:
        by_index = {}

    readable_by_index: Dict[int, Dict[str, Any]] = {}
    if isinstance(pptx_readable, dict) and not pptx_readable.get("error"):
        rslides = pptx_readable.get("slides") or []
        if isinstance(rslides, list):
            for i in range(1, len(rslides) + 1):
                h = slide_layout_hints_from_pptx_readable_slide(pptx_readable, i)
                if h and isinstance(h.get("shapes"), list) and h["shapes"]:
                    readable_by_index[i] = h

    for p in sorted(root.glob("slide_*.svg")):
        m = re.match(r"slide_(\d+)\.svg$", p.name, re.I)
        if not m:
            continue
        idx = int(m.group(1))
        try:
            raw = p.read_text(encoding="utf-8")
        except OSError:
            continue

        result = raw
        hint_layout = readable_by_index.get(idx) or by_index.get(idx)
        if hint_layout:
            result = inject_pptx_placeholders_into_slide_svg(result, slide_layout=hint_layout)

        if _FALLBACK_ENABLED and (not _svg_has_required_markers(result)):
            result = inject_pptx_placeholders_into_slide_svg(result, slide_layout=_FALLBACK_LAYOUT)

        if result != raw:
            p.write_text(result, encoding="utf-8")
