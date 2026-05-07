"""
布局自动切分器 - 当 PPT 缺少双栏布局时，自动基于单栏布局切分

核心功能：
1. 从单栏 CONTENT_AREA 布局自动切分双栏布局
2. 支持多种切分比例（默认 48%-4%-48%）
3. 支持自定义间距
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

DEFAULT_COLUMN_GAP_RATIO = 0.04
DEFAULT_COLUMN_WIDTH_RATIO = 0.48


def auto_split_two_column_layout(
    single_column_bbox: Dict[str, float],
    gap_ratio: float = DEFAULT_COLUMN_GAP_RATIO,
    column_width_ratio: float = DEFAULT_COLUMN_WIDTH_RATIO,
) -> Dict[str, Dict[str, float]]:
    """
    从单栏布局自动切分双栏布局
    
    Args:
        single_column_bbox: 单栏 CONTENT_AREA 坐标
            {"x": 0.1, "y": 0.2, "w": 0.8, "h": 0.7}
        gap_ratio: 两栏之间的间距比例（默认 0.04 = 4%）
        column_width_ratio: 每栏的宽度比例（默认 0.48 = 48%）
    
    Returns:
        双栏布局坐标:
        {
            "left": {"x": 0.1, "y": 0.2, "w": 0.38, "h": 0.7},
            "right": {"x": 0.52, "y": 0.2, "w": 0.38, "h": 0.7}
        }
    """
    x = single_column_bbox.get("x", 0.1)
    y = single_column_bbox.get("y", 0.2)
    w = single_column_bbox.get("w", 0.8)
    h = single_column_bbox.get("h", 0.7)
    
    left_x = x
    left_w = w * column_width_ratio
    right_x = x + w * column_width_ratio + w * gap_ratio
    right_w = w * column_width_ratio
    
    left_w = min(left_w, 1.0 - left_x)
    right_x = min(right_x, 1.0 - right_w)
    right_w = min(right_w, 1.0 - right_x)
    
    return {
        "left": {
            "x": round(left_x, 4),
            "y": round(y, 4),
            "w": round(left_w, 4),
            "h": round(h, 4),
        },
        "right": {
            "x": round(right_x, 4),
            "y": round(y, 4),
            "w": round(right_w, 4),
            "h": round(h, 4),
        },
    }


def auto_split_three_column_layout(
    single_column_bbox: Dict[str, float],
    gap_ratio: float = 0.03,
) -> Dict[str, Dict[str, float]]:
    """
    从单栏布局自动切分三栏布局
    
    Args:
        single_column_bbox: 单栏 CONTENT_AREA 坐标
        gap_ratio: 栏之间的间距比例（默认 0.03 = 3%）
    
    Returns:
        三栏布局坐标:
        {
            "left": {...},
            "center": {...},
            "right": {...}
        }
    """
    x = single_column_bbox.get("x", 0.1)
    y = single_column_bbox.get("y", 0.2)
    w = single_column_bbox.get("w", 0.8)
    h = single_column_bbox.get("h", 0.7)
    
    total_gap = gap_ratio * 2
    column_width = (w - total_gap) / 3
    
    left_x = x
    center_x = x + column_width + gap_ratio
    right_x = x + 2 * column_width + 2 * gap_ratio
    
    return {
        "left": {
            "x": round(left_x, 4),
            "y": round(y, 4),
            "w": round(column_width, 4),
            "h": round(h, 4),
        },
        "center": {
            "x": round(center_x, 4),
            "y": round(y, 4),
            "w": round(column_width, 4),
            "h": round(h, 4),
        },
        "right": {
            "x": round(right_x, 4),
            "y": round(y, 4),
            "w": round(column_width, 4),
            "h": round(h, 4),
        },
    }


def find_content_area_placeholder(layout: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    在布局中查找 CONTENT_AREA 占位符
    
    Args:
        layout: 布局信息字典，包含 placeholders 列表
    
    Returns:
        CONTENT_AREA 占位符信息，或 None
    """
    placeholders = layout.get("placeholders", [])
    for ph in placeholders:
        if ph.get("type") == "CONTENT_AREA":
            return ph
    return None


def has_two_column_layout(layouts: List[Dict[str, Any]]) -> bool:
    """
    检查布局列表中是否已有双栏布局
    
    Args:
        layouts: 布局列表
    
    Returns:
        是否存在双栏布局
    """
    for layout in layouts:
        content_areas = [
            ph for ph in layout.get("placeholders", [])
            if ph.get("type") == "CONTENT_AREA"
        ]
        if len(content_areas) >= 2:
            return True
    return False


