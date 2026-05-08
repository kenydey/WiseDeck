"""
HTML 模板生成器 - 根据提取的 PPTX 样式信息生成完整的 WiseDeck HTML 模板

核心功能：
1. 根据提取的样式信息生成 CSS（含 CSS 变量系统）
2. 根据占位符坐标生成布局结构
3. 生成完整的 HTML 模板（Mustache 语法）
4. 支持页眉、页脚、页码等完整结构
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


DEFAULT_FONT_STACK = "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"


class HtmlTemplateGenerator:
    """HTML 模板生成器"""
    
    def __init__(
        self,
        theme_colors: Optional[Dict[str, str]] = None,
        fonts: Optional[Dict[str, Dict[str, Any]]] = None,
        layouts: Optional[List[Dict[str, Any]]] = None,
        slide_dimensions: Optional[Dict[str, Any]] = None,
        background: Optional[Dict[str, Any]] = None,
        margins: Optional[Dict[str, int]] = None,
        spacing: Optional[Dict[str, Any]] = None,
        responsive_config: Optional[Dict[str, Any]] = None,
        layout_type: str = "single_column",
    ):
        self.theme_colors = theme_colors or {
            "primary": "#4472C4",
            "secondary": "#ED7D31",
            "background": "#FFFFFF",
            "text": "#333333",
            "border": "rgba(68, 114, 196, 0.3)",
        }
        self.fonts = fonts or {
            "title": {"family": "Microsoft YaHei", "size": 44, "color": "#4472C4", "weight": "bold"},
            "body": {"family": "Microsoft YaHei", "size": 18, "color": "#333333", "weight": "normal"},
        }
        self.layouts = layouts or []
        self.slide_dimensions = slide_dimensions or {"width_pt": 1280, "height_pt": 720}
        self.background = background or {"type": "solid", "value": "#FFFFFF"}
        self.margins = margins or {"top": 40, "bottom": 20, "left": 60, "right": 60}
        self.spacing = spacing or {
            "title_content_gap": 30,
            "line_height": 1.5,
            "paragraph_spacing": 12,
        }
        self.responsive_config = responsive_config or {
            "min_font_size": 14,
            "preferred_font_size": "4vw",
            "max_font_size": 48,
        }
        self.layout_type = layout_type
    
    def generate_template(self) -> str:
        """生成完整的 HTML 模板"""
        css_variables = self._generate_css_variables()
        css = self._generate_css()
        html_structure = self._generate_html_structure()
        
        template = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{{{ page_title }}}}</title>
    <style>
{css_variables}
{css}
    </style>
</head>
<body>
{html_structure}
</body>
</html>"""
        
        return template
    
    def _generate_css_variables(self) -> str:
        """生成 CSS 变量定义"""
        primary = self.theme_colors.get("primary", "#4472C4")
        secondary = self.theme_colors.get("secondary", "#ED7D31")
        text = self.theme_colors.get("text", "#333333")
        background = self.background.get("value", "#FFFFFF")
        border = self.theme_colors.get("border", "rgba(68, 114, 196, 0.3)")
        
        return f"""        :root {{
            --primary-color: {primary};
            --secondary-color: {secondary};
            --text-color: {text};
            --heading-color: {primary};
            --border-color: {border};
            --bg-color: {background};
        }}"""
    
    def _generate_css(self) -> str:
        """生成 CSS 样式"""
        bg_css = self._get_background_css()
        primary = self.theme_colors.get("primary", "#4472C4")
        secondary = self.theme_colors.get("secondary", "#ED7D31")
        text_color = self.theme_colors.get("text", "#333333")
        
        width_pt = self.slide_dimensions.get("width_pt", 1280)
        height_pt = self.slide_dimensions.get("height_pt", 720)
        
        title_font = self.fonts.get("title", {})
        body_font = self.fonts.get("body", {})
        
        title_family = title_font.get("family", "Microsoft YaHei")
        title_size = title_font.get("size", 44)
        title_color = title_font.get("color", primary)
        title_weight = title_font.get("weight", "bold")
        
        body_family = body_font.get("family", "Microsoft YaHei")
        body_size = body_font.get("size", 18)
        body_color = body_font.get("color", text_color)
        body_weight = body_font.get("weight", "normal")
        
        min_size = self.responsive_config.get("min_font_size", 14)
        preferred_size = self.responsive_config.get("preferred_font_size", "4vw")
        max_size = self.responsive_config.get("max_font_size", 48)
        
        margin_top = self.margins.get("top", 40)
        margin_bottom = self.margins.get("bottom", 20)
        margin_left = self.margins.get("left", 60)
        margin_right = self.margins.get("right", 60)
        
        title_content_gap = self.spacing.get("title_content_gap", 30)
        line_height = self.spacing.get("line_height", 1.5)
        
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
            f"            margin: 0 auto;",
            f"            padding: {margin_top}px {margin_right}px {margin_bottom}px {margin_left}px;",
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
        
        placeholders_css = self._generate_placeholder_css(
            title_family, title_size, title_color, title_weight,
            body_family, body_size, body_color, body_weight,
            min_size, preferred_size, max_size
        )
        css_lines.extend(placeholders_css)
        
        css_lines.extend([
            "        .slide-header {",
            f"            margin-bottom: {title_content_gap}px;",
            "        }",
            "        .slide-title {",
            "            font-size: clamp(${min_size}px, ${preferred_size}, ${max_size}px);".replace("${min_size}", str(min_size)).replace("${preferred_size}", preferred_size).replace("${max_size}", str(max_size)),
            f"            color: var(--primary-color);",
            "        }",
            "        .slide-subtitle {",
            f"            font-size: {max(int(body_size * 0.85), 14)}px;",
            "            color: #666666;",
            "            margin-top: 10px;",
            "        }",
            "        .slide-content {",
            "            flex: 1;",
            "            display: flex;",
            "            flex-direction: column;",
            "        }",
            "        .content-main {",
            f"            font-size: {body_size}px;",
            f"            line-height: {line_height};",
            "            color: var(--text-color);",
            "            overflow: hidden;",
            "        }",
            "        .slide-footer {",
            "            position: absolute;",
            f"            bottom: {margin_bottom}px;",
            "            right: 30px;",
            "            font-size: 14px;",
            "            color: #94a3b8;",
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
    
    def _generate_placeholder_css(
        self,
        title_family: str,
        title_size: int,
        title_color: str,
        title_weight: str,
        body_family: str,
        body_size: int,
        body_color: str,
        body_weight: str,
        min_size: int,
        preferred_size: str,
        max_size: int,
    ) -> List[str]:
        """生成占位符 CSS"""
        css_lines = []
        
        has_title = False
        has_content = False
        has_subtitle = False
        
        title_bbox = None
        subtitle_bbox = None
        content_bbox = None
        
        for layout in self.layouts:
            for ph in layout.get("placeholders", []):
                ph_type = ph.get("type", "")
                bbox = ph.get("bbox_ratio", [])
                
                if len(bbox) != 4:
                    continue
                
                if ph_type == "PAGE_TITLE" and not has_title:
                    has_title = True
                    title_bbox = bbox
                    css_lines.extend([
                        "        .slide-title {",
                        f"            position: absolute;",
                        f"            left: {bbox[0]*100:.1f}%;",
                        f"            top: {bbox[1]*100:.1f}%;",
                        f"            width: {bbox[2]*100:.1f}%;",
                        f"            height: {bbox[3]*100:.1f}%;",
                        f"            font-family: '{title_family}', sans-serif;",
                        f"            font-size: clamp({min_size}px, {preferred_size}, {max_size}px);",
                        f"            font-weight: {title_weight};",
                        f"            color: {title_color};",
                        "            display: flex;",
                        "            align-items: center;",
                        "            overflow: hidden;",
                        "        }",
                    ])
                elif ph_type == "SUBTITLE" and not has_subtitle:
                    has_subtitle = True
                    subtitle_bbox = bbox
                elif ph_type in ("CONTENT_AREA", "CONTENT_AREA_LEFT", "CONTENT_AREA_RIGHT", "CONTENT_AREA_CENTER") and not has_content:
                    has_content = True
                    content_bbox = bbox
                    class_name = "content-main"
                    if ph_type == "CONTENT_AREA_LEFT":
                        class_name = "content-left"
                    elif ph_type == "CONTENT_AREA_RIGHT":
                        class_name = "content-right"
                    elif ph_type == "CONTENT_AREA_CENTER":
                        class_name = "content-center"
                    
                    line_height = self.spacing.get("line_height", 1.5)
                    css_lines.extend([
                        f"        .{class_name} {{",
                        f"            position: absolute;",
                        f"            left: {bbox[0]*100:.1f}%;",
                        f"            top: {bbox[1]*100:.1f}%;",
                        f"            width: {bbox[2]*100:.1f}%;",
                        f"            height: {bbox[3]*100:.1f}%;",
                        f"            font-family: '{body_family}', sans-serif;",
                        f"            font-size: {body_size}px;",
                        f"            line-height: {line_height};",
                        f"            color: {body_color};",
                        f"            font-weight: {body_weight};",
                        "            overflow: hidden;",
                        "        }",
                    ])
        
        if not has_title and title_bbox is None:
            css_lines.extend([
                "        .slide-title {",
                "            position: absolute;",
                "            left: 5%;",
                "            top: 5%;",
                "            width: 90%;",
                "            height: 15%;",
                f"            font-family: '{title_family}', sans-serif;",
                f"            font-size: clamp({min_size}px, {preferred_size}, {max_size}px);",
                f"            font-weight: {title_weight};",
                f"            color: {title_color};",
                "            display: flex;",
                "            align-items: center;",
                "            overflow: hidden;",
                "        }",
            ])
        
        if not has_content and content_bbox is None:
            css_lines.extend([
                "        .content-main {",
                "            position: absolute;",
                "            left: 5%;",
                "            top: 25%;",
                "            width: 90%;",
                "            height: 65%;",
                f"            font-family: '{body_family}', sans-serif;",
                f"            font-size: {body_size}px;",
                "            color: var(--text-color);",
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
                    html_parts.append("        <div class=\"slide-header\">")
                    html_parts.append("            <h1 class=\"slide-title\">{{ main_heading }}</h1>")
                elif ph_type == "SUBTITLE" and not has_subtitle:
                    has_subtitle = True
                    if not has_title:
                        html_parts.append("        <div class=\"slide-header\">")
                        has_title = True
                    html_parts.append("            <div class=\"slide-subtitle\">{{ subtitle }}</div>")
                elif ph_type in ("CONTENT_AREA", "CONTENT_AREA_LEFT", "CONTENT_AREA_RIGHT", "CONTENT_AREA_CENTER") and not has_content:
                    has_content = True
                    if not has_title:
                        html_parts.append("        <div class=\"slide-header\">")
                        html_parts.append("            <h1 class=\"slide-title\">{{ main_heading }}</h1>")
                        html_parts.append("        </div>")
                        has_title = True
                    else:
                        html_parts.append("        </div>")
                    
                    html_parts.append("        <div class=\"slide-content\">")
                    if ph_type == "CONTENT_AREA_LEFT":
                        html_parts.append("            <div class=\"content-left\">{{{ page_content_left }}}</div>")
                    elif ph_type == "CONTENT_AREA_RIGHT":
                        html_parts.append("            <div class=\"content-right\">{{{ page_content_right }}}</div>")
                    elif ph_type == "CONTENT_AREA_CENTER":
                        html_parts.append("            <div class=\"content-center\">{{{ page_content_center }}}</div>")
                    else:
                        html_parts.append("            <div class=\"content-main\">{{{ page_content }}}</div>")
                    html_parts.append("        </div>")
        
        if not has_title:
            html_parts.append("        <div class=\"slide-header\">")
            html_parts.append("            <h1 class=\"slide-title\">{{ main_heading }}</h1>")
            html_parts.append("        </div>")
        
        if not has_content:
            if not has_title:
                html_parts.append("        </div>")
            html_parts.append("        <div class=\"slide-content\">")
            html_parts.append("            <div class=\"content-main\">{{{ page_content }}}</div>")
            html_parts.append("        </div>")
        
        html_parts.append("        <div class=\"slide-footer\">")
        html_parts.append("            <span class=\"page-number\">{{ current_page_number }} / {{ total_page_count }}</span>")
        html_parts.append("        </div>")
        html_parts.append("    </div>")
        
        return "\n".join(html_parts)


def generate_html_template_from_config(template_config: Dict[str, Any]) -> str:
    """
    根据模板配置生成 HTML 模板的便捷函数
    
    Args:
        template_config: PPTXStyleExtractor 输出的模板配置 (schema_version: 2)
    
    Returns:
        完整的 HTML 模板字符串
    """
    template_contract = template_config.get("template_contract", {})
    
    generator = HtmlTemplateGenerator(
        theme_colors=template_config.get("theme_colors"),
        fonts=template_config.get("fonts"),
        layouts=template_config.get("layouts"),
        slide_dimensions=template_config.get("slide_dimensions"),
        background=template_config.get("background"),
        margins=template_config.get("margins"),
        spacing=template_config.get("spacing"),
        responsive_config=template_config.get("responsive_config"),
        layout_type=template_contract.get("layout_type", "single_column"),
    )
    return generator.generate_template()
