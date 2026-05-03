"""
Merge PyMuPDF-exported per-slide SVG files into one composite SVG (vertical_stack / first_slide_only).
"""

from __future__ import annotations

import os
import re
from html import escape
from pathlib import Path
from typing import List, Literal, Tuple

from bs4 import BeautifulSoup

BundleMode = Literal["vertical_stack", "first_slide_only"]

_SOFT_WARN_SLIDE_COUNT = int(os.getenv("WISEDECK_TEMPLATE_IMPORT_SLIDE_WARN", "40"))


def _parse_dim(val: object) -> float | None:
    if val is None:
        return None
    s = str(val).strip().lower().replace("px", "").replace("pt", "")
    try:
        return float(s)
    except ValueError:
        m = re.match(r"^([\d.]+)", s)
        if m:
            return float(m.group(1))
    return None


def _svg_dimensions(svg_tag) -> Tuple[float, float]:
    vb = svg_tag.get("viewBox") or svg_tag.get("viewbox")
    if vb:
        parts = vb.replace(",", " ").split()
        if len(parts) >= 4:
            try:
                w, h = float(parts[2]), float(parts[3])
                if w > 0 and h > 0:
                    return w, h
            except ValueError:
                pass
    w = _parse_dim(svg_tag.get("width"))
    h = _parse_dim(svg_tag.get("height"))
    if w and h and w > 0 and h > 0:
        return w, h
    return 1280.0, 720.0


def _sorted_slide_svg_paths(svg_dir: Path) -> List[Path]:
    if not svg_dir.is_dir():
        return []
    paths = sorted(svg_dir.glob("slide_*.svg"))
    return paths


def read_workspace_slide_svgs(svg_dir: Path, bundle_mode: BundleMode) -> List[str]:
    """
    Read slide_*.svg raw XML from svg_dir in slide order (same slice rules as bundle_workspace_svgs).
    """
    paths = _sorted_slide_svg_paths(svg_dir)
    if not paths:
        raise ValueError("工作区中没有 slide_*.svg 文件")
    if bundle_mode == "first_slide_only":
        paths = paths[:1]
    return [p.read_text(encoding="utf-8") for p in paths]


def bundle_slide_svgs(
    svg_paths: List[Path],
    bundle_mode: BundleMode = "vertical_stack",
) -> Tuple[str, str, List[str]]:
    """
    Returns (svg_template, html_template, slide_xmls) with scrollable HTML wrapper.
    slide_xmls are raw file contents per slide included in the bundle (same order as slide_N.svg).
    """
    if not svg_paths:
        raise ValueError("没有找到幻灯片 SVG 文件")

    if bundle_mode == "first_slide_only":
        svg_paths = svg_paths[:1]

    max_w = 0.0
    heights: List[float] = []
    parsed: List[Tuple[BeautifulSoup, object]] = []
    slide_xmls: List[str] = []

    for p in svg_paths:
        text = p.read_text(encoding="utf-8")
        slide_xmls.append(text)
        soup = BeautifulSoup(text, "xml")
        slide = soup.find("svg")
        if slide is None:
            raise ValueError(f"无效的 SVG 文件（缺少 <svg> 根）: {p.name}")
        w, h = _svg_dimensions(slide)
        max_w = max(max_w, w)
        heights.append(h)
        parsed.append((soup, slide))

    total_h = sum(heights)

    outer_soup = BeautifulSoup('<svg xmlns="http://www.w3.org/2000/svg"></svg>', "xml")
    root = outer_soup.find("svg")
    assert root is not None
    root["width"] = str(max_w)
    root["height"] = str(total_h)
    root["viewBox"] = f"0 0 {max_w} {total_h}"

    y_off = 0.0
    for (_soup, slide), h in zip(parsed, heights):
        fragment = BeautifulSoup(str(slide), "xml").find("svg")
        if fragment is None:
            continue
        fragment["x"] = "0"
        fragment["y"] = str(y_off)
        fragment["width"] = str(max_w)
        fragment["height"] = str(h)
        vb = fragment.get("viewBox") or fragment.get("viewbox")
        if vb:
            fragment["viewBox"] = vb
        fragment["preserveAspectRatio"] = "xMidYMin meet"
        root.append(fragment)
        y_off += h

    svg_template = str(root)
    return svg_template, wrap_svg_vertical_stack_html(svg_template, "Imported Template"), slide_xmls


def wrap_svg_vertical_stack_html(svg_inner: str, template_name: str) -> str:
    """Minimal HTML document; body scrolls for multi-slide vertical_stack."""
    safe_title = escape((template_name or "Template").replace("<", "").replace(">", ""))
    return f"""<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{safe_title}</title>
</head>
<body style="margin:0;padding:16px;overflow-y:auto;overflow-x:auto;background:#f0f0f0;">
<div style="display:inline-block;background:#ffffff;box-shadow:0 1px 3px rgba(0,0,0,0.12);">
{svg_inner}
</div>
</body>
</html>"""


def wrap_single_slide_html(svg_slide_xml: str, template_name: str = "Slide") -> str:
    """Minimal HTML wrapping one slide SVG (no vertical deck scroll)."""
    safe_title = escape((template_name or "Slide").replace("<", "").replace(">", ""))
    inner = svg_slide_xml if isinstance(svg_slide_xml, str) else ""
    return f"""<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{safe_title}</title>
</head>
<body style="margin:0;padding:16px;overflow:auto;background:#f0f0f0;">
<div style="display:inline-block;background:#ffffff;box-shadow:0 1px 3px rgba(0,0,0,0.12);">
{inner}
</div>
</body>
</html>"""


def bundle_workspace_svgs(svg_dir: Path, bundle_mode: BundleMode) -> Tuple[str, str, List[str], List[str]]:
    """
    Reads slide_*.svg from workspace svg_dir.
    Returns (svg_template, html_template, warnings, slide_xmls).
    """
    warnings: List[str] = []
    paths = _sorted_slide_svg_paths(svg_dir)
    if not paths:
        raise ValueError("工作区中没有 slide_*.svg 文件")

    if len(paths) >= _SOFT_WARN_SLIDE_COUNT:
        warnings.append(
            f"幻灯片数量较多（{len(paths)}），合并后模板体积较大，预览或保存可能变慢"
        )

    svg_t, html_t, slide_xmls = bundle_slide_svgs(paths, bundle_mode=bundle_mode)
    return svg_t, html_t, warnings, slide_xmls


__all__ = [
    "bundle_slide_svgs",
    "bundle_workspace_svgs",
    "read_workspace_slide_svgs",
    "wrap_svg_vertical_stack_html",
    "wrap_single_slide_html",
    "_sorted_slide_svg_paths",
]
