"""
Layout helpers for python-pptx structured paths (slide size clamp, HTML table parsing, px/pt).

Inspired by common patterns in bbox-to-pptx pipelines; keep WiseDeck-specific coordinate
assumptions documented at call sites.
"""

from __future__ import annotations

import html as html_module
import re
from typing import List, Tuple


# python-pptx practical limits (inches); see python-pptx issues for EMU bounds.
MAX_SLIDE_DIMENSION_IN = 56.0
MIN_SLIDE_DIMENSION_IN = 1.0
DEFAULT_DPI = 96


def pixels_to_inches(px: float, dpi: int = DEFAULT_DPI) -> float:
    return float(px) / float(dpi or DEFAULT_DPI)


def clamp_slide_size_inches(
    width_px: float,
    height_px: float,
    *,
    dpi: int = DEFAULT_DPI,
) -> Tuple[float, float]:
    """
    Convert pixel canvas to inches and scale down uniformly if outside python-pptx limits,
    preserving aspect ratio (same idea as common PPTXBuilder helpers).
    """
    w_in = pixels_to_inches(width_px, dpi=dpi)
    h_in = pixels_to_inches(height_px, dpi=dpi)
    scale = 1.0
    if w_in > MAX_SLIDE_DIMENSION_IN:
        scale = min(scale, MAX_SLIDE_DIMENSION_IN / w_in)
    if h_in > MAX_SLIDE_DIMENSION_IN:
        scale = min(scale, MAX_SLIDE_DIMENSION_IN / h_in)
    w_in *= scale
    h_in *= scale
    w_in = max(MIN_SLIDE_DIMENSION_IN, w_in)
    h_in = max(MIN_SLIDE_DIMENSION_IN, h_in)
    return w_in, h_in


def parse_simple_html_table(html: str) -> List[List[str]]:
    """
    Best-effort parse of a single HTML table into rows of plain-text cells.

    Intended for small outline tables, not full HTML5 compliance.
    """
    if not isinstance(html, str) or not html.strip():
        return []
    rows: List[List[str]] = []
    for tr_block in re.findall(r"<tr[^>]*>(.*?)</tr>", html, flags=re.I | re.S):
        cells: List[str] = []
        for td in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr_block, flags=re.I | re.S):
            text = re.sub(r"<[^>]+>", " ", td)
            text = html_module.unescape(text)
            text = " ".join(text.split())
            cells.append(text.strip())
        if cells:
            rows.append(cells)
    return rows
