"""
模板 JSON 构建器 - 根据 PPTXStyleExtractor 输出构建完整的 WiseDeck 模板 JSON

核心功能：
1. 集成 TemplateMetadataGenerator 生成元数据
2. 集成 HtmlTemplateGenerator 生成 HTML 模板
3. 输出符合 WiseDeck 模板规范的完整 JSON
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, Optional, Union

from .html_template_generator import HtmlTemplateGenerator, generate_html_template_from_config
from .pptx_style_extractor import PPTXStyleExtractor, extract_pptx_template_config
from .template_metadata_generator import TemplateMetadataGenerator, generate_template_metadata

logger = logging.getLogger(__name__)


class TemplateJsonBuilder:
    """模板 JSON 构建器"""

    def __init__(
        self,
        template_config: Dict[str, Any],
        source_filename: str = ""
    ):
        """
        初始化构建器

        Args:
            template_config: PPTXStyleExtractor 输出的配置 (schema_version: 2)
            source_filename: 源文件名（用于生成模板名称）
        """
        self.config = template_config
        self.source_filename = source_filename

    def build_template_json(self) -> Dict[str, Any]:
        """
        构建完整的模板 JSON

        Returns:
            符合 WiseDeck 模板规范的 JSON，包含：
            - template_name: 模板名称
            - description: 模板描述
            - html_template: HTML 模板字符串
            - tags: 模板标签
            - is_default: 是否默认模板
        """
        template_contract = self.config.get("template_contract", {})
        layout_type = template_contract.get("layout_type", "single_column")

        metadata_gen = TemplateMetadataGenerator(
            theme_colors=self.config.get("theme_colors"),
            fonts=self.config.get("fonts"),
            background=self.config.get("background"),
            layout_type=layout_type,
            source_filename=self.source_filename
        )
        metadata = metadata_gen.generate_metadata()

        html_gen = HtmlTemplateGenerator(
            theme_colors=self.config.get("theme_colors"),
            fonts=self.config.get("fonts"),
            layouts=self.config.get("layouts"),
            slide_dimensions=self.config.get("slide_dimensions"),
            background=self.config.get("background"),
            margins=self.config.get("margins"),
            spacing=self.config.get("spacing"),
            responsive_config=self.config.get("responsive_config"),
            layout_type=layout_type,
        )
        html_template = html_gen.generate_template()

        return {
            "template_name": metadata["template_name"],
            "description": metadata["description"],
            "html_template": html_template,
            "tags": metadata["tags"],
            "is_default": metadata["is_default"],
        }


def build_template_json_from_config(
    template_config: Dict[str, Any],
    source_filename: str = ""
) -> Dict[str, Any]:
    """
    便捷函数：根据配置字典构建模板 JSON

    Args:
        template_config: PPTXStyleExtractor 输出的配置
        source_filename: 源文件名

    Returns:
        完整的模板 JSON
    """
    builder = TemplateJsonBuilder(template_config, source_filename)
    return builder.build_template_json()


def build_template_json_from_pptx(
    pptx_source: Union[str, Path, bytes],
    source_filename: str = ""
) -> Dict[str, Any]:
    """
    便捷函数：从 PPTX 文件直接构建模板 JSON

    Args:
        pptx_source: PPTX 文件路径或字节数据
        source_filename: 源文件名（如果未提供则从 pptx_source 推断）

    Returns:
        完整的模板 JSON
    """
    if isinstance(pptx_source, (str, Path)):
        pptx_path = Path(pptx_source)
        if not source_filename:
            source_filename = pptx_path.name

    extractor = PPTXStyleExtractor(pptx_source)
    template_config = extractor.extract_complete_template_config()

    builder = TemplateJsonBuilder(template_config, source_filename)
    return builder.build_template_json()


def build_complete_import_result(
    pptx_source: Union[str, Path, bytes],
    source_filename: str = ""
) -> Dict[str, Any]:
    """
    构建完整的导入结果（包含模板 JSON 和预览 HTML）

    Args:
        pptx_source: PPTX 文件路径或字节数据
        source_filename: 源文件名

    Returns:
        包含 template 和 preview_html 的字典：
        {
            "template": {...},  # 完整模板 JSON
            "preview_html": "..."  # 预览 HTML
        }
    """
    if isinstance(pptx_source, (str, Path)):
        pptx_path = Path(pptx_source)
        if not source_filename:
            source_filename = pptx_path.name

    extractor = PPTXStyleExtractor(pptx_source)
    template_config = extractor.extract_complete_template_config()

    builder = TemplateJsonBuilder(template_config, source_filename)
    template_json = builder.build_template_json()

    preview_html = template_json.get("html_template", "")

    return {
        "template": template_json,
        "preview_html": preview_html,
    }
