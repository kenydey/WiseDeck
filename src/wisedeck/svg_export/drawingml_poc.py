"""
SVG → DrawingML / python-pptx 概念验证（feature-flag）。

WISEDECK_SVG_DRAWINGML_POC=1 时，可从极简 SVG（单个 <rect>）推导占位说明；
完整矢量映射对齐 PPT Master 仍待迭代。
"""

from __future__ import annotations

import os
import re
import xml.etree.ElementTree as ET
from typing import Any, Dict, List


def drawingml_poc_enabled() -> bool:
    return os.getenv("WISEDECK_SVG_DRAWINGML_POC", "").strip().lower() in ("1", "true", "yes")


def analyze_simple_svg_rects(svg_xml: str, *, max_rects: int = 8) -> Dict[str, Any]:
    """解析 SVG 中 rect 元素（无命名空间或默认 svg 前缀），返回诊断结构。"""
    if not drawingml_poc_enabled():
        return {"enabled": False, "message": "Set WISEDECK_SVG_DRAWINGML_POC=1 to enable analysis"}

    text = (svg_xml or "").strip()
    if not text:
        return {"enabled": True, "rects": [], "warning": "empty_svg"}

    # Strip common XML preamble issues for greedy parse
    try:
        root = ET.fromstring(text)
    except ET.ParseError:
        # Fallback: coarse regex for <rect .../>
        rects_raw = re.findall(r"<rect\b[^>]*/?\s*>", text, flags=re.I)
        return {
            "enabled": True,
            "rects": [{"raw_match": m[:120]} for m in rects_raw[:max_rects]],
            "warning": "xml_parse_failed_used_regex",
        }

    ns = {"svg": "http://www.w3.org/2000/svg"}

    def local(tag: str) -> str:
        if tag.startswith("{"):
            return tag.split("}", 1)[-1]
        return tag

    rects: List[Dict[str, Any]] = []

    def walk(elem: ET.Element) -> None:
        if len(rects) >= max_rects:
            return
        name = local(elem.tag)
        if name == "rect":
            rects.append(
                {
                    "x": elem.attrib.get("x"),
                    "y": elem.attrib.get("y"),
                    "width": elem.attrib.get("width"),
                    "height": elem.attrib.get("height"),
                    "fill": elem.attrib.get("fill"),
                    "rx": elem.attrib.get("rx"),
                }
            )
        for ch in list(elem):
            walk(ch)

    walk(root)

    _ = ns  # reserved if we expand to prefixed docs

    return {
        "enabled": True,
        "rect_count": len(rects),
        "rects": rects,
        "note_zh": (
            "POC：仅枚举 rect。映射到 DrawingML 自定义几何需扩展 svg_to_pptx 路径（参考 ppt-master）。"
        ),
    }
