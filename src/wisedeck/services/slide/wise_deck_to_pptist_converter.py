"""
WiseDeck 到 PPTist 格式转换工具

将 WiseDeck 的 HTML 格式幻灯片转换为 PPTist JSON 格式
"""

import json
import re
import uuid
from typing import Any, Dict, List, Optional

from .canvas_constants import VIEWPORT_HEIGHT, VIEWPORT_WIDTH


class WiseDeckToPPTistConverter:
    """将 WiseDeck HTML 幻灯片转换为 PPTist JSON 格式"""

    def __init__(self):
        self.canvas_width = VIEWPORT_WIDTH
        self.canvas_height = VIEWPORT_HEIGHT
        self.margin = 50
        self.content_width = self.canvas_width - 2 * self.margin

    def generate_element_id(self) -> str:
        """生成唯一的元素 ID"""
        return uuid.uuid4().hex[:10]

    def generate_slide_id(self) -> str:
        """生成唯一的幻灯片 ID"""
        return uuid.uuid4().hex[:10]

    def extract_text_from_html(self, html: str) -> List[Dict[str, Any]]:
        """从 HTML 中提取文本内容和样式信息"""
        elements = []

        # 提取标题
        h1_matches = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL | re.IGNORECASE)
        for i, content in enumerate(h1_matches):
            clean_content = self._clean_html_content(content)
            if clean_content.strip():
                elements.append({
                    'type': 'heading',
                    'level': 1,
                    'content': clean_content,
                    'index': i
                })

        h2_matches = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.DOTALL | re.IGNORECASE)
        for i, content in enumerate(h2_matches):
            clean_content = self._clean_html_content(content)
            if clean_content.strip():
                elements.append({
                    'type': 'heading',
                    'level': 2,
                    'content': clean_content,
                    'index': i
                })

        h3_matches = re.findall(r'<h3[^>]*>(.*?)</h3>', html, re.DOTALL | re.IGNORECASE)
        for i, content in enumerate(h3_matches):
            clean_content = self._clean_html_content(content)
            if clean_content.strip():
                elements.append({
                    'type': 'heading',
                    'level': 3,
                    'content': clean_content,
                    'index': i
                })

        # 提取段落
        p_matches = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL | re.IGNORECASE)
        for i, content in enumerate(p_matches):
            clean_content = self._clean_html_content(content)
            if clean_content.strip() and not clean_content.startswith('•') and not clean_content.startswith('-'):
                elements.append({
                    'type': 'paragraph',
                    'content': clean_content,
                    'index': i
                })

        # 提取列表项
        li_matches = re.findall(r'<li[^>]*>(.*?)</li>', html, re.DOTALL | re.IGNORECASE)
        for i, content in enumerate(li_matches):
            clean_content = self._clean_html_content(content)
            if clean_content.strip():
                elements.append({
                    'type': 'list_item',
                    'content': clean_content,
                    'index': i
                })

        # 提取图片
        img_matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html, re.IGNORECASE)
        for i, src in enumerate(img_matches):
            if src:
                elements.append({
                    'type': 'image',
                    'src': src,
                    'index': i
                })

        return elements

    def _clean_html_content(self, content: str) -> str:
        """清理 HTML 内容，移除标签但保留文本"""
        # 移除所有 HTML 标签
        text = re.sub(r'<[^>]+>', '', content)
        # 解码 HTML 实体
        text = text.replace('&nbsp;', ' ')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        text = text.replace('&amp;', '&')
        text = text.replace('&quot;', '"')
        text = text.replace('&#39;', "'")
        # 规范化空白字符
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def extract_styles_from_html(self, html: str) -> Dict[str, Any]:
        """从 HTML 中提取样式信息"""
        styles = {
            'background_color': '#ffffff',
            'theme_colors': ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
            'font_color': '#333333',
            'font_name': '微软雅黑'
        }

        # 提取背景色
        bg_match = re.search(r'background[-:]?\s*color[:\s]*\s*([^;]+);?', html, re.IGNORECASE)
        if bg_match:
            styles['background_color'] = self._normalize_color(bg_match.group(1))

        # 提取字体颜色
        color_matches = re.findall(r'(?:color|font[-_]color)[:\s]*\s*([^;]+);?', html, re.IGNORECASE)
        if color_matches:
            for color in color_matches:
                normalized = self._normalize_color(color)
                if normalized and normalized != '#ffffff':
                    styles['font_color'] = normalized
                    break

        # 提取字体
        font_match = re.search(r'font[-_]family[:\s]*\s*([^;]+);?', html, re.IGNORECASE)
        if font_match:
            styles['font_name'] = font_match.group(1).strip('"\'')

        return styles

    def _normalize_color(self, color: str) -> str:
        """标准化颜色值"""
        color = color.strip().lower()
        if not color:
            return '#000000'

        # 如果已经是 # 开头
        if color.startswith('#'):
            if len(color) == 4:
                # #fff -> #ffffff
                return '#' + ''.join([c*2 for c in color[1:]])
            return color[:7]
        return color

    def _fix_image_url(self, src: str) -> str:
        """修复图片URL路径"""
        if not src:
            return src
        
        if src.startswith('data:') or src.startswith('http://') or src.startswith('https://'):
            return src
        
        if src.startswith('/') and not src.startswith('//'):
            return f"http://127.0.0.1:8000{src}"
        
        return src

    def create_text_element(
        self,
        content: str,
        x: float,
        y: float,
        width: float,
        height: float,
        font_size: int = 24,
        font_weight: str = 'normal',
        text_align: str = 'left',
        color: str = '#333333'
    ) -> Dict[str, Any]:
        """创建 PPTist 文本元素"""
        return {
            'id': self.generate_element_id(),
            'type': 'text',
            'left': x,
            'top': y,
            'width': width,
            'height': height,
            'rotate': 0,
            'content': content,
            'defaultFontName': '微软雅黑',
            'defaultColor': color,
            'lineHeight': 1.5,
            'wordSpace': 0,
            'opacity': 1,
            'paragraphSpace': 5,
            'vertical': False,
            'textType': 'content'
        }

    def create_image_element(
        self,
        src: str,
        x: float,
        y: float,
        width: float,
        height: float
    ) -> Dict[str, Any]:
        """创建 PPTist 图片元素"""
        return {
            'id': self.generate_element_id(),
            'type': 'image',
            'left': x,
            'top': y,
            'width': width,
            'height': height,
            'rotate': 0,
            'fixedRatio': True,
            'src': src,
            'outline': {
                'style': 'solid',
                'width': 0,
                'color': '#000000'
            }
        }

    def create_rect_element(
        self,
        x: float,
        y: float,
        width: float,
        height: float,
        fill_color: str = '#ffffff',
        border_radius: int = 0
    ) -> Dict[str, Any]:
        """创建 PPTist 矩形元素（背景）"""
        return {
            'id': self.generate_element_id(),
            'type': 'shape',
            'left': x,
            'top': y,
            'width': width,
            'height': height,
            'rotate': 0,
            'shape': {
                'type': 'rect',
                'path': '',
                'fill': fill_color,
                'stroke': '#000000',
                'strokeWidth': 0
            },
            'borderRadius': border_radius
        }

    def convert_html_to_elements(self, html: str) -> List[Dict[str, Any]]:
        """将 HTML 内容转换为 PPTist 元素数组"""
        if not html:
            return []

        elements = []
        extracted = self.extract_text_from_html(html)
        styles = self.extract_styles_from_html(html)

        current_y = self.margin
        heading_height = 50
        paragraph_height = 40
        list_item_height = 36
        image_height = 300

        for item in extracted:
            if item['type'] == 'heading':
                level = item['level']
                font_size = 48 if level == 1 else 36 if level == 2 else 28
                height = heading_height + (font_size - 24)

                elements.append(self.create_text_element(
                    content=item['content'],
                    x=self.margin,
                    y=current_y,
                    width=self.content_width,
                    height=height,
                    font_size=font_size,
                    font_weight='bold',
                    text_align='center' if level == 1 else 'left',
                    color=styles['font_color']
                ))
                current_y += height + 20

            elif item['type'] == 'paragraph':
                elements.append(self.create_text_element(
                    content=item['content'],
                    x=self.margin,
                    y=current_y,
                    width=self.content_width,
                    height=paragraph_height,
                    font_size=20,
                    font_weight='normal',
                    text_align='left',
                    color=styles['font_color']
                ))
                current_y += paragraph_height + 10

            elif item['type'] == 'list_item':
                elements.append(self.create_text_element(
                    content=f"• {item['content']}",
                    x=self.margin + 20,
                    y=current_y,
                    width=self.content_width - 20,
                    height=list_item_height,
                    font_size=18,
                    font_weight='normal',
                    text_align='left',
                    color=styles['font_color']
                ))
                current_y += list_item_height + 5

            elif item['type'] == 'image':
                fixed_src = self._fix_image_url(item['src'])
                elements.append(self.create_image_element(
                    src=fixed_src,
                    x=self.margin,
                    y=current_y,
                    width=self.content_width,
                    height=image_height
                ))
                current_y += image_height + 20

        return elements

    def convert_slide(
        self,
        wise_deck_slide: Dict[str, Any],
        slide_index: int = 0
    ) -> Dict[str, Any]:
        """将单个 WiseDeck 幻灯片转换为 PPTist 格式"""
        slide_id = wise_deck_slide.get('id') or wise_deck_slide.get('slide_id') or self.generate_slide_id()
        html_content = wise_deck_slide.get('html_content', '')
        title = wise_deck_slide.get('title', '')
        styles = self.extract_styles_from_html(html_content)

        elements = []

        # 如果有标题，添加标题元素
        if title:
            elements.append(self.create_text_element(
                content=title,
                x=self.margin,
                y=30,
                width=self.content_width,
                height=60,
                font_size=36,
                font_weight='bold',
                text_align='center',
                color=styles['font_color']
            ))

        # 转换 HTML 内容为元素
        content_elements = self.convert_html_to_elements(html_content)
        elements.extend(content_elements)

        # 创建 PPTist 幻灯片
        bg: Dict[str, Any] = {'type': 'solid', 'color': styles['background_color']}
        bg_img_match = re.search(
            r'background[-:]?\s*image[:\s]*\s*url\(["\']?([^"\'\)]+)',
            html_content or "",
            re.IGNORECASE,
        )
        bg_img = bg_img_match.group(1).strip() if bg_img_match else None
        if bg_img:
            bg = {'type': 'image', 'color': '#ffffff', 'image': {'src': self._fix_image_url(bg_img), 'size': 'cover'}}

        pptist_slide = {
            'id': slide_id,
            'elements': elements,
            'notes': [],
            'remark': '',
            'background': bg,
            'outline': [],
            'slidelayout': ''
        }

        return pptist_slide

    def convert_slides(
        self,
        wise_deck_slides: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """将多个 WiseDeck 幻灯片转换为 PPTist 格式"""
        return [self.convert_slide(slide, i) for i, slide in enumerate(wise_deck_slides)]


def html_to_pptist_elements(html: str) -> List[Dict[str, Any]]:
    """快捷函数：将 HTML 转换为 PPTist 元素数组"""
    converter = WiseDeckToPPTistConverter()
    return converter.convert_html_to_elements(html)


def wise_deck_slide_to_pptist(
    wise_deck_slide: Dict[str, Any]
) -> Dict[str, Any]:
    """快捷函数：将单个 WiseDeck 幻灯片转换为 PPTist 格式"""
    converter = WiseDeckToPPTistConverter()
    return converter.convert_slide(wise_deck_slide)


def wise_deck_slides_to_pptist(
    wise_deck_slides: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """快捷函数：将多个 WiseDeck 幻灯片转换为 PPTist 格式"""
    converter = WiseDeckToPPTistConverter()
    return converter.convert_slides(wise_deck_slides)
