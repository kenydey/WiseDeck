"""
统一导出服务

提供从PPTist格式数据直接导出PPTX的能力，确保PPT编辑器和完整编辑器的导出功能统一。
"""

import json
import logging
import re
import tempfile
from html import unescape
from io import BytesIO
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from pptx import Presentation
from pptx.util import Inches

from wisedeck.services.slide.canvas_constants import VIEWPORT_HEIGHT, VIEWPORT_WIDTH

logger = logging.getLogger(__name__)


def _plain_text_from_pptist_content(html: str) -> str:
    if not html:
        return ""
    text = re.sub(r"<[^>]+>", " ", html)
    text = unescape(text.replace("&nbsp;", " "))
    return re.sub(r"\s+", " ", text).strip()


class UnifiedExportService:
    """统一导出服务 - 支持从PPTist格式数据直接导出"""

    def __init__(self):
        self.canvas_width = VIEWPORT_WIDTH
        self.canvas_height = VIEWPORT_HEIGHT

    def _element_box_emu(self, element: Dict[str, Any], prs) -> Tuple[int, int, int, int]:
        """Map PPTist logical pixels (VIEWPORT_*) to slide EMUs."""
        sw = int(prs.slide_width)
        sh = int(prs.slide_height)
        left = int(round(sw * float(element["left"]) / self.canvas_width))
        top = int(round(sh * float(element["top"]) / self.canvas_height))
        width = int(round(sw * float(element["width"]) / self.canvas_width))
        height = int(round(sh * float(element["height"]) / self.canvas_height))
        return left, top, width, height

    def _convert_pptist_text_to_pptx(self, element: Dict[str, Any], slide, prs):
        """将PPTist文本元素转换为PPTX形状"""
        left, top, width, height = self._element_box_emu(element, prs)

        textbox = slide.shapes.add_textbox(left, top, width, height)
        text_frame = textbox.text_frame
        text_frame.text = _plain_text_from_pptist_content(element.get("content", ""))

        # 设置字体属性
        for paragraph in text_frame.paragraphs:
            for run in paragraph.runs:
                if element.get('defaultColor'):
                    run.font.color.rgb = self._hex_to_rgb(element['defaultColor'])
                if element.get('fontSize'):
                    run.font.size = self._pt_to_font_size(element['fontSize'])
                if element.get('fontWeight') == 'bold' or element.get('textType') == 'heading':
                    run.font.bold = True
                if element.get('defaultFontName'):
                    run.font.name = element['defaultFontName']

        # 设置对齐方式
        if element.get('textAlign') == 'center':
            text_frame.paragraphs[0].alignment = 1  # CENTER
        elif element.get('textAlign') == 'right':
            text_frame.paragraphs[0].alignment = 2  # RIGHT

    def _convert_pptist_image_to_pptx(self, element: Dict[str, Any], slide, prs):
        """将PPTist图片元素转换为PPTX形状"""
        left, top, width, height = self._element_box_emu(element, prs)

        src = element.get('src', '')
        if src:
            # 支持URL或本地路径
            if src.startswith('http'):
                # 下载图片
                try:
                    from ...utils.http_client import get_sync_client
                    response = get_sync_client().get(src)
                    response.raise_for_status()
                    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as f:
                        f.write(response.content)
                        temp_path = f.name
                    slide.shapes.add_picture(temp_path, left, top, width=width, height=height)
                    Path(temp_path).unlink(missing_ok=True)
                except Exception as e:
                    logger.warning(f"Failed to download image: {e}")
            else:
                # 本地文件
                slide.shapes.add_picture(src, left, top, width=width, height=height)

    def _convert_pptist_shape_to_pptx(self, element: Dict[str, Any], slide, prs):
        """将PPTist形状元素转换为PPTX形状"""
        left, top, width, height = self._element_box_emu(element, prs)

        shape_info = element.get('shape', {})
        shape_type = shape_info.get('type', 'rect')
        fill_color = shape_info.get('fill', '#ffffff')
        stroke_color = shape_info.get('stroke', '#000000')
        stroke_width = shape_info.get('strokeWidth', 0)

        # 创建形状
        if shape_type == 'rect':
            shape = slide.shapes.add_shape(
                1, left, top, width, height  # msoShapeRectangle
            )
        elif shape_type == 'ellipse':
            shape = slide.shapes.add_shape(
                9, left, top, width, height  # msoShapeOval
            )
        else:
            shape = slide.shapes.add_shape(
                1, left, top, width, height  # 默认矩形
            )

        # 设置填充颜色
        if fill_color and fill_color != 'none':
            shape.fill.solid()
            shape.fill.fore_color.rgb = self._hex_to_rgb(fill_color)
        else:
            shape.fill.background()

        # 设置边框
        if stroke_width > 0:
            shape.line.color.rgb = self._hex_to_rgb(stroke_color)
            shape.line.width = self._pt_to_font_size(stroke_width)
        else:
            shape.line.fill.background()

        # 设置圆角
        if element.get('borderRadius'):
            try:
                r_emu = int(round(prs.slide_width * float(element['borderRadius']) / self.canvas_width))
                shape.round_corners(r_emu)
            except Exception:
                pass

    def _convert_pptist_chart_to_pptx(self, element: Dict[str, Any], slide, prs):
        """将PPTist图表元素转换为PPTX图表（扁平 chartType 或旧嵌套 chart）"""
        left, top, width, height = self._element_box_emu(element, prs)

        from pptx.chart.data import ChartData
        from pptx.enum.chart import XL_CHART_TYPE

        chart_data_obj = ChartData()
        chart_type_key = 'bar'

        if element.get('chartType'):
            chart_type_key = str(element.get('chartType') or 'bar').lower()
            data = element.get('data') or {}
            labels = data.get('labels') or []
            legends = data.get('legends') or []
            series_rows = data.get('series') or []
            if labels:
                chart_data_obj.categories = labels
            for i, legend in enumerate(legends):
                vals = series_rows[i] if i < len(series_rows) else []
                chart_data_obj.add_series(legend, vals)
        else:
            chart_info = element.get('chart', {})
            chart_type_key = str(chart_info.get('type', 'bar')).lower()
            chart_data = chart_info.get('data', {})
            labels = chart_data.get('labels', [])
            datasets = chart_data.get('datasets', [])
            if labels:
                chart_data_obj.categories = labels
            for dataset in datasets:
                label = dataset.get('label', '')
                data = dataset.get('data', [])
                if data:
                    chart_data_obj.add_series(label, data)

        chart_types = {
            'bar': XL_CHART_TYPE.COLUMN_CLUSTERED,
            'column': XL_CHART_TYPE.COLUMN_CLUSTERED,
            'line': XL_CHART_TYPE.LINE,
            'pie': XL_CHART_TYPE.PIE,
            'doughnut': XL_CHART_TYPE.DOUGHNUT,
            'ring': XL_CHART_TYPE.DOUGHNUT,
            'barhorizontal': XL_CHART_TYPE.BAR_CLUSTERED,
            'area': XL_CHART_TYPE.AREA,
            'scatter': XL_CHART_TYPE.XY_SCATTER,
            'radar': XL_CHART_TYPE.RADAR,
        }

        xl_chart_type = chart_types.get(chart_type_key, XL_CHART_TYPE.COLUMN_CLUSTERED)
        slide.shapes.add_chart(xl_chart_type, left, top, width, height, chart_data_obj)

    def _hex_to_rgb(self, hex_color: str):
        """将十六进制颜色转换为RGB"""
        from pptx.dml.color import RGBColor
        
        hex_color = hex_color.lstrip('#')
        if len(hex_color) == 6:
            return RGBColor(
                int(hex_color[0:2], 16),
                int(hex_color[2:4], 16),
                int(hex_color[4:6], 16)
            )
        return RGBColor(0, 0, 0)

    def _pt_to_font_size(self, pt: float):
        """将点转换为字体大小对象"""
        from pptx.util import Pt
        return Pt(pt)

    def _convert_pptist_slide_to_pptx(self, pptist_slide: Dict[str, Any], prs):
        """将单个PPTist幻灯片转换为PPTX幻灯片"""
        # 获取背景信息
        background = pptist_slide.get('background', {})
        bg_type = background.get('type', 'solid')
        bg_color = background.get('color', '#ffffff')

        # 创建空白幻灯片
        blank_layout = prs.slide_layouts[6]
        slide = prs.slides.add_slide(blank_layout)

        # 设置背景
        if bg_type == 'solid' and bg_color:
            slide.background.fill.solid()
            slide.background.fill.fore_color.rgb = self._hex_to_rgb(bg_color)
        elif bg_type == 'image':
            nested = background.get('image') or {}
            src = nested.get('src') or background.get('src') or ''
            if src:
                try:
                    from ...utils.http_client import build_timeout, get_sync_client

                    if src.startswith('http'):
                        response = get_sync_client().get(src, timeout=build_timeout(30.0))
                        response.raise_for_status()
                        sfx = '.png' if 'png' in response.headers.get('content-type', '') else '.jpg'
                        with tempfile.NamedTemporaryFile(suffix=sfx, delete=False) as f:
                            f.write(response.content)
                            temp_path = f.name
                    else:
                        temp_path = src
                    slide.shapes.add_picture(
                        temp_path, 0, 0, width=prs.slide_width, height=prs.slide_height
                    )
                    if src.startswith('http'):
                        Path(temp_path).unlink(missing_ok=True)
                except Exception as e:
                    logger.warning(f"Slide background image export failed: {e}")
                    slide.background.fill.solid()
                    slide.background.fill.fore_color.rgb = self._hex_to_rgb('#ffffff')

        # 转换每个元素
        elements = pptist_slide.get('elements', [])
        for element in elements:
            element_type = element.get('type', '')
            
            try:
                if element_type == 'text':
                    self._convert_pptist_text_to_pptx(element, slide, prs)
                elif element_type == 'image':
                    self._convert_pptist_image_to_pptx(element, slide, prs)
                elif element_type == 'shape':
                    self._convert_pptist_shape_to_pptx(element, slide, prs)
                elif element_type == 'chart':
                    self._convert_pptist_chart_to_pptx(element, slide, prs)
            except Exception as e:
                logger.error(f"Failed to convert element {element_type}: {e}")

        return slide

    def export_pptist_to_pptx(self, pptist_slides: List[Dict[str, Any]]) -> bytes:
        """
        从PPTist格式数据直接导出PPTX
        
        Args:
            pptist_slides: PPTist格式的幻灯片数据列表
            
        Returns:
            PPTX文件的字节数据
        """
        # 创建PPTX演示文稿
        prs = Presentation()
        prs.slide_width = Inches(16 * 0.8)  # 16:9比例
        prs.slide_height = Inches(9 * 0.8)

        # 转换每个幻灯片
        for pptist_slide in pptist_slides:
            self._convert_pptist_slide_to_pptx(pptist_slide, prs)

        # 保存到字节流
        output = BytesIO()
        prs.save(output)
        output.seek(0)

        return output.read()

    def export_project_slides_to_pptx(self, slides_data: List[Dict[str, Any]]) -> bytes:
        """
        从项目幻灯片数据导出PPTX
        
        支持两种格式：
        1. 完整PPTist格式（包含elements字段）
        2. 旧格式（包含html_content字段）
        
        Args:
            slides_data: 项目幻灯片数据列表
            
        Returns:
            PPTX文件的字节数据
        """
        # 检查是否为PPTist格式（每页均有非空 elements）
        has_elements = bool(slides_data) and all(
            isinstance(slide, dict) and isinstance(slide.get('elements'), list) and len(slide.get('elements') or []) > 0
            for slide in slides_data
        )

        if has_elements:
            # 直接使用PPTist格式导出
            return self.export_pptist_to_pptx(slides_data)
        else:
            # 回退到HTML渲染方式
            logger.info("Slides data doesn't have elements, falling back to HTML-based export")
            return self._export_via_html_rendering(slides_data)

    def _export_via_html_rendering(self, slides_data: List[Dict[str, Any]]) -> bytes:
        """Former HTML screenshot PPTX path (Playwright removed)."""
        _ = slides_data
        raise RuntimeError(
            "HTML screenshot export requires Playwright (removed). "
            "Populate slide elements or use the editor client export."
        )

    def export_slides_data_as_json(self, slides_data: List[Dict[str, Any]]) -> str:
        """
        将幻灯片数据导出为标准JSON格式
        
        Args:
            slides_data: 项目幻灯片数据列表
            
        Returns:
            JSON字符串
        """
        # 确保数据是PPTist兼容格式
        pptist_slides = []
        for slide in slides_data:
            if isinstance(slide, dict):
                pptist_slide = {
                    'id': slide.get('id') or slide.get('slide_id', ''),
                    'elements': slide.get('elements', []),
                    'notes': slide.get('notes', []),
                    'remark': slide.get('remark', ''),
                    'background': slide.get('background', {'type': 'solid', 'color': '#ffffff'}),
                    'outline': slide.get('outline', []),
                    'slidelayout': slide.get('slidelayout', '')
                }
                pptist_slides.append(pptist_slide)
        
        return json.dumps(pptist_slides, ensure_ascii=False, indent=2)