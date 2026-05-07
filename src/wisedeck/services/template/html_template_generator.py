"""
HTML 模板生成器 - 根据提取的 PPTX 样式信息生成完整的 WiseDeck HTML 模板

核心功能：
1. 根据提取的样式信息生成 CSS
2. 根据占位符坐标生成布局结构
3. 生成完整的 HTML 模板（Mustache 语法）
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


PLACEHOLDER_TYPE_TO_MUSTACHE = {
    "PAGE_TITLE": "{{ main_heading }}",
    "SUBTITLE": "{{ subtitle }}",
    "CONTENT_AREA": "{{{ page_content }}}",
    "CONTENT_AREA_LEFT": "{{{ page_content_left }}}",
    "CONTENT_AREA_RIGHT": "{{{ page_content_right }}}",
    "CONTENT_AREA_CENTER": "{{{ page_content_center }}}",
    "CHART_AREA": "{{{ chart_content }}}",
    "TABLE_AREA": "{{{ table_content }}}",
}

DEFAULT_FONT_STACK = "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"


class HtmlTemplateGenerator:
    """HTML 模板生成器"""
    
    def __init__(
        self,
        theme_colors: Optional[Dict[str, str]] = None,
        fonts: Optional[Dict[str, str]] = None,
        layouts: Optional[List[Dict[str, Any]]] = None,
        slide_dimensions: Optional[Dict[str, Any]] = None,
        background: Optional[Dict[str, Any]] = None,
        font_styles: Optional[Dict[str, Any]] = None,
        responsive_config: Optional[Dict[str, Any]] = None,
    ):
        self.theme_colors = theme_colors or {}
        self.fonts = fonts or {"title": "Arial", "body": "Calibri"}
        self.layouts = layouts or []
        self.slide_dimensions = slide_dimensions or {"width_pt": 1280, "height_pt": 720}
        self.background = background or {"type": "solid", "value": "#FFFFFF"}
        self.font_styles = font_styles or {
            "title": {"font_size": 44, "font_weight": "bold"},
            "body": {"font_size": 18, "font_weight": "normal"},
        }
        self.responsive_config = responsive_config or {
            "min_font_size": 14,
            "preferred_font_size": "4vw",
            "max_font_size": 48,
        }
    
    def generate_template(self) -> str:
        """生成完整的 HTML 模板"""
        css = self._generate_css()
        html_structure = self._generate_html_structure()
        
        template = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{{{ page_title }}}}</title>
    <style>
{css}
    </style>
</head>
<body>
{html_structure}
</body>
</html>"""
        
        return template
    
    def _generate_css(self) -> str:
        """生成 CSS 样式"""
        bg_css = self._get_background_css()
        primary_color = self.theme_colors.get("primary", "#4472C4")
        body_color = self.theme_colors.get("text_color", "#333333")
        footer_color = self.theme_colors.get("secondary", "#666666")
        
        width_pt = self.slide_dimensions.get("width_pt", 1280)
        height_pt = self.slide_dimensions.get("height_pt", 720)
        
        title_font = self.fonts.get("title", "Arial")
        body_font = self.fonts.get("body", "Calibri")
        
        title_size = self.font_styles.get("title", {}).get("font_size", 44)
        title_weight = self.font_styles.get("title", {}).get("font_weight", "bold")
        body_size = self.font_styles.get("body", {}).get("font_size", 18)
        
        min_size = self.responsive_config.get("min_font_size", 14)
        preferred_size = self.responsive_config.get("preferred_font_size", "4vw")
        max_size = self.responsive_config.get("max_font_size", 48)
        
        css_lines = [
            "        * { box-sizing: border-box; margin: 0; padding: 0; }",
            "        html, body {",
            "            width: 100%;",
            "            height: 100%;",
            "            overflow: hidden;",
            "        }",
            "        body {",
            f"            width: {width_pt}px;",
            f"            height: {height_pt}px;",
            f"            font-family: {DEFAULT_FONT_STACK};",
            f"            {bg_css}",
            "            position: relative;",
            "        }",
            "        .slide-container {",
            "            position: relative;",
            "            width: 100%;",
            "            height: 100%;",
            "        }",
        ]
        
        placeholders_css = self._generate_placeholder_css()
        css_lines.extend(placeholders_css)
        
        css_lines.extend([
            "        .slide-footer {",
            f"            position: absolute;",
            "            bottom: 20px;",
            "            right: 30px;",
            "            font-size: 14px;",
            f"            color: {footer_color};",
            "        }",
        ])
        
        return "\n".join(css_lines)
    
    def _get_background_css(self) -> str:
        """获取背景 CSS"""
        bg_type = self.background.get("type", "solid")
        bg_value = self.background.get("value", "#FFFFFF")
        
        if bg_type == "gradient":
            return f"background: {bg_value};"
        elif bg_type == "image":
            return f"background-image: url('{bg_value}'); background-size: cover; background-position: center;"
        else:
            return f"background-color: {bg_value};"
    
    def _generate_placeholder_css(self) -> List[str]:
        """生成占位符 CSS"""
        css_lines = []
        primary_color = self.theme_colors.get("primary", "#4472C4")
        title_font = self.fonts.get("title", "Arial")
        body_font = self.fonts.get("body", "Calibri")
        title_size = self.font_styles.get("title", {}).get("font_size", 44)
        title_weight = self.font_styles.get("title", {}).get("font_weight", "bold")
        body_size = self.font_styles.get("body", {}).get("font_size", 18)
        
        min_size = self.responsive_config.get("min_font_size", 14)
        preferred_size = self.responsive_config.get("preferred_font_size", "4vw")
        max_size = self.responsive_config.get("max_font_size", 48)
        
        has_title = False
        has_content = False
        has_subtitle = False
        
        for layout in self.layouts:
            for ph in layout.get("placeholders", []):
                ph_type = ph.get("type", "")
                bbox = ph.get("bbox_ratio", [])
                
                if len(bbox) != 4:
                    continue
                
                left = bbox[0] * 100
                top = bbox[1] * 100
                width = bbox[2] * 100
                height = bbox[3] * 100
                
                if ph_type == "PAGE_TITLE" and not has_title:
                    has_title = True
                    css_lines.extend([
                        "        .slide-title {",
                        f"            position: absolute;",
                        f"            left: {left:.1f}%;",
                        f"            top: {top:.1f}%;",
                        f"            width: {width:.1f}%;",
                        f"            height: {height:.1f}%;",
                        f"            font-family: '{title_font}', sans-serif;",
                        f"            font-size: clamp({min_size}px, {preferred_size}, {max_size}px);",
                        f"            font-weight: {title_weight};",
                        f"            color: {primary_color};",
                        "            display: flex;",
                        "            align-items: center;",
                        "            overflow: hidden;",
                        "        }",
                    ])
                elif ph_type == "SUBTITLE" and not has_subtitle:
                    has_subtitle = True
                    css_lines.extend([
                        "        .slide-subtitle {",
                        f"            position: absolute;",
                        f"            left: {left:.1f}%;",
                        f"            top: {top:.1f}%;",
                        f"            width: {width:.1f}%;",
                        f"            height: {height:.1f}%;",
                        f"            font-family: '{body_font}', sans-serif;",
                        f"            font-size: {body_size}px;",
                        "            color: #666666;",
                        "            display: flex;",
                        "            align-items: center;",
                        "            overflow: hidden;",
                        "        }",
                    ])
                elif ph_type in ("CONTENT_AREA", "CONTENT_AREA_LEFT", "CONTENT_AREA_RIGHT", "CONTENT_AREA_CENTER") and not has_content:
                    has_content = True
                    class_name = "content-area"
                    if ph_type == "CONTENT_AREA_LEFT":
                        class_name = "content-area-left"
                    elif ph_type == "CONTENT_AREA_RIGHT":
                        class_name = "content-area-right"
                    elif ph_type == "CONTENT_AREA_CENTER":
                        class_name = "content-area-center"
                    
                    css_lines.extend([
                        f"        .{class_name} {{",
                        f"            position: absolute;",
                        f"            left: {left:.1f}%;",
                        f"            top: {top:.1f}%;",
                        f"            width: {width:.1f}%;",
                        f"            height: {height:.1f}%;",
                        f"            font-family: '{body_font}', sans-serif;",
                        f"            font-size: {body_size}px;",
                        "            color: #333333;",
                        "            overflow: hidden;",
                        "        }",
                    ])
        
        if not has_title:
            css_lines.extend([
                "        .slide-title {",
                "            position: absolute;",
                "            left: 5%;",
                "            top: 5%;",
                "            width: 90%;",
                "            height: 15%;",
                f"            font-family: '{title_font}', sans-serif;",
                f"            font-size: clamp({min_size}px, {preferred_size}, {max_size}px);",
                f"            font-weight: {title_weight};",
                f"            color: {primary_color};",
                "            display: flex;",
                "            align-items: center;",
                "            overflow: hidden;",
                "        }",
            ])
        
        if not has_content:
            css_lines.extend([
                "        .content-area {",
                "            position: absolute;",
                "            left: 5%;",
                "            top: 25%;",
                "            width: 90%;",
                "            height: 65%;",
                f"            font-family: '{body_font}', sans-serif;",
                f"            font-size: {body_size}px;",
                "            color: #333333;",
                "            overflow: hidden;",
                "        }",
            ])
        
        return css_lines
    
    def _generate_html_structure(self) -> str:
        """生成 HTML 结构"""
        html_parts = ['    <div class="slide-container">']
        
        has_title = False
        has_subtitle = False
        has_content = False
        
        for layout in self.layouts:
            for ph in layout.get("placeholders", []):
                ph_type = ph.get("type", "")
                
                if ph_type == "PAGE_TITLE" and not has_title:
                    has_title = True
                    html_parts.append("        <h1 class=\"slide-title\">{{ main_heading }}</h1>")
                elif ph_type == "SUBTITLE" and not has_subtitle:
                    has_subtitle = True
                    html_parts.append("        <div class=\"slide-subtitle\">{{ subtitle }}</div>")
                elif ph_type in ("CONTENT_AREA", "CONTENT_AREA_LEFT", "CONTENT_AREA_RIGHT", "CONTENT_AREA_CENTER") and not has_content:
                    has_content = True
                    if ph_type == "CONTENT_AREA_LEFT":
                        html_parts.append("        <div class=\"content-area-left\">{{{ page_content_left }}}</div>")
                    elif ph_type == "CONTENT_AREA_RIGHT":
                        html_parts.append("        <div class=\"content-area-right\">{{{ page_content_right }}}</div>")
                    elif ph_type == "CONTENT_AREA_CENTER":
                        html_parts.append("        <div class=\"content-area-center\">{{{ page_content_center }}}</div>")
                    else:
                        html_parts.append("        <div class=\"content-area\">{{{ page_content }}}</div>")
        
        if not has_title:
            html_parts.append("        <h1 class=\"slide-title\">{{ main_heading }}</h1>")
        
        if not has_content:
            html_parts.append("        <div class=\"content-area\">{{{ page_content }}}</div>")
        
        html_parts.append("        <div class=\"slide-footer\">{{ current_page_number }} / {{ total_page_count }}</div>")
        html_parts.append("    </div>")
        
        return "\n".join(html_parts)


def generate_html_template_from_config(template_config: Dict[str, Any]) -> str:
    """
    根据模板配置生成 HTML 模板的便捷函数
    
    Args:
        template_config: PPTXStyleExtractor 输出的模板配置
    
    Returns:
        完整的 HTML 模板字符串
    """
    generator = HtmlTemplateGenerator(
        theme_colors=template_config.get("theme_colors"),
        fonts=template_config.get("fonts"),
        layouts=template_config.get("layouts"),
        slide_dimensions=template_config.get("slide_dimensions"),
        background=template_config.get("background"),
        font_styles=template_config.get("font_styles"),
        responsive_config=template_config.get("responsive_config"),
    )
    return generator.generate_template()