def enrich_layouts_with_auto_split(
    layouts: List[Dict[str, Any]],
    enable_three_column: bool = False,
) -> List[Dict[str, Any]]:
    """
    为布局列表自动添加双栏/三栏布局
    
    Args:
        layouts: 原始布局列表
        enable_three_column: 是否同时生成三栏布局
    
    Returns:
        增强后的布局列表
    """
    enriched_layouts = []
    
    for layout in layouts:
        enriched_layout = dict(layout)
        
        content_area = find_content_area_placeholder(layout)
        if content_area is None:
            enriched_layouts.append(enriched_layout)
            continue
        
        bbox_ratio = content_area.get("bbox_ratio", [])
        if len(bbox_ratio) != 4:
            enriched_layouts.append(enriched_layout)
            continue
        
        single_column_bbox = {
            "x": bbox_ratio[0],
            "y": bbox_ratio[1],
            "w": bbox_ratio[2],
            "h": bbox_ratio[3],
        }
        
        auto_generated: Dict[str, Any] = {}
        
        two_column = auto_split_two_column_layout(single_column_bbox)
        auto_generated["two_column"] = {
            "left": {
                "type": "CONTENT_AREA_LEFT",
                "bbox_ratio": [
                    two_column["left"]["x"],
                    two_column["left"]["y"],
                    two_column["left"]["w"],
                    two_column["left"]["h"],
                ],
            },
            "right": {
                "type": "CONTENT_AREA_RIGHT",
                "bbox_ratio": [
                    two_column["right"]["x"],
                    two_column["right"]["y"],
                    two_column["right"]["w"],
                    two_column["right"]["h"],
                ],
            },
        }
        
        if enable_three_column:
            three_column = auto_split_three_column_layout(single_column_bbox)
            auto_generated["three_column"] = {
                "left": {
                    "type": "CONTENT_AREA_LEFT",
                    "bbox_ratio": [
                        three_column["left"]["x"],
                        three_column["left"]["y"],
                        three_column["left"]["w"],
                        three_column["left"]["h"],
                    ],
                },
                "center": {
                    "type": "CONTENT_AREA_CENTER",
                    "bbox_ratio": [
                        three_column["center"]["x"],
                        three_column["center"]["y"],
                        three_column["center"]["w"],
                        three_column["center"]["h"],
                    ],
                },
                "right": {
                    "type": "CONTENT_AREA_RIGHT",
                    "bbox_ratio": [
                        three_column["right"]["x"],
                        three_column["right"]["y"],
                        three_column["right"]["w"],
                        three_column["right"]["h"],
                    ],
                },
            }
        
        if auto_generated:
            enriched_layout["auto_generated"] = auto_generated
        
        enriched_layouts.append(enriched_layout)
    
    return enriched_layouts


def bbox_ratio_to_dict(bbox_ratio: List[float]) -> Dict[str, float]:
    """
    将 bbox_ratio 列表转换为字典格式
    
    Args:
        bbox_ratio: [x, y, w, h] 列表
    
    Returns:
        {"x": ..., "y": ..., "w": ..., "h": ...} 字典
    """
    if len(bbox_ratio) != 4:
        return {"x": 0, "y": 0, "w": 0, "h": 0}
    return {
        "x": bbox_ratio[0],
        "y": bbox_ratio[1],
        "w": bbox_ratio[2],
        "h": bbox_ratio[3],
    }


def generate_layout_variants(
    template_config: Dict[str, Any],
) -> Dict[str, Any]:
    """
    为模板配置生成布局变体
    
    Args:
        template_config: PPTXStyleExtractor 输出的模板配置
    
    Returns:
        包含布局变体的增强模板配置
    """
    config = dict(template_config)
    layouts = config.get("layouts", [])
    
    enriched_layouts = enrich_layouts_with_auto_split(layouts)
    config["layouts"] = enriched_layouts
    
    placeholder_markers = set(config.get("template_contract", {}).get("placeholder_markers", []))
    placeholder_markers.update(["CONTENT_AREA_LEFT", "CONTENT_AREA_RIGHT", "CONTENT_AREA_CENTER"])
    config["template_contract"]["placeholder_markers"] = sorted(list(placeholder_markers))
    
    return config
