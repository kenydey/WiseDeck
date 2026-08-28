"""Normalize slide background dicts to PPTist SlideBackground shape."""

from __future__ import annotations

from typing import Any, Dict, Optional


def fix_slide_image_url(src: Optional[str], base_host: str = "http://127.0.0.1:8000") -> str:
    if not src:
        return ""
    if src.startswith("data:") or src.startswith("http://") or src.startswith("https://"):
        return src
    if src.startswith("/") and not src.startswith("//"):
        return f"{base_host}{src}"
    return src


def normalize_slide_background(bg: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """
    PPTist expects:
      solid: { type, color }
      image: { type, image: { src, size }, color? }
      gradient: { type, gradient: Gradient }
    Legacy WiseDeck used { type: 'image', src: '...' } — normalize here.
    """
    if not bg:
        return {"type": "solid", "color": "#ffffff"}

    btype = bg.get("type") or "solid"

    if btype == "solid":
        return {"type": "solid", "color": bg.get("color") or "#ffffff"}

    if btype == "image":
        nested = bg.get("image")
        src = ""
        size = "cover"
        if isinstance(nested, dict):
            src = nested.get("src") or ""
            size = nested.get("size") or "cover"
        if not src:
            src = bg.get("src") or ""
        src = fix_slide_image_url(src)
        if src:
            return {
                "type": "image",
                "color": bg.get("color") or "#ffffff",
                "image": {"src": src, "size": size},
            }
        return {"type": "solid", "color": bg.get("color") or "#ffffff"}

    if btype == "gradient" and bg.get("gradient"):
        return {
            "type": "gradient",
            "gradient": bg["gradient"],
        }

    # Unknown / legacy gradient string — fallback
    if btype == "gradient":
        return {"type": "solid", "color": "#f5f2eb"}

    return {"type": "solid", "color": "#ffffff"}
