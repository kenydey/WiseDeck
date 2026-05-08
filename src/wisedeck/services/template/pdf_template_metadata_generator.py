"""
PDF 模板元数据生成器 - 根据 PDF 文件信息自动生成模板元数据

核心功能：
1. 从 PDF 文件名生成模板名称
2. 根据 PDF 内容特征生成模板描述
3. 根据 PDF 类型/特征生成标签
4. 输出完整的模板元数据 JSON
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional


class PDFTemplateMetadataGenerator:
    """PDF 模板元数据生成器"""

    DEFAULT_COLORS = ["#FFFFFF", "#333333"]

    def __init__(
        self,
        source_filename: str = "",
        slide_count: int = 0,
        page_width: int = 1280,
        page_height: int = 720,
        dominant_colors: Optional[List[str]] = None,
    ):
        self.source_filename = source_filename
        self.slide_count = slide_count
        self.page_width = page_width
        self.page_height = page_height
        self.dominant_colors = dominant_colors or []

    def generate_template_name(self) -> str:
        """
        从 PDF 文件名生成模板名称

        生成规则：
        1. 移除 .pdf 扩展名
        2. 下划线 _ 替换为空格
        3. 移除版本号
        4. 首字母大写
        """
        filename = self.source_filename

        if not filename:
            return "PDF 导入模板"

        name = filename.strip()
        name = re.sub(r'\.pdf$', '', name, flags=re.IGNORECASE)
        name = name.replace('_', ' ')
        name = re.sub(r'[-_]?v\d+$', '', name, flags=re.IGNORECASE)
        name = re.sub(r'[-_]?\d{4}$', '', name)
        name = re.sub(r'\s+', ' ', name).strip()

        if not name:
            return "PDF 导入模板"

        name = name[0].upper() + name[1:] if len(name) > 1 else name.upper()

        return name

    def _get_page_info_text(self) -> str:
        """获取页数信息文本"""
        if self.slide_count <= 0:
            return "单页"
        elif self.slide_count == 1:
            return "单页"
        elif self.slide_count <= 5:
            return f"{self.slide_count} 页"
        else:
            return f"共 {self.slide_count} 页"

    def _get_page_size_text(self) -> str:
        """获取页面尺寸信息文本"""
        if self.page_width == 1280 and self.page_height == 720:
            return "高清 16:9"
        elif self.page_width == 1920 and self.page_height == 1080:
            return "全高清 1080p"
        elif self.page_width > self.page_height:
            return "宽屏"
        elif self.page_width < self.page_height:
            return "竖版"
        return ""

    def _infer_color_name(self, hex_color: str) -> Optional[str]:
        """从十六进制颜色推断颜色名称"""
        hex_color = hex_color.lstrip('#')
        if len(hex_color) != 6:
            return None

        try:
            r = int(hex_color[0:2], 16)
            g = int(hex_color[2:4], 16)
            b = int(hex_color[4:6], 16)
        except ValueError:
            return None

        max_c = max(r, g, b)
        min_c = min(r, g, b)

        if max_c - min_c < 30:
            if max_c < 50:
                return "深色"
            elif max_c > 200:
                return "浅色"
            return None

        if r >= g and r >= b:
            if g >= b:
                hue = 60 * ((g - b) / (r - min_c)) if (r - min_c) > 0 else 0
            else:
                hue = 60 * (6 - (b - g) / (r - min_c)) if (r - min_c) > 0 else 0
        elif g >= r and g >= b:
            hue = 60 * (2 - (r - b) / (g - min_c)) if (g - min_c) > 0 else 120
        else:
            hue = 60 * (4 - (g - r) / (b - min_c)) if (b - min_c) > 0 else 240

        hue = (hue % 360 + 360) % 360

        if 200 <= hue <= 260:
            return "蓝色系"
        elif 25 <= hue <= 45:
            return "橙色系"
        elif 60 <= hue <= 150:
            return "绿色系"
        elif 260 <= hue <= 330:
            return "紫色系"
        elif 350 <= hue <= 360 or 0 <= hue <= 25:
            return "红色系"

        return None

    def generate_description(self) -> str:
        """
        根据 PDF 内容生成模板描述

        描述组成：
        1. PDF 视觉模板标识
        2. 页数信息
        3. 页面尺寸
        4. 颜色风格（如可推断）
        """
        parts = []

        parts.append("PDF 视觉模板")

        page_info = self._get_page_info_text()
        if page_info:
            parts.append(page_info)

        page_size = self._get_page_size_text()
        if page_size:
            parts.append(page_size)

        for color in self.dominant_colors[:2]:
            color_name = self._infer_color_name(color)
            if color_name and color_name not in parts:
                parts.append(color_name)
                break

        if self.slide_count > 5:
            parts.append("适合内容展示")
        elif self.slide_count > 1:
            parts.append("适合演示展示")
        else:
            parts.append("适合单页展示")

        return "，".join(parts)

    def generate_tags(self) -> List[str]:
        """
        根据 PDF 特征生成标签

        标签生成规则：
        1. ["PDF"] 固定标签
        2. ["视觉模板"] 固定标签
        3. 多页添加 ["多页"]
        4. 颜色标签（如可推断）
        5. 标签数量限制：最多 5 个
        """
        tags = []

        tags.append("PDF")
        tags.append("视觉模板")

        if self.slide_count > 1:
            tags.append("多页")

        for color in self.dominant_colors[:1]:
            color_name = self._infer_color_name(color)
            if color_name and color_name not in tags:
                if color_name == "深色":
                    tags.append("深色")
                elif color_name == "浅色":
                    tags.append("浅色")
                elif color_name == "蓝色系":
                    tags.append("蓝色")
                elif color_name == "橙色系":
                    tags.append("橙色")
                break

        if len(tags) < 5 and self.slide_count == 1:
            tags.append("单页")

        return tags[:5]

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


def generate_pdf_template_metadata(
    source_filename: str = "",
    slide_count: int = 0,
    page_width: int = 1280,
    page_height: int = 720,
    dominant_colors: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    便捷函数：生成 PDF 模板元数据

    Args:
        source_filename: PDF 文件名
        slide_count: PDF 页数
        page_width: 页面宽度
        page_height: 页面高度
        dominant_colors: 主色调列表

    Returns:
        完整的模板元数据字典
    """
    generator = PDFTemplateMetadataGenerator(
        source_filename=source_filename,
        slide_count=slide_count,
        page_width=page_width,
        page_height=page_height,
        dominant_colors=dominant_colors,
    )
    return generator.generate_metadata()
