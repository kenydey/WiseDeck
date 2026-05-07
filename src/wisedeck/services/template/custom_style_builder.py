"""Build custom_style.json (v1) from Visual DNA signals."""

from __future__ import annotations

from typing import Any, Dict, Optional


def build_custom_style_v1(
    *,
    theme_name: str,
    primary_color: Optional[str],
    palette_top5: list[str],
    font_title: Optional[str],
    font_body: Optional[str],
    bottom_bar: Optional[Dict[str, Any]],
    assets_base_url: str,
) -> Dict[str, Any]:
    bg = "#FFFFFF"
    if palette_top5:
        # If primary is dark, keep white bg; else very light bg.
        bg = "#FFFFFF"

    global_block: Dict[str, Any] = {
        "background": bg,
        "fontFamily": font_body or font_title or "system-ui, -apple-system, Segoe UI, sans-serif",
        "primaryColor": primary_color or (palette_top5[0] if palette_top5 else "#2563EB"),
    }
    # Style diffusion v1: if we found a bottom decoration bar on the source,
    # apply it as a default decoration for content-like pages.
    if isinstance(bottom_bar, dict) and bottom_bar.get("color"):
        global_block["decoration_hint"] = {"bottom_bar": True}

    decoration: Dict[str, Any] = {}
    if isinstance(bottom_bar, dict) and bottom_bar.get("color"):
        decoration = {
            "type": "bar",
            "pos": "bottom",
            "color": bottom_bar.get("color"),
            "bbox_pct": bottom_bar.get("bbox_pct"),
        }

    # Minimal component slots; renderer will interpret bbox_pct.
    components: Dict[str, Any] = {
        "titleBox": {"x": 0.08, "y": 0.12, "w": 0.84, "h": 0.14, "textAlign": "left"},
        "contentBox": {"x": 0.08, "y": 0.30, "w": 0.84, "h": 0.56, "padding": "20px"},
        "decoration": decoration,
    }

    # Page-type presets (v1).
    layouts: Dict[str, Any] = {
        "cover": {"titleBox": {"y": 0.18, "h": 0.22}, "contentBox": {"y": 0.46, "h": 0.28}},
        "content_single": {},
        "content_two_column": {
            "leftBox": {"x": 0.08, "y": 0.30, "w": 0.40, "h": 0.56},
            "rightBox": {"x": 0.52, "y": 0.30, "w": 0.40, "h": 0.56},
        },
        "ending": {"titleBox": {"y": 0.28, "h": 0.22}, "contentBox": {"y": 0.58, "h": 0.18}},
    }

    tokens: Dict[str, Any] = {
        "paletteTop5": list(palette_top5 or []),
        "fontPair": {"title": font_title, "body": font_body},
    }

    return {
        "themeName": theme_name,
        "global": global_block,
        "tokens": tokens,
        # Phase2 heuristic: safe text region when background has strong focal risk.
        # Default neutral; generator/renderer may override per page_type.
        "safeTextRegion": {"x": 0.06, "y": 0.10, "w": 0.88, "h": 0.80},
        "components": components,
        "layouts": layouts,
        "rules": {
            "page_type_defaults": {
                "cover": "cover",
                "catalog": "content_two_column",
                "transition": "cover",
                "content": "content_single",
                "chart": "content_two_column",
                "ending": "ending",
            }
        },
        "assets": {"baseUrl": assets_base_url},
    }

