"""
Inject ppt-master-style {{MARKER}} text into per-slide SVGs using PPTX layout hints (Round C).

Only runs when pptx_layout hints exist; best-effort coordinate mapping (normalized EMU bbox → SVG px).
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from typing import Any, Dict, List, Optional, Set


# pptx placeholder type suffix -> inner marker name (no braces)
_PH_TYPE_TO_MARKER: Dict[str, str] = {
    "TITLE": "PAGE_TITLE",
    "CENTER_TITLE": "PAGE_TITLE",
    "VERTICAL_TITLE": "PAGE_TITLE",
    "SUBTITLE": "SUBTITLE",
    "BODY": "CONTENT_AREA",
    "OBJECT": "CONTENT_AREA",
}


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
    Append <text> nodes with {{MARKER}} for the first TITLE / SUBTITLE / BODY placeholders.
    Skips if markers already appear in XML.
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
        if sh.get("shape_kind") == "chart":
            continue
        ph = sh.get("placeholder_type")
        if not ph or not sh.get("is_placeholder"):
            continue
        token_ph = str(ph).split(".")[-1].split("(")[0].strip().upper()
        marker = _PH_TYPE_TO_MARKER.get(token_ph)
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
        if len(placed) >= 3:
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


def inject_placeholders_into_workspace_svgs(
    svg_dir: Any,
    pptx_layout: Optional[Dict[str, Any]],
) -> None:
    """Mutate slide_*.svg files on disk when pptx_layout contains slides[]."""
    from pathlib import Path

    if not isinstance(pptx_layout, dict) or pptx_layout.get("error"):
        return
    slides = pptx_layout.get("slides") or []
    if not isinstance(slides, list) or not slides:
        return
    root = Path(svg_dir)
    if not root.is_dir():
        return
    by_index = {int(s.get("index", -1)): s for s in slides if isinstance(s, dict) and int(s.get("index", -1)) > 0}

    for p in sorted(root.glob("slide_*.svg")):
        m = re.match(r"slide_(\d+)\.svg$", p.name, re.I)
        if not m:
            continue
        idx = int(m.group(1))
        layout = by_index.get(idx)
        if not layout:
            continue
        try:
            raw = p.read_text(encoding="utf-8")
        except OSError:
            continue
        new_xml = inject_pptx_placeholders_into_slide_svg(raw, slide_layout=layout)
        if new_xml != raw:
            p.write_text(new_xml, encoding="utf-8")
