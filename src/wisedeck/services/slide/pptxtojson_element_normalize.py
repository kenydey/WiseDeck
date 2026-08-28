"""Normalize pptxtojson element dicts into PPTist-compatible shapes (server-side).

Mirrors critical paths from PPTist ``useImport.ts`` for chart/table so embedded
full editor does not crash on ``data.series[0]`` / ``themeColors[0]``.
"""

from __future__ import annotations

import logging
import re
import uuid
from html.parser import HTMLParser
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

DEFAULT_THEME_COLORS = ["#4472c4", "#ed7d31", "#a5a5a5", "#ffc000", "#5b9bd5", "#70ad47"]
WISEDECK_VENDOR_ECHARTS = "/static/vendor/echarts.min.js"
WISEDECK_VENDOR_CHART_UMD = "/static/vendor/chart.umd.min.js"

_ECHARTS_SCRIPT_RE = re.compile(
    r'<script\b[^>]*\bsrc\s*=\s*["\']https?://[^"\']*/echarts[^"\']*\.min\.js["\'][^>]*>\s*</script>',
    re.IGNORECASE,
)
_CHART_UMD_SCRIPT_RE = re.compile(
    r'<script\b[^>]*\bsrc\s*=\s*["\']https?://[^"\']*/chart\.umd(?:\.min)?\.js["\'][^>]*>\s*</script>',
    re.IGNORECASE,
)


def _new_id() -> str:
    return uuid.uuid4().hex[:10]


def rewrite_chart_cdn_in_html(html: str) -> str:
    if not isinstance(html, str) or not html.strip():
        return html
    out = _ECHARTS_SCRIPT_RE.sub(
        f'<script src="{WISEDECK_VENDOR_ECHARTS}"></script>', html
    )
    return _CHART_UMD_SCRIPT_RE.sub(
        f'<script src="{WISEDECK_VENDOR_CHART_UMD}"></script>', out
    )


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._parts: List[str] = []

    def handle_data(self, data: str) -> None:
        if data and data.strip():
            self._parts.append(data.strip())

    def text(self) -> str:
        return " ".join(self._parts)


def _html_to_plain_text(fragment: str) -> str:
    if not fragment:
        return ""
    try:
        parser = _TextExtractor()
        parser.feed(fragment)
        return parser.text()
    except Exception:
        return re.sub(r"<[^>]+>", "", fragment).strip()


def _is_pptist_chart(el: Dict[str, Any]) -> bool:
    if el.get("type") != "chart":
        return False
    data = el.get("data")
    if not isinstance(data, dict):
        return False
    series = data.get("series")
    return isinstance(series, list) and len(series) > 0 and isinstance(series[0], list)


