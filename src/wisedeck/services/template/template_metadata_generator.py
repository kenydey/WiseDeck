"""
模板元数据生成器 - 根据 PPTX 样式信息和文件名自动生成模板元数据

核心功能：
1. 从文件名生成模板名称
2. 根据样式特征生成模板描述
3. 根据样式特征生成标签
4. 输出完整的模板元数据 JSON
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional


COLOR_NAME_MAP = {
    (0, 0, 0): "黑色",
    (255, 255, 255): "白色",
    (255, 0, 0): "红色",
    (0, 255, 0): "绿色",
    (0, 0, 255): "蓝色",
    (255, 255, 0): "黄色",
    (255, 0, 255): "紫色",
    (0, 255, 255): "青色",
    (128, 0, 0): "深红色",
    (0, 128, 0): "深绿色",
    (0, 0, 128): "深蓝色",
    (128, 128, 0): "橄榄色",
    (128, 0, 128): "紫色",
    (0, 128, 128): "青色",
    (192, 192, 192): "银灰色",
    (128, 128, 128): "灰色",
    (255, 128, 0): "橙色",
    (255, 165, 0): "橙黄色",
    (255, 127, 80): "珊瑚色",
    (165, 42, 42): "褐色",
    (0, 100, 0): "深绿色",
    (25, 25, 112): "深蓝色",
    (105, 105, 105): "暗灰色",
}

COLOR_HUE_RANGES = [
    (350, 360, 10, "红色系"),
    (0, 15, 10, "红色系"),
    (15, 45, 30, "橙色系"),
    (45, 70, 60, "黄色系"),
    (70, 150, 120, "绿色系"),
    (150, 195, 180, "青色系"),
    (195, 255, 240, "蓝色系"),
    (255, 290, 270, "紫色系"),
    (290, 350, 320, "粉色系"),
]

BG_DARK_THRESHOLD = 128


def _hex_to_rgb(hex_color: str) -> tuple:
    """将十六进制颜色转换为 RGB 元组"""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 6:
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    return (0, 0, 0)


def _get_color_name_by_hue(r: int, g: int, b: int) -> str:
    """根据色调获取颜色名称"""
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    if max_c - min_c < 30:
        if max_c < BG_DARK_THRESHOLD:
            return "深色"
        elif max_c > 200:
            return "浅色"
        return "灰色"

    if max_c == 0:
        return "黑色"

    if r >= g and r >= b:
        if g >= b:
            delta = (r - min_c) if (r - min_c) > 0 else 1
            s = (max_c - min_c) / max_c
            if s < 0.3:
                if max_c < BG_DARK_THRESHOLD:
                    return "深色"
                return "浅色"
        hue = 60 * ((g - b) / (r - min_c)) if (r - min_c) > 0 else 0
    elif g >= r and g >= b:
        hue = 60 * (2 - (r - b) / (g - min_c)) if (g - min_c) > 0 else 120
    else:
        hue = 60 * (4 - (g - r) / (b - min_c)) if (b - min_c) > 0 else 240

    hue = (hue % 360 + 360) % 360

    for start, end, mid, name in COLOR_HUE_RANGES:
        if start <= hue <= end or (start <= hue + 360 <= end):
            return name

    return "彩色"


def _is_color_similar(c1: tuple, c2: tuple, threshold: int = 50) -> bool:
    """判断两个颜色是否相似"""
    return abs(c1[0] - c2[0]) <= threshold and abs(c1[1] - c2[1]) <= threshold and abs(c1[2] - c2[2]) <= threshold


def _get_color_family_name(hex_color: str) -> str:
    """根据十六进制颜色获取颜色家族名称"""
    rgb = _hex_to_rgb(hex_color)

    for ref_color, name in COLOR_NAME_MAP.items():
        if _is_color_similar(rgb, ref_color, 40):
            return name

    return _get_color_name_by_hue(*rgb)


def _convert_camel_case(text: str) -> str:
    """将驼峰命名转换为空格分隔"""
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1 \2', text)
    return re.sub('([a-z0-9])([A-Z])', r'\1 \2', s1)


class TemplateMetadataGenerator:
    """模板元数据生成器"""

    def __init__(
        self,
        theme_colors: Optional[Dict[str, str]] = None,
        fonts: Optional[Dict[str, Dict[str, Any]]] = None,
        background: Optional[Dict[str, Any]] = None,
        layout_type: str = "single_column",
        source_filename: str = ""
    ):
        self.theme_colors = theme_colors or {}
        self.fonts = fonts or {}
        self.background = background or {}
        self.layout_type = layout_type
        self.source_filename = source_filename

    def generate_template_name(self) -> str:
        """
        从文件名生成模板名称

        生成规则：
        1. 移除 .pptx / .ppt 扩展名
        2. 将下划线 _ 替换为空格
        3. 将驼峰命名转换为空格分隔
        4. 移除版本号（如 _v2, _2024）
        5. 首字母大写
        """
        filename = self.source_filename

        if not filename:
            return "导入模板"

        name = filename.strip()

        name = re.sub(r'\.pptx?$', '', name, flags=re.IGNORECASE)

        name = name.replace('_', ' ')

        name = _convert_camel_case(name)

        name = re.sub(r'[-_]?v\d+$', '', name, flags=re.IGNORECASE)
        name = re.sub(r'[-_]?\d{4}$', '', name)
        name = re.sub(r'[-_]?\d{4}[-_]\d{1,2}$', '', name)

        name = re.sub(r'\s+', ' ', name).strip()

        if len(name) == 0:
            return "导入模板"

        name = name[0].upper() + name[1:] if len(name) > 1 else name.upper()

        return name

    def _get_background_style(self) -> str:
        """获取背景风格描述"""
        bg_type = self.background.get("type", "solid")

        if bg_type == "gradient":
            return "渐变"
        elif bg_type == "image":
            return "图片"
        else:
            bg_value = self.background.get("value", "#FFFFFF")
            rgb = _hex_to_rgb(bg_value)
            if max(rgb) < BG_DARK_THRESHOLD:
                return "深色"
            elif sum(rgb) / 3 > 200:
                return "浅色"
            return "中性"

    def _get_primary_color_name(self) -> str:
        """获取主色调名称"""
        primary = self.theme_colors.get("primary", "#4472C4")
        return _get_color_family_name(primary)

    def _is_font_business(self) -> bool:
        """判断是否为商务字体风格"""
        title_font = self.fonts.get("title", {})
        body_font = self.fonts.get("body", {})

        title_family = title_font.get("family", "").lower()
        body_family = body_font.get("family", "").lower()

        business_keywords = ["yahei", "雅黑", "hei", "黑体", "song", "宋体", "simsun", "simhei", "fangsong", "仿宋"]

        for font_family in [title_family, body_family]:
            for keyword in business_keywords:
                if keyword in font_family:
                    return True

        return False

    def _get_title_size_level(self) -> str:
        """获取标题字号级别"""
        title_font = self.fonts.get("title", {})
        title_size = title_font.get("size", 44)

        if title_size >= 48:
            return "大标题"
        elif title_size >= 36:
            return "中等标题"
        else:
            return "标准标题"

    def generate_description(self) -> str:
        """
        根据样式特征生成模板描述

        描述组成：
        1. 背景风格：深色/浅色/渐变 + 视觉风格描述
        2. 主色调：颜色名称 + 主题描述
        3. 适用场景：基于布局和字体推断
        """
        bg_style = self._get_background_style()
        color_name = self._get_primary_color_name()
        title_level = self._get_title_size_level()
        is_business = self._is_font_business()

        parts = []

        if bg_style == "渐变":
            parts.append("渐变视觉效果，现代感十足")
        elif bg_style == "深色":
            parts.append("深色背景，沉稳大气")
        elif bg_style == "浅色":
            parts.append("清新明亮风格")
        else:
            parts.append("中性色调")

        if color_name in ["蓝色", "深蓝色", "青色", "紫色"]:
            parts.append("适合商务演示")
        elif color_name in ["橙色", "橙黄色", "黄色", "红色"]:
            parts.append("适合创意展示")
        elif color_name in ["绿色", "深绿色"]:
            parts.append("适合教育培训")
        else:
            parts.append("视觉层次分明")

        if is_business:
            parts.append("采用专业字体排版")

        if title_level == "大标题":
            parts.append("突出标题的设计风格")

        if self.layout_type == "two_column":
            parts.append("双栏布局适合对比展示")
        elif self.layout_type == "three_column":
            parts.append("多栏布局信息容量大")

        if not parts:
            return "简洁实用的演示模板"

        return "，".join(parts)

    def generate_tags(self) -> List[str]:
        """
        根据样式特征生成标签

        标签生成规则：
        1. 从背景色推断：深色/浅色
        2. 从背景类型推断：渐变（若有）
        3. 从主色调推断：蓝色/橙色等
        4. 从布局类型推断：单栏/双栏/三栏
        5. 标签数量限制：最多 5 个
        """
        tags = set()

        bg_style = self._get_background_style()
        if bg_style == "深色":
            tags.add("深色")
        elif bg_style == "浅色":
            tags.add("浅色")
        elif bg_style == "渐变":
            tags.add("渐变")

        color_name = self._get_primary_color_name()
        color_tag_map = {
            "蓝色": "蓝色", "深蓝色": "蓝色", "青色": "蓝色",
            "橙色": "橙色", "橙黄色": "橙色",
            "绿色": "绿色", "深绿色": "绿色",
            "红色": "红色", "深红色": "红色",
            "紫色": "紫色", "粉色": "粉色",
            "黄色": "黄色",
        }
        if color_name in color_tag_map:
            tags.add(color_tag_map[color_name])

        layout_tag_map = {
            "single_column": "单栏",
            "two_column": "双栏",
            "three_column": "三栏",
        }
        if self.layout_type in layout_tag_map:
            tags.add(layout_tag_map[self.layout_type])

        title_font = self.fonts.get("title", {})
        body_font = self.fonts.get("body", {})

        for font_dict in [title_font, body_font]:
            font_family = font_dict.get("family", "").lower()
            if any(k in font_family for k in ["yahei", "雅黑", "hei", "黑体"]):
                tags.add("商务")
                break

        for font_dict in [title_font, body_font]:
            font_weight = font_dict.get("weight", "normal")
            if font_weight == "bold":
                tags.add("现代")
                break

        tags_list = list(tags)[:5]

        if len(tags_list) < 3:
            tags_list.append("通用")

        return tags_list

    def generate_metadata(self) -> Dict[str, Any]:
        """
        生成完整的元数据

        Returns:
            包含 template_name, description, tags, is_default 的字典
        """
        return {
            "template_name": self.generate_template_name(),
            "description": self.generate_description(),
            "tags": self.generate_tags(),
            "is_default": False,
        }


def generate_template_metadata(
    theme_colors: Optional[Dict[str, str]] = None,
    fonts: Optional[Dict[str, Dict[str, Any]]] = None,
    background: Optional[Dict[str, Any]] = None,
    layout_type: str = "single_column",
    source_filename: str = ""
) -> Dict[str, Any]:
    """
    便捷函数：生成模板元数据

    Args:
        theme_colors: 主题色字典
        fonts: 字体字典
        background: 背景样式字典
        layout_type: 布局类型
        source_filename: 源文件名

    Returns:
        完整的模板元数据字典
    """
    generator = TemplateMetadataGenerator(
        theme_colors=theme_colors,
        fonts=fonts,
        background=background,
        layout_type=layout_type,
        source_filename=source_filename
    )
    return generator.generate_metadata()
