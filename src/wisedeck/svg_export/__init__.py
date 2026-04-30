"""
SVG/DrawingML native PPTX export (ppt-master style).

This package provides a stable WiseDeck-facing API while delegating the heavy
SVG->DrawingML conversion to ppt-master's implementation.
"""

from .engine import render_pptx_from_svg_templates

__all__ = ["render_pptx_from_svg_templates"]

