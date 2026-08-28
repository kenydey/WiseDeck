"""Render PPTist Slide JSON to deterministic preview HTML (SSOT-friendly)."""

from __future__ import annotations

from typing import Any, Dict

from .slide_visual_sync import pptist_elements_to_preview_html


def pptist_slide_to_preview_html(slide: Dict[str, Any]) -> str:
    return pptist_elements_to_preview_html(slide)
