"""
PPTist 格式幻灯片生成服务

负责将 AI 生成的内容转换为 PPTist JSON 格式
"""

import json
import logging
import re
import uuid
from typing import Any, Dict, List, Optional

from .canvas_constants import DEFAULT_MARGIN, VIEWPORT_HEIGHT, VIEWPORT_WIDTH

logger = logging.getLogger(__name__)


class PPTistGenerationService:
    """PPTist JSON 格式幻灯片生成服务"""

    def __init__(self):
        self.canvas_width = VIEWPORT_WIDTH
        self.canvas_height = VIEWPORT_HEIGHT
        self.margin = DEFAULT_MARGIN
        self.content_width = self.canvas_width - 2 * self.margin

    def generate_element_id(self) -> str:
        """生成元素 ID"""
        return uuid.uuid4().hex[:10]

    def generate_slide_id(self) -> str:
        """生成幻灯片 ID"""
        return uuid.uuid4().hex[:10]

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
        """创建文本元素"""
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

    def create_title_element(
        self,
        content: str,
        font_size: int = 32,
        color: str = '#333333',
        text_align: str = 'center'
    ) -> Dict[str, Any]:
        """创建标题元素"""
        return {
            'id': self.generate_element_id(),
            'type': 'text',
            'left': self.margin,
            'top': 0,
            'width': self.content_width,
            'height': font_size + 20,
            'rotate': 0,
            'content': content,
            'defaultFontName': '微软雅黑',
            'defaultColor': color,
            'fontSize': font_size,
            'fontWeight': 'bold',
            'lineHeight': 1.3,
            'wordSpace': 0,
            'opacity': 1,
            'paragraphSpace': 10,
            'vertical': False,
            'textType': 'heading',
            'textAlign': text_align
        }

    def create_divider_element(
        self,
        color: str = '#d4a574',
        width: int = 600
    ) -> Dict[str, Any]:
        """创建装饰线元素"""
        return {
            'id': self.generate_element_id(),
            'type': 'shape',
            'left': (self.canvas_width - width) / 2,
            'top': 0,
            'width': width,
            'height': 3,
            'rotate': 0,
            'shape': {
                'type': 'rect',
                'path': '',
                'fill': color,
                'stroke': color,
                'strokeWidth': 0
            },
            'borderRadius': 2
        }

    def create_image_element(
        self,
        src: str,
        x: float,
        y: float,
        width: float,
        height: float
    ) -> Dict[str, Any]:
        """创建图片元素"""
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

    def create_chart_element(self, chart_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建图表元素（PPTist 扁平字段：chartType / data / themeColors）"""
        from .render.pptist_emitter import _outline_chart_to_element

        region = {
            'left': self.margin,
            'top': 0,
            'width': self.content_width,
            'height': 300,
        }
        base = _outline_chart_to_element(chart_data, region)
        base['id'] = self.generate_element_id()
        return base

    def create_shape_element(
        self,
        x: float,
        y: float,
        width: float,
        height: float,
        shape_type: str = 'rect',
        fill_color: str = '#ffffff',
        stroke_color: str = '#000000',
        stroke_width: int = 0,
        border_radius: int = 0
    ) -> Dict[str, Any]:
        """创建形状元素"""
        return {
            'id': self.generate_element_id(),
            'type': 'shape',
            'left': x,
            'top': y,
            'width': width,
            'height': height,
            'rotate': 0,
            'shape': {
                'type': shape_type,
                'path': '',
                'fill': fill_color,
                'stroke': stroke_color,
                'strokeWidth': stroke_width
            },
            'borderRadius': border_radius
        }

    def _parse_html_styles(self, html_content: Optional[str]) -> Dict[str, Any]:
        """从HTML中完整解析样式信息"""
        styles = {
            'title_font_size': 32,
            'title_color': '#333333',
            'title_align': 'center',
            'body_font_size': 18,
            'body_color': '#666666',
            'background': '#f5f2eb',
            'background_type': 'solid',
            'background_image': None,
            'has_divider': False,
            'divider_color': '#d4a574',
            'divider_width': 600,
            'theme_colors': [],
            'layout_type': 'single_column'
        }
        
        if not html_content:
            return styles
        
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # 解析style标签中的CSS变量和背景图片
            style_tags = soup.find_all('style')
            for style_tag in style_tags:
                css_text = style_tag.get_text()
                
                # 解析CSS变量
                if ':root' in css_text or '--' in css_text:
                    var_matches = re.findall(r'--(\w+)\s*:\s*([^;]+)', css_text)
                    for var_name, var_value in var_matches:
                        if 'color' in var_name.lower():
                            styles['theme_colors'].append(var_value.strip())
                
                # 解析主题颜色
                primary_match = re.search(r'(--primary(?:-color)?)\s*:\s*([^;]+)', css_text, re.IGNORECASE)
                if primary_match:
                    styles['theme_colors'].append(primary_match.group(2).strip())
                
                # 解析背景图片
                bg_image_match = re.search(r'background-image\s*:\s*url\(\s*["\']?([^"\')]+)["\']?\s*\)', css_text)
                if bg_image_match:
                    styles['background_image'] = bg_image_match.group(1).strip()
                    styles['background_type'] = 'image'
            
            # 解析标题样式
            title_tags = soup.find_all(['h1', 'h2', 'h3'])
            for tag in title_tags:
                style = tag.get('style', '')
                if style:
                    if 'font-size' in style:
                        match = re.search(r'font-size:\s*(\d+)', style)
                        if match:
                            styles['title_font_size'] = int(match.group(1))
                    if 'color' in style:
                        match = re.search(r'color:\s*([#a-fA-F0-9]+)', style)
                        if match:
                            styles['title_color'] = match.group(1)
                    if 'text-align' in style:
                        match = re.search(r'text-align:\s*(\w+)', style)
                        if match:
                            styles['title_align'] = match.group(1)
                    break
            
            # 解析body样式（背景）
            body_tag = soup.find('body')
            if body_tag and body_tag.get('style'):
                style = body_tag['style']
                
                # 解析背景颜色
                if 'background' in style:
                    match = re.search(r'background\s*[:-]\s*([^;]+)', style)
                    if match:
                        bg_value = match.group(1).strip()
                        if bg_value.startswith('#'):
                            styles['background'] = bg_value
                        elif 'gradient' in bg_value.lower():
                            styles['background_type'] = 'gradient'
                            styles['background'] = bg_value
                        else:
                            styles['background'] = bg_value
                
                # 解析背景图片
                bg_image_match = re.search(r'background-image\s*:\s*url\(\s*["\']?([^"\')]+)["\']?\s*\)', style)
                if bg_image_match:
                    styles['background_image'] = bg_image_match.group(1).strip()
                    styles['background_type'] = 'image'
            
            # 解析容器样式
            container = soup.find(class_=re.compile(r'slide|content|container'))
            if not container:
                container = soup.find('div', class_=lambda x: x and ('slide' in x or 'content' in x or 'container' in x))
            if container and container.get('style'):
                style = container['style']
                
                # 解析背景颜色
                if 'background' in style:
                    match = re.search(r'background\s*[:-]\s*([^;]+)', style)
                    if match:
                        bg_value = match.group(1).strip()
                        if bg_value.startswith('#'):
                            styles['background'] = bg_value
                        elif 'gradient' in bg_value.lower():
                            styles['background_type'] = 'gradient'
                            styles['background'] = bg_value
                
                # 解析背景图片
                bg_image_match = re.search(r'background-image\s*:\s*url\(\s*["\']?([^"\')]+)["\']?\s*\)', style)
                if bg_image_match:
                    styles['background_image'] = bg_image_match.group(1).strip()
                    styles['background_type'] = 'image'
            
            # 检测装饰线
            if soup.find('hr'):
                styles['has_divider'] = True
                hr = soup.find('hr')
                if hr:
                    if hr.get('color'):
                        styles['divider_color'] = hr.get('color')
                    if hr.get('width'):
                        styles['divider_width'] = int(hr.get('width'))
            
            # 解析段落样式
            p_tags = soup.find_all('p')
            for p in p_tags[:3]:
                style = p.get('style', '')
                if style:
                    if 'font-size' in style:
                        match = re.search(r'font-size:\s*(\d+)', style)
                        if match:
                            styles['body_font_size'] = int(match.group(1))
                    if 'color' in style:
                        match = re.search(r'color:\s*([#a-fA-F0-9]+)', style)
                        if match:
                            styles['body_color'] = match.group(1)
                    break
            
        except Exception as e:
            logger.warning(f"解析HTML样式失败: {e}")
        
        return styles

    def _fix_image_url(self, src: str) -> str:
        """修复图片URL路径"""
        if not src:
            return src
        
        if src.startswith('data:') or src.startswith('http://') or src.startswith('https://'):
            return src
        
        if src.startswith('/') and not src.startswith('//'):
            return f"http://127.0.0.1:8000{src}"
        
        return src

    def _parse_html_content(self, html_content: Optional[str], styles: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """从HTML中完整解析内容元素（含样式）"""
        elements = []
        parsed_styles = styles or {}
        
        if not html_content:
            return elements
        
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # 解析标题
            for h1 in soup.find_all('h1'):
                text = h1.get_text(strip=True)
                if text:
                    style = h1.get('style', '')
                    font_size = parsed_styles.get('title_font_size', 32)
                    color = parsed_styles.get('title_color', '#333333')
                    align = parsed_styles.get('title_align', 'center')
                    
                    if 'font-size' in style:
                        match = re.search(r'font-size:\s*(\d+)', style)
                        if match:
                            font_size = int(match.group(1))
                    if 'color' in style:
                        match = re.search(r'color:\s*([#a-fA-F0-9]+)', style)
                        if match:
                            color = match.group(1)
                    if 'text-align' in style:
                        match = re.search(r'text-align:\s*(\w+)', style)
                        if match:
                            align = match.group(1)
                    
                    elements.append(self.create_text_element(
                        text,
                        self.margin,
                        0,
                        self.content_width,
                        font_size + 20,
                        font_size,
                        'bold',
                        align,
                        color
                    ))
            
            for h2 in soup.find_all('h2'):
                text = h2.get_text(strip=True)
                if text:
                    style = h2.get('style', '')
                    font_size = parsed_styles.get('title_font_size', 32) - 4
                    color = parsed_styles.get('title_color', '#333333')
                    
                    if 'font-size' in style:
                        match = re.search(r'font-size:\s*(\d+)', style)
                        if match:
                            font_size = int(match.group(1))
                    if 'color' in style:
                        match = re.search(r'color:\s*([#a-fA-F0-9]+)', style)
                        if match:
                            color = match.group(1)
                    
                    elements.append(self.create_text_element(
                        text,
                        self.margin,
                        0,
                        self.content_width,
                        font_size + 15,
                        font_size,
                        'bold',
                        'left',
                        color
                    ))
            
            # 解析段落
            for p in soup.find_all('p'):
                text = p.get_text(strip=True)
                if text and len(text) > 1:
                    style = p.get('style', '')
                    font_size = parsed_styles.get('body_font_size', 18)
                    color = parsed_styles.get('body_color', '#666666')
                    align = 'left'
                    
                    if 'font-size' in style:
                        match = re.search(r'font-size:\s*(\d+)', style)
                        if match:
                            font_size = int(match.group(1))
                    if 'color' in style:
                        match = re.search(r'color:\s*([#a-fA-F0-9]+)', style)
                        if match:
                            color = match.group(1)
                    if 'text-align' in style:
                        match = re.search(r'text-align:\s*(\w+)', style)
                        if match:
                            align = match.group(1)
                    
                    elements.append(self.create_text_element(
                        text,
                        self.margin,
                        0,
                        self.content_width,
                        font_size * 1.8,
                        font_size,
                        'normal',
                        align,
                        color
                    ))
            
            # 解析列表
            for ul in soup.find_all('ul'):
                for li in ul.find_all('li'):
                    text = li.get_text(strip=True)
                    if text:
                        elements.append(self.create_text_element(
                            '• ' + text,
                            self.margin + 40,
                            0,
                            self.content_width - 40,
                            40,
                            parsed_styles.get('body_font_size', 18) - 2,
                            'normal',
                            'left',
                            parsed_styles.get('body_color', '#666666')
                        ))
            
            # 解析有序列表
            for ol in soup.find_all('ol'):
                idx = 1
                for li in ol.find_all('li'):
                    text = li.get_text(strip=True)
                    if text:
                        elements.append(self.create_text_element(
                            f'{idx}. {text}',
                            self.margin + 40,
                            0,
                            self.content_width - 40,
                            40,
                            parsed_styles.get('body_font_size', 18) - 2,
                            'normal',
                            'left',
                            parsed_styles.get('body_color', '#666666')
                        ))
                        idx += 1
            
            # 解析图片（修复URL路径）
            for img in soup.find_all('img'):
                src = img.get('src', '')
                if src:
                    fixed_src = self._fix_image_url(src)
                    width = int(img.get('width', self.content_width))
                    height = int(img.get('height', 200))
                    elements.append(self.create_image_element(
                        fixed_src,
                        self.margin,
                        0,
                        min(width, self.content_width),
                        height
                    ))
            
            # 解析表格（简化处理）
            for table in soup.find_all('table'):
                rows = table.find_all('tr')
                if rows:
                    table_text = []
                    for row in rows:
                        cells = row.find_all(['td', 'th'])
                        cell_texts = [cell.get_text(strip=True) for cell in cells if cell.get_text(strip=True)]
                        if cell_texts:
                            table_text.append(' | '.join(cell_texts))
                    
                    if table_text:
                        table_content = '\n'.join(table_text)
                        elements.append(self.create_text_element(
                            table_content,
                            self.margin,
                            0,
                            self.content_width,
                            200,
                            parsed_styles.get('body_font_size', 18) - 2,
                            'normal',
                            'left',
                            parsed_styles.get('body_color', '#666666')
                        ))
            
            # 解析装饰元素（Logo、日期、标签等）
            # 查找可能是Logo的图片（通常在左上角或有特定class）
            logo_imgs = soup.find_all('img', class_=re.compile(r'logo|brand', re.IGNORECASE))
            if not logo_imgs:
                # 尝试查找小尺寸图片作为Logo候选
                for img in soup.find_all('img'):
                    width = int(img.get('width', 0))
                    height = int(img.get('height', 0))
                    if 30 <= width <= 150 and 20 <= height <= 80:
                        logo_imgs.append(img)
            
            for img in logo_imgs[:2]:
                src = img.get('src', '')
                if src:
                    fixed_src = self._fix_image_url(src)
                    width = int(img.get('width', 80))
                    height = int(img.get('height', 40))
                    elements.append(self.create_image_element(
                        fixed_src,
                        self.margin,
                        self.margin,
                        min(width, 150),
                        min(height, 80)
                    ))
            
            # 解析日期元素
            date_patterns = [
                r'\d{4}[\-.]\d{2}[\-.]\d{2}',
                r'\d{4}年\d{1,2}月\d{1,2}日',
                r'[A-Za-z]+\s+\d{1,2},\s+\d{4}',
            ]
            
            for tag in soup.find_all(['span', 'div', 'p']):
                text = tag.get_text(strip=True)
                for pattern in date_patterns:
                    if re.search(pattern, text):
                        elements.append(self.create_text_element(
                            text,
                            self.canvas_width - self.margin - 150,
                            self.canvas_height - self.margin - 30,
                            150,
                            30,
                            12,
                            'normal',
                            'right',
                            '#999999'
                        ))
                        break
            
            # 解析CONFIDENTIAL或其他标签
            for tag in soup.find_all(['span', 'div', 'p']):
                text = tag.get_text(strip=True)
                if text.upper() in ['CONFIDENTIAL', '机密', '内部', 'INTERNAL']:
                    elements.append(self.create_text_element(
                        text,
                        self.canvas_width - self.margin - 120,
                        self.margin,
                        120,
                        25,
                        10,
                        'bold',
                        'right',
                        '#999999'
                    ))
            
            # 解析装饰线条（hr标签或带有line类的元素）
            hr_tags = soup.find_all('hr')
            for hr in hr_tags:
                color = hr.get('color', parsed_styles.get('divider_color', '#d4a574'))
                width = int(hr.get('width', 600))
                elements.append(self.create_divider_element(color, width))
        
        except Exception as e:
            logger.warning(f"解析HTML内容失败: {e}")
        
        return elements

    def _get_background_from_template(self, slide: Dict[str, Any], parsed_styles: Dict[str, Any]) -> Dict[str, Any]:
        """获取背景信息"""
        # 优先使用解析的背景图片
        if parsed_styles.get('background_image'):
            bg_image = self._fix_image_url(parsed_styles['background_image'])
            return {'type': 'image', 'color': '#ffffff', 'image': {'src': bg_image, 'size': 'cover'}}
        
        # 使用解析的样式
        if parsed_styles.get('background'):
            bg = parsed_styles['background']
            if bg.startswith('#'):
                return {'type': 'solid', 'color': bg}
            elif 'gradient' in bg.lower():
                return {'type': 'gradient', 'value': bg}
        
        # 使用slide中的背景信息
        if slide.get('background'):
            return slide['background']
        
        # 默认背景（从模板系统获取）
        return {'type': 'solid', 'color': '#f5f2eb'}

    def parse_slide_content_to_elements(self, content: str) -> List[Dict[str, Any]]:
        """解析幻灯片内容为 PPTist 元素"""
        elements = []
        
        if not content:
            return elements

        try:
            content_data = json.loads(content)
            
            if isinstance(content_data, dict) and 'elements' in content_data:
                return content_data['elements']
            
        except json.JSONDecodeError:
            pass

        elements.append(self.create_text_element(
            content=content,
            x=self.margin,
            y=self.margin + 80,
            width=self.content_width,
            height=40,
            font_size=20,
            font_weight='normal',
            text_align='left',
            color='#666666'
        ))

        return elements

    def generate_pptist_slide(
        self,
        slide_data: Dict[str, Any],
        page_number: int,
        total_pages: int,
        html_content: Optional[str] = None
    ) -> Dict[str, Any]:
        """生成 PPTist JSON（同步版本：SlideDocument emitter）。

        注意：Playwright 栅格化 harvest 只在生成主流程中启用（异步），这里保持同步，避免破坏调用链。
        """
        from .slide_document_builder import build_slide_document_v1
        from .render.pptist_emitter import emit_pptist_slide_dict
        from .pptist_background_utils import normalize_slide_background

        doc = build_slide_document_v1(slide_data, html_content, page_number, total_pages)
        sid = slide_data.get("id") or slide_data.get("slide_id")
        ppt = emit_pptist_slide_dict(doc, slide_id=str(sid) if sid else None)
        ppt["background"] = normalize_slide_background(ppt.get("background"))
        return ppt

    def generate_pptist_slides(
        self,
        slides_data: List[Dict[str, Any]],
        html_contents: List[str] = None
    ) -> List[Dict[str, Any]]:
        """生成多个 PPTist 格式幻灯片"""
        pptist_slides = []
        
        for i, slide_data in enumerate(slides_data):
            html_content = html_contents[i] if html_contents and i < len(html_contents) else None
            pptist_slide = self.generate_pptist_slide(
                slide_data,
                i + 1,
                len(slides_data),
                html_content
            )
            pptist_slides.append(pptist_slide)
        
        return pptist_slides

    def convert_html_to_pptist(self, slide_data: Dict[str, Any]) -> Dict[str, Any]:
        """将 HTML 格式幻灯片转换为 PPTist 格式"""
        from .wise_deck_to_pptist_converter import wise_deck_slide_to_pptist
        return wise_deck_slide_to_pptist(slide_data)

    def convert_html_slides_to_pptist(self, slides_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """将多个 HTML 格式幻灯片转换为 PPTist 格式"""
        from .wise_deck_to_pptist_converter import wise_deck_slides_to_pptist
        return wise_deck_slides_to_pptist(slides_data)