def _pptist_chart_type(raw: str, el: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
    options: Dict[str, Any] = {}
    grouping = el.get("grouping")
    if grouping in ("stacked", "percentStacked"):
        options["stack"] = True

    raw_l = (raw or "").lower()
    if raw_l in ("barchart", "bar3dchart"):
        ct = "column" if el.get("barDir") == "bar" else "bar"
        return ct, options
    if raw_l in ("linechart", "line3dchart"):
        return "line", options
    if raw_l in ("areachart", "area3dchart"):
        return "area", options
    if raw_l in ("scatterchart", "bubblechart"):
        return "scatter", options
    if raw_l in ("piechart", "pie3dchart"):
        return "pie", options
    if raw_l == "radarchart":
        return "radar", options
    if raw_l == "doughnutchart":
        return "ring", options
    return "bar", options


MINIMAL_CHART_DATA: Dict[str, Any] = {
    "labels": [""],
    "legends": [""],
    "series": [[0.0]],
}


def _build_minimal_chart_element(
    el: Dict[str, Any],
    *,
    theme_colors: List[str],
    left: float,
    top: float,
    width: float,
    height: float,
) -> Dict[str, Any]:
    colors = el.get("themeColors")
    if not isinstance(colors, list) or not colors:
        colors = list(theme_colors) if theme_colors else list(DEFAULT_THEME_COLORS)
    raw_type = str(el.get("chartType") or el.get("type") or "barChart")
    chart_type, options = _pptist_chart_type(raw_type, el)
    return {
        "id": el.get("id") or _new_id(),
        "type": "chart",
        "left": left,
        "top": top,
        "width": width,
        "height": height,
        "chartType": chart_type,
        "themeColors": colors,
        "textColor": el.get("textColor") or "#333333",
        "lineColor": el.get("lineColor") or "#e5e5e5",
        "data": dict(MINIMAL_CHART_DATA),
        "options": options,
    }


def normalize_chart_element(
    el: Dict[str, Any],
    *,
    theme_colors: List[str],
    left: float,
    top: float,
    width: float,
    height: float,
) -> Optional[Dict[str, Any]]:
    if _is_pptist_chart(el):
        out = dict(el)
        out.update({"left": left, "top": top, "width": width, "height": height})
        if not out.get("themeColors"):
            out["themeColors"] = list(theme_colors) if theme_colors else list(DEFAULT_THEME_COLORS)
        data = out.get("data")
        if isinstance(data, dict):
            series = data.get("series")
            if not isinstance(series, list) or not series or not isinstance(series[0], list) or not series[0]:
                out["data"] = dict(MINIMAL_CHART_DATA)
        return out

    raw_type = str(el.get("chartType") or el.get("type") or "")
    raw_data = el.get("data")
    labels: List[str] = []
    legends: List[str] = []
    series: List[List[float]] = []

    try:
        if raw_type in ("scatterChart", "bubbleChart") and isinstance(raw_data, list) and len(raw_data) >= 2:
            first = raw_data[0]
            if isinstance(first, list):
                labels = [f"坐标{i + 1}" for i in range(len(first))]
                legends = ["X", "Y"]
                series = []
                for row in raw_data[:2]:
                    if isinstance(row, list):
                        series.append([float(x) if isinstance(x, (int, float)) else 0.0 for x in row])
        elif isinstance(raw_data, list) and raw_data:
            first_item = raw_data[0]
            if isinstance(first_item, dict) and "xlabels" in first_item:
                xlabels = first_item.get("xlabels") or {}
                if isinstance(xlabels, dict):
                    labels = [str(v) for v in xlabels.values()]
                for item in raw_data:
                    if not isinstance(item, dict):
                        continue
                    legends.append(str(item.get("key") or ""))
                    vals = item.get("values") or []
                    row: List[float] = []
                    if isinstance(vals, list):
                        for v in vals:
                            if isinstance(v, dict):
                                row.append(float(v.get("y") or 0))
                            elif isinstance(v, (int, float)):
                                row.append(float(v))
                            else:
                                row.append(0.0)
                    series.append(row)
    except Exception as exc:
        logger.debug("chart normalize parse failed: %s", exc)
        return _build_minimal_chart_element(
            el,
            theme_colors=theme_colors,
            left=left,
            top=top,
            width=width,
            height=height,
        )

    if not series or not series[0]:
        logger.debug("chart normalize fallback minimal chartType=%s", raw_type)
        return _build_minimal_chart_element(
            el,
            theme_colors=theme_colors,
            left=left,
            top=top,
            width=width,
            height=height,
        )

    colors = el.get("colors") or el.get("themeColors")
    if not isinstance(colors, list) or not colors:
        colors = list(theme_colors) if theme_colors else list(DEFAULT_THEME_COLORS)

    chart_type, options = _pptist_chart_type(raw_type, el)

    return {
        "id": el.get("id") or _new_id(),
        "type": "chart",
        "left": left,
        "top": top,
        "width": width,
        "height": height,
        "rotate": float(el.get("rotate") or 0),
        "chartType": chart_type,
        "themeColors": colors,
        "textColor": el.get("textColor") or "#333333",
        "lineColor": el.get("lineColor") or "#e5e5e5",
        "data": {"labels": labels, "legends": legends, "series": series},
        "options": options,
    }


def normalize_table_element(
    el: Dict[str, Any],
    *,
    left: float,
    top: float,
    width: float,
    height: float,
    ratio: float = 1.0,
) -> Optional[Dict[str, Any]]:
    raw = el.get("data")
    if not isinstance(raw, list) or not raw:
        return None
    if not isinstance(raw[0], list) or not raw[0]:
        return None

    rows = len(raw)
    cols = len(raw[0])
    table_data: List[List[Dict[str, Any]]] = []

    for i in range(rows):
        row_cells: List[Dict[str, Any]] = []
        src_row = raw[i] if i < len(raw) else []
        if not isinstance(src_row, list):
            continue
        for j in range(cols):
            cell = src_row[j] if j < len(src_row) else {}
            if not isinstance(cell, dict):
                cell = {}
            text_html = cell.get("text") or ""
            plain = _html_to_plain_text(str(text_html))
            row_cells.append(
                {
                    "id": _new_id(),
                    "colspan": int(cell.get("colSpan") or cell.get("colspan") or 1),
                    "rowspan": int(cell.get("rowSpan") or cell.get("rowspan") or 1),
                    "text": plain,
                    "style": {
                        "align": "left",
                        "valign": "middle",
                        "fontsize": "",
                        "fontname": "",
                        "color": cell.get("fontColor") or "#333",
                        "bold": bool(cell.get("fontBold")),
                        "backcolor": cell.get("fillColor") or "",
                    },
                }
            )
        if row_cells:
            table_data.append(row_cells)

    if not table_data:
        return None

    col_widths_raw = el.get("colWidths") or []
    col_widths: List[float] = []
    if isinstance(col_widths_raw, list) and col_widths_raw:
        total = sum(float(x) for x in col_widths_raw if isinstance(x, (int, float)))
        if total > 0:
            col_widths = [float(x) / total for x in col_widths_raw if isinstance(x, (int, float))]
        else:
            col_widths = [1.0 / cols] * cols
    else:
        col_widths = [1.0 / cols] * cols

    row_heights = el.get("rowHeights") or []
    cell_min_h = 36.0
    if isinstance(row_heights, list) and row_heights:
        try:
            cell_min_h = float(row_heights[0]) * ratio
        except (TypeError, ValueError):
            pass

    borders = el.get("borders") or {}
    first_cell = raw[0][0] if isinstance(raw[0][0], dict) else {}
    cell_b = first_cell.get("borders") or {}
    border = (
        (cell_b.get("top") if isinstance(cell_b, dict) else None)
        or (cell_b.get("bottom") if isinstance(cell_b, dict) else None)
        or borders.get("top")
        or borders.get("bottom")
        or {}
    )
    if not isinstance(border, dict):
        border = {}

    return {
        "id": el.get("id") or _new_id(),
        "type": "table",
        "left": left,
        "top": top,
        "width": width,
        "height": height,
        "rotate": float(el.get("rotate") or 0),
        "colWidths": col_widths,
        "data": table_data,
        "outline": {
            "width": float(border.get("borderWidth") or 0) * ratio or 2.0,
            "style": border.get("borderType") or "solid",
            "color": border.get("borderColor") or "#eeece1",
        },
        "cellMinHeight": cell_min_h,
    }


def normalize_pptxtojson_element(
    el: Dict[str, Any],
    *,
    theme_colors: List[str],
    left: float,
    top: float,
    width: float,
    height: float,
    ratio: float = 1.0,
) -> Optional[Dict[str, Any]]:
    """Return a PPTist-safe element dict, or None to drop the element."""
    et = el.get("type")
    if et == "chart":
        return normalize_chart_element(
            el,
            theme_colors=theme_colors,
            left=left,
            top=top,
            width=width,
            height=height,
        )
    if et == "table":
        return normalize_table_element(
            el, left=left, top=top, width=width, height=height, ratio=ratio
        )
    if et == "text":
        content = el.get("content") or "<p></p>"
        if isinstance(content, str):
            content = rewrite_chart_cdn_in_html(content)
        return {
            "id": el.get("id") or _new_id(),
            "type": "text",
            "left": left,
            "top": top,
            "width": width,
            "height": height,
            "rotate": float(el.get("rotate") or 0),
            "content": content,
            "defaultFontName": el.get("defaultFontName") or "",
            "defaultColor": el.get("defaultColor") or "#333",
            "lineHeight": el.get("lineHeight") or 1.2,
        }
    if et == "image":
        return {
            "id": el.get("id") or _new_id(),
            "type": "image",
            "left": left,
            "top": top,
            "width": width,
            "height": height,
            "rotate": float(el.get("rotate") or 0),
            "fixedRatio": bool(el.get("fixedRatio", True)),
            "src": el.get("src") or "",
            "outline": el.get("outline") or {"style": "solid", "width": 0, "color": "#000000"},
        }
    # shape / line / group / diagram / math: pass through with scaled geometry
    out = {
        **{k: v for k, v in el.items() if k not in ("left", "top", "width", "height")},
        "left": left,
        "top": top,
        "width": width,
        "height": height,
    }
    text_block = out.get("text")
    if isinstance(text_block, dict) and isinstance(text_block.get("content"), str):
        text_block = dict(text_block)
        text_block["content"] = rewrite_chart_cdn_in_html(text_block["content"])
        out["text"] = text_block
    return out
