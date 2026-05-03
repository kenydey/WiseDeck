"""
官方图表预设与别名映射 — 对齐 Presenton/PPT-master「字段契约」思路。

python-pptx 创建器当前支持的原生类型见 pptx_presentation_creator.add_chart；
未支持的类型（如 funnel）在导出链路中降级为近邻类型。
"""

from __future__ import annotations

from typing import Any, Dict, List

# 与 PptxPresentationCreator.add_chart 一致的小写 canonical id
OFFICIAL_CHART_TYPES: List[str] = [
    "bar",
    "horizontalbar",
    "line",
    "pie",
    "donut",
    "area",
]

# 中文 / 英文别名 → canonical
CHART_TYPE_ALIASES: Dict[str, str] = {
    "柱状图": "bar",
    "柱图": "bar",
    "条形图": "horizontalbar",
    "横向条形图": "horizontalbar",
    "折线图": "line",
    "线图": "line",
    "饼图": "pie",
    "环形图": "donut",
    "圆环图": "donut",
    "doughnut": "donut",
    "面积图": "area",
    # 漏斗图暂无原生枚举：降级为柱状以便仍可编辑
    "漏斗图": "bar",
    "漏斗": "bar",
    "funnel": "bar",
}


def official_chart_sample_payload(chart_type: str) -> Dict[str, Any]:
    """outline chart_config 形状示例（datasets 兼容 Chart.js 风格）。"""
    ct = CHART_TYPE_ALIASES.get(chart_type.lower(), chart_type.lower()) if chart_type else "bar"
    if ct not in OFFICIAL_CHART_TYPES:
        ct = "bar"
    labels = ["Q1", "Q2", "Q3"]
    return {
        "type": ct,
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "label": "系列 A",
                    "data": [12, 19, 8],
                    "backgroundColor": ["#3498db", "#9b59b6", "#2ecc71"],
                }
            ],
        },
    }


# 图标占位：命名约定（SVG sprite / FontAwesome class）— 生成提示词可引用
ICON_SLOT_HINT_ZH = (
    "建议使用语义化占位：icon:name（如 icon:trend-up）、或 Font Awesome：fas fa-chart-line。"
)
