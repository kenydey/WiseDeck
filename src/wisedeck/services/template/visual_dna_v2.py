"""Visual DNA extraction v2 (richer) from PPTX via python-pptx.

This is still a best-effort extractor. It focuses on:
- master/layout usage frequency (choose dominant master/layout signals)
- paletteTop5 with lightweight clustering
- fontPair + fallback stacks
- exporting picture assets (logo/background candidates) from shapes
- EMU->pct geometry normalization
"""

from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from .visual_dna_v1 import _hex_from_rgb, _extract_text_font_info, _shape_fill_hex, _shape_line_hex


def _quantize_hex(hex_color: str, step: int = 32) -> str:
    try:
        s = hex_color.lstrip("#")
        r = int(s[0:2], 16)
        g = int(s[2:4], 16)
        b = int(s[4:6], 16)
        rq = int(round(r / step) * step)
        gq = int(round(g / step) * step)
        bq = int(round(b / step) * step)
        rq = max(0, min(255, rq))
        gq = max(0, min(255, gq))
        bq = max(0, min(255, bq))
        return f"#{rq:02X}{gq:02X}{bq:02X}"
    except Exception:
        return hex_color


def _top_colors_clustered(colors: List[str], k: int = 5) -> List[str]:
    # Lightweight clustering by quantization bucket.
    freq: Dict[str, int] = {}
    for c in colors:
        q = _quantize_hex(c)
        freq[q] = freq.get(q, 0) + 1
    ordered = sorted(freq.items(), key=lambda kv: kv[1], reverse=True)
    return [c for c, _n in ordered[:k]]


def _shape_picture_blob(shape: Any) -> Optional[bytes]:
    try:
        if not hasattr(shape, "image"):
            return None
        img = shape.image
        blob = getattr(img, "blob", None)
        return blob if isinstance(blob, (bytes, bytearray)) else None
    except Exception:
        return None


@dataclass
class VisualDNAV2:
    style_id: str
    slide_count: int
    palette_top5: List[str]
    primary_color: Optional[str]
    fonts: Dict[str, Any]
    master_selection: Dict[str, Any]
    exported_assets: List[Dict[str, Any]]
    warnings: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "schema_version": 2,
            "style_id": self.style_id,
            "slide_count": self.slide_count,
            "color_palette": {
                "paletteTop5": self.palette_top5,
                "primaryColor": self.primary_color,
            },
            "fonts": self.fonts,
            "master_selection": self.master_selection,
            "assets": self.exported_assets,
            "warnings": self.warnings,
        }


def extract_visual_dna_v2(
    *,
    pptx_bytes: bytes,
    style_id: str,
    assets_out_dir: Path,
) -> VisualDNAV2:
    warnings: List[str] = []
    exported: List[Dict[str, Any]] = []
    colors: List[str] = []
    title_fonts: List[str] = []
    body_fonts: List[str] = []

    try:
        from pptx import Presentation  # type: ignore
    except Exception as e:
        return VisualDNAV2(
            style_id=style_id,
            slide_count=0,
            palette_top5=[],
            primary_color=None,
            fonts={},
            master_selection={},
            exported_assets=[],
            warnings=[f"python-pptx unavailable: {str(e)[:200]}"],
        )

    prs = Presentation(BytesIO(pptx_bytes))
    slides = list(prs.slides)
    slide_count = len(slides)

    # Master/layout usage frequency (best-effort).
    layout_freq: Dict[str, int] = {}
    for slide in slides:
        try:
            layout = slide.slide_layout
            name = getattr(layout, "name", None) or "layout"
            layout_freq[str(name)] = layout_freq.get(str(name), 0) + 1
        except Exception:
            continue
    dominant_layout = None
    if layout_freq:
        dominant_layout = sorted(layout_freq.items(), key=lambda kv: kv[1], reverse=True)[0][0]

    # Scan shapes for colors/fonts/assets (cap for performance).
    sw = float(getattr(prs, "slide_width", 0) or 0) or 1.0
    sh = float(getattr(prs, "slide_height", 0) or 0) or 1.0

    assets_out_dir.mkdir(parents=True, exist_ok=True)
    for si, slide in enumerate(slides[:24], start=1):
        try:
            for shape in list(getattr(slide, "shapes", []) or [])[:300]:
                c = _shape_fill_hex(shape) or _shape_line_hex(shape)
                if c:
                    colors.append(c)

                fn, fs = _extract_text_font_info(shape)
                if fn:
                    if fs and fs >= 28:
                        title_fonts.append(fn)
                    else:
                        body_fonts.append(fn)

                blob = _shape_picture_blob(shape)
                if blob:
                    # Export as png/jpg depending on ext when available.
                    ext = "png"
                    try:
                        ext0 = getattr(shape.image, "ext", None)
                        if isinstance(ext0, str) and ext0.strip():
                            ext = ext0.strip().lower().lstrip(".")
                    except Exception:
                        pass
                    asset_id = f"img_{style_id}_{si}_{len(exported)+1}"
                    rel = f"assets/{asset_id}.{ext}"
                    out_path = assets_out_dir / rel
                    out_path.parent.mkdir(parents=True, exist_ok=True)
                    out_path.write_bytes(bytes(blob))

                    # Basic bbox_pct
                    try:
                        l = float(getattr(shape, "left", 0) or 0) / sw
                        t = float(getattr(shape, "top", 0) or 0) / sh
                        w = float(getattr(shape, "width", 0) or 0) / sw
                        h = float(getattr(shape, "height", 0) or 0) / sh
                        bbox = [l, t, w, h]
                    except Exception:
                        bbox = None

                    role = "image"
                    if bbox and bbox[1] > 0.75 and bbox[2] < 0.35:
                        role = "logo_candidate"
                    exported.append(
                        {
                            "id": asset_id,
                            "kind": "image",
                            "role": role,
                            "url": f"/static/assets/templates/{style_id}/{rel}",
                            "slide_index": si,
                            "bbox_pct": bbox,
                        }
                    )
        except Exception as e:
            warnings.append(f"slide_scan_failed[{si}]: {str(e)[:120]}")

    palette = _top_colors_clustered(colors, 5)
    primary = palette[0] if palette else None

    def _most_common(xs: List[str]) -> Optional[str]:
        if not xs:
            return None
        f: Dict[str, int] = {}
        for x in xs:
            f[x] = f.get(x, 0) + 1
        return sorted(f.items(), key=lambda kv: kv[1], reverse=True)[0][0]

    title_font = _most_common(title_fonts) or _most_common(body_fonts)
    body_font = _most_common(body_fonts) or title_font
    fonts = {
        "title": title_font,
        "body": body_font,
        "fallback_stack": [
            body_font or title_font,
            "Microsoft YaHei",
            "Segoe UI",
            "system-ui",
            "sans-serif",
        ],
    }

    if len(palette) < 3:
        warnings.append("palette_low_confidence")
    if not title_font or not body_font:
        warnings.append("font_pair_low_confidence")

    master_sel = {
        "dominant_layout": dominant_layout,
        "layout_freq": layout_freq,
    }

    return VisualDNAV2(
        style_id=style_id,
        slide_count=slide_count,
        palette_top5=palette,
        primary_color=primary,
        fonts=fonts,
        master_selection=master_sel,
        exported_assets=exported,
        warnings=warnings,
    )

