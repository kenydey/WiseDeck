"""
PDF HTML 模板生成器 - 根据 SVG 模板生成完整的 HTML 模板

核心功能：
1. 生成包含 SVG 占位符的 HTML 模板
2. 生成单页预览 HTML
3. 支持 CSS 变量系统
4. 支持 Mustache 占位符
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

DEFAULT_FONT_STACK = "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"

DEFAULT_THEME_COLORS = {
    "primary": "#4472C4",
    "secondary": "#ED7D31",
    "text": "#333333",
    "background": "#FFFFFF",
    "border": "rgba(68, 114, 196, 0.3)",
}


class PDFHtmlTemplateGenerator:
    """PDF HTML 模板生成器"""

    def __init__(
        self,
        svg_template: Optional[str] = None,
        page_width: int = 1280,
        page_height: int = 720,
        theme_colors: Optional[Dict[str, str]] = None,
        slide_count: int = 1,
    ):
        self.svg_template = svg_template
        self.page_width = page_width
        self.page_height = page_height
        self.theme_colors = theme_colors or dict(DEFAULT_THEME_COLORS)
        self.slide_count = slide_count

    def _generate_css_variables(self) -> str:
        """生成 CSS 变量定义"""
        primary = self.theme_colors.get("primary", "#4472C4")
        secondary = self.theme_colors.get("secondary", "#ED7D31")
        text = self.theme_colors.get("text", "#333333")
        background = self.theme_colors.get("background", "#FFFFFF")
        border = self.theme_colors.get("border", "rgba(68, 114, 196, 0.3)")

        return f"""        :root {{
            --primary-color: {primary};
            --secondary-color: {secondary};
            --text-color: {text};
            --heading-color: {primary};
            --border-color: {border};
            --bg-color: {background};
        }}"""

    def _generate_base_css(self) -> str:
        """生成基础 CSS 样式"""
        bg_color = self.theme_colors.get("background", "#FFFFFF")

        css_lines = [
            "        * { box-sizing: border-box; margin: 0; padding: 0; }",
            "        html, body {",
            "            width: 100%;",
            "            height: 100%;",
            "            overflow: hidden;",
            "        }",
            "        body {",
            f"            width: {self.page_width}px;",
            f"            height: {self.page_height}px;",
            "            margin: 0 auto;",
            "            padding: 0;",
            f"            background: {bg_color};",
            f"            font-family: {DEFAULT_FONT_STACK};",
            "            position: relative;",
            "        }",
            "        .slide-container {",
            "            position: relative;",
            "            width: 100%;",
            "            height: 100%;",
            "        }",
            "        .slide-svg {",
            "            position: absolute;",
            "            top: 0;",
            "            left: 0;",
            "            width: 100%;",
            "            height: 100%;",
            "        }",
            "        .slide-svg svg {",
            "            width: 100%;",
            "            height: 100%;",
            "        }",
            "        .slide-content {",
            "            position: absolute;",
            "            left: 5%;",
            "            top: 15%;",
            "            width: 90%;",
            "            height: 70%;",
            "            overflow: hidden;",
            "        }",
            "        .content-main {",
            "            width: 100%;",
            "            height: 100%;",
            "            color: var(--text-color);",
            "            font-size: 18px;",
            "            line-height: 1.5;",
            "            overflow: hidden;",
            "        }",
            "        .slide-footer {",
            "            position: absolute;",
            "            bottom: 20px;",
            "            right: 30px;",
            "            font-size: 14px;",
            "            color: #666666;",
            "        }",
            "        .slide-header {",
            "            position: absolute;",
            "            left: 5%;",
            "            top: 5%;",
            "            width: 90%;",
            "            height: 8%;",
            "        }",
            "        .slide-title {",
            "            font-size: clamp(24px, 4vw, 36px);",
            "            font-weight: bold;",
            "            color: var(--primary-color);",
            "            overflow: hidden;",
            "            text-overflow: ellipsis;",
            "            white-space: nowrap;",
            "        }",
        ]

        return "\n".join(css_lines)

    def generate_template(self) -> str:
        """
        生成包含 SVG 占位符的 HTML 模板

        Returns:
            完整的 HTML 模板字符串
        """
        css_variables = self._generate_css_variables()
        base_css = self._generate_base_css()

        template = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{{{ page_title }}}}</title>
    <style>
{css_variables}
{base_css}
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="slide-svg">{{{{ svg_content }}}}</div>
        <div class="slide-header">
            <h1 class="slide-title">{{{{ main_heading }}}}</h1>
        </div>
        <div class="slide-content">
            <div class="content-main">{{{{ page_content }}}}</div>
        </div>
        <div class="slide-footer">
            <span>{{{{ current_page_number }}}} / {{{{ total_page_count }}}}</span>
        </div>
    </div>
</body>
</html>"""

        return template

    def generate_single_slide_html(self, svg_content: Optional[str] = None, preview_data: Optional[Dict] = None) -> str:
        """
        生成单页预览 HTML（用于前端预览）

        Args:
            svg_content: SVG 内容（可选，使用 self.svg_template 如果未提供）
            preview_data: 预览数据（可选）

        Returns:
            单页预览 HTML 字符串
        """
        svg = svg_content or self.svg_template or ""

        if preview_data is None:
            preview_data = {}

        page_title = preview_data.get("page_title", "PDF 预览")
        main_heading = preview_data.get("main_heading", "PDF 文档")
        page_content = preview_data.get("page_content", "")
        current_page = preview_data.get("current_page_number", 1)
        total_pages = preview_data.get("total_page_count", self.slide_count)

        bg_color = self.theme_colors.get("background", "#FFFFFF")
        primary_color = self.theme_colors.get("primary", "#4472C4")
        text_color = self.theme_colors.get("text", "#333333")

        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_title}</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        html, body {{
            width: 100%;
            height: 100%;
            overflow: hidden;
        }}
        body {{
            width: {self.page_width}px;
            height: {self.page_height}px;
            margin: 0 auto;
            padding: 0;
            background: {bg_color};
            font-family: {DEFAULT_FONT_STACK};
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        .slide-container {{
            position: relative;
            width: 100%;
            height: 100%;
        }}
        .slide-svg {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }}
        .slide-svg svg {{
            width: 100%;
            height: 100%;
        }}
        .slide-content {{
            position: absolute;
            left: 5%;
            top: 15%;
            width: 90%;
            height: 70%;
            overflow: hidden;
            background: transparent;
        }}
        .content-main {{
            width: 100%;
            height: 100%;
            color: {text_color};
            font-size: 18px;
            line-height: 1.5;
        }}
        .slide-footer {{
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 14px;
            color: #666666;
        }}
        .slide-header {{
            position: absolute;
            left: 5%;
            top: 5%;
            width: 90%;
            height: 8%;
        }}
        .slide-title {{
            font-size: clamp(24px, 4vw, 36px);
            font-weight: bold;
            color: {primary_color};
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }}
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="slide-svg">{svg}</div>
        <div class="slide-header">
            <h1 class="slide-title">{main_heading}</h1>
        </div>
        <div class="slide-content">
            <div class="content-main">{page_content}</div>
        </div>
        <div class="slide-footer">
            <span>{current_page} / {total_pages}</span>
        </div>
    </div>
</body>
</html>"""

        return html

    def generate_multi_page_html(self) -> str:
        """
        生成多页堆叠的 HTML 模板

        Returns:
            多页 HTML 模板字符串
        """
        template = self.generate_template()

        multi_page_addition = """
    <style>
        .slide-stack {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .slide-page {
            position: relative;
            border: 1px solid #ddd;
            page-break-after: always;
        }
    </style>"""

        template = template.replace("</style>", f"{multi_page_addition}\n    </style>")

        return template


def generate_pdf_html_template(
    svg_template: Optional[str] = None,
    page_width: int = 1280,
    page_height: int = 720,
    theme_colors: Optional[Dict[str, str]] = None,
    slide_count: int = 1,
) -> str:
    """
    便捷函数：生成 PDF HTML 模板

    Args:
        svg_template: SVG 模板
        page_width: 页面宽度
        page_height: 页面高度
        theme_colors: 主题色
        slide_count: 页数

    Returns:
        完整的 HTML 模板字符串
    """
    generator = PDFHtmlTemplateGenerator(
        svg_template=svg_template,
        page_width=page_width,
        page_height=page_height,
        theme_colors=theme_colors,
        slide_count=slide_count,
    )
    return generator.generate_template()
