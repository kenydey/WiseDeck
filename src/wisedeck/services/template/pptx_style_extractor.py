"""
PPTX 样式提取器 - 从 PPT/PPTX 文件提取颜色、字体、占位符坐标
用于 WiseDeck 模板导入功能

核心功能：
1. 提取主题色（主色、背景色、Accent 1-6）
2. 提取标题/正文字体
3. 提取占位符坐标并规格化为 0.0~1.0 比例
4. 输出完整的 WiseDeck 模板配置 JSON
"""

from __future__ import annotations

import logging
from io import BytesIO
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE_TYPE, PP_PLACEHOLDER_TYPE
from pptx.oxml.ns import qn
from pptx.util import Emu, Pt

logger = logging.getLogger(__name__)

EMU_PER_INCH = 914400
EMU_PER_PT = 12700
DEFAULT_SLIDE_WIDTH_EMU = 9144000
DEFAULT_SLIDE_HEIGHT_EMU = 6858000

DEFAULT_COLORS = {
    "primary": "#4472C4",
    "background": "#FFFFFF",
    "accent1": "#4472C4",
    "accent2": "#ED7D31",
    "accent3": "#A5A5A5",
    "accent4": "#FFC000",
    "accent5": "#5B9BD5",
    "accent6": "#70AD47",
}

DEFAULT_FONTS = {
    "title": "Arial",
    "body": "Calibri",
}

PLACEHOLDER_TYPE_MAP = {
    PP_PLACEHOLDER_TYPE.TITLE: "PAGE_TITLE",
    PP_PLACEHOLDER_TYPE.CENTER_TITLE: "PAGE_TITLE",
    PP_PLACEHOLDER_TYPE.VERTICAL_TITLE: "PAGE_TITLE",
    PP_PLACEHOLDER_TYPE.SUBTITLE: "SUBTITLE",
    PP_PLACEHOLDER_TYPE.BODY: "CONTENT_AREA",
    PP_PLACEHOLDER_TYPE.OBJECT: "CONTENT_AREA",
    PP_PLACEHOLDER_TYPE.PICTURE: "CONTENT_AREA",
    PP_PLACEHOLDER_TYPE.CHART: "CHART_AREA",
    PP_PLACEHOLDER_TYPE.TABLE: "TABLE_AREA",
    PP_PLACEHOLDER_TYPE.ORG_CHART: "CHART_AREA",
}


def _rgb_to_hex(rgb: Optional[RGBColor]) -> str:
    if rgb is None:
        return "#000000"
    return f"#{rgb.red:02X}{rgb.green:02X}{rgb.blue:02X}"


def _safe_get_color(color_obj: Any, default: str = "#000000") -> str:
    try:
        if color_obj is None:
            return default
        if hasattr(color_obj, "rgb") and color_obj.rgb:
            return _rgb_to_hex(color_obj.rgb)
        if hasattr(color_obj, "theme_color"):
            return default
        return default
    except (AttributeError, TypeError, ValueError):
        return default


def _safe_get_font_name(shape: Any, default: str = "Arial") -> str:
    try:
        if not hasattr(shape, "text_frame"):
            return default
        tf = shape.text_frame
        if tf is None:
            return default
        for para in tf.paragraphs:
            for run in para.runs:
                if run.font and run.font.name:
                    return run.font.name
            if para.font and para.font.name:
                return para.font.name
        return default
    except (AttributeError, TypeError):
        return default


def _get_placeholder_type(shape: Any) -> Optional[str]:
    try:
        # 先检查是否为占位符，非占位符形状访问 placeholder_format 会失败
        if not getattr(shape, "is_placeholder", False):
            return None
        ph_format = shape.placeholder_format
        if ph_format is None:
            return None
        ph_type = ph_format.type
        return PLACEHOLDER_TYPE_MAP.get(ph_type)
    except (AttributeError, KeyError):
        return None


def _normalize_bbox(
    left: int, top: int, width: int, height: int,
    slide_width: int, slide_height: int
) -> Tuple[List[float], Dict[str, int]]:
    if slide_width <= 0 or slide_height <= 0:
        return [0.0, 0.0, 0.0, 0.0], {"x": 0, "y": 0, "w": 0, "h": 0}
    
    x_ratio = round(left / slide_width, 4)
    y_ratio = round(top / slide_height, 4)
    w_ratio = round(width / slide_width, 4)
    h_ratio = round(height / slide_height, 4)
    
    x_ratio = max(0.0, min(1.0, x_ratio))
    y_ratio = max(0.0, min(1.0, y_ratio))
    w_ratio = max(0.0, min(1.0 - x_ratio, w_ratio))
    h_ratio = max(0.0, min(1.0 - y_ratio, h_ratio))
    
    px_x = int(left / EMU_PER_PT)
    px_y = int(top / EMU_PER_PT)
    px_w = int(width / EMU_PER_PT)
    px_h = int(height / EMU_PER_PT)
    
    return [x_ratio, y_ratio, w_ratio, h_ratio], {"x": px_x, "y": px_y, "w": px_w, "h": px_h}


class PPTXStyleExtractor:
    """PPT/PPTX 样式提取器 - 提取颜色、字体、占位符坐标"""
    
    def __init__(self, pptx_source: Union[str, Path, bytes]):
        self._prs: Optional[Presentation] = None
        self._slide_width_emu: int = DEFAULT_SLIDE_WIDTH_EMU
        self._slide_height_emu: int = DEFAULT_SLIDE_HEIGHT_EMU
        self._source_info: str = ""
        
        try:
            if isinstance(pptx_source, (str, Path)):
                self._prs = Presentation(str(pptx_source))
                self._source_info = str(pptx_source)
            elif isinstance(pptx_source, bytes):
                self._prs = Presentation(BytesIO(pptx_source))
                self._source_info = "<bytes>"
            else:
                raise ValueError(f"不支持的输入类型: {type(pptx_source)}")
            
            if self._prs:
                self._slide_width_emu = self._prs.slide_width or DEFAULT_SLIDE_WIDTH_EMU
                self._slide_height_emu = self._prs.slide_height or DEFAULT_SLIDE_HEIGHT_EMU
        except Exception as e:
            logger.error(f"初始化 PPTXStyleExtractor 失败: {e}")
            raise
    
    @property
    def slide_width_emu(self) -> int:
        return self._slide_width_emu
    
    @property
    def slide_height_emu(self) -> int:
        return self._slide_height_emu
    
    @property
    def slide_width_pt(self) -> int:
        return int(self._slide_width_emu / EMU_PER_PT)
    
    @property
    def slide_height_pt(self) -> int:
        return int(self._slide_height_emu / EMU_PER_PT)
    
    def extract_theme_colors(self) -> Dict[str, str]:
        """提取主题色（主色、背景色、Accent 1-6）"""
        colors = dict(DEFAULT_COLORS)
        
        if not self._prs:
            return colors
        
        try:
            for slide_master in self._prs.slide_masters:
                try:
                    theme = slide_master.part.slide_master.theme
                    if theme is None:
                        continue
                    
                    try:
                        color_scheme = theme.color_scheme
                        if color_scheme:
                            colors["primary"] = _safe_get_color(
                                getattr(color_scheme, "accent1", None), colors["primary"]
                            )
                            colors["background"] = _safe_get_color(
                                getattr(color_scheme, "background1", None), colors["background"]
                            )
                            for i in range(1, 7):
                                accent_name = f"accent{i}"
                                if hasattr(color_scheme, accent_name):
                                    colors[accent_name] = _safe_get_color(
                                        getattr(color_scheme, accent_name), colors.get(accent_name, "#000000")
                                    )
                    except (AttributeError, TypeError) as e:
                        logger.debug(f"提取 color_scheme 失败: {e}")
                    
                    break
                except (AttributeError, TypeError) as e:
                    logger.debug(f"处理 slide_master 失败: {e}")
                    continue
        except Exception as e:
            logger.warning(f"提取主题色时发生错误: {e}")
        
        return colors
    
    def extract_fonts(self) -> Dict[str, str]:
        """提取标题/正文字体"""
        fonts = dict(DEFAULT_FONTS)
        
        if not self._prs:
            return fonts
        
        try:
            for slide_master in self._prs.slide_masters:
                try:
                    for shape in slide_master.shapes:
                        ph_type = _get_placeholder_type(shape)
                        if ph_type == "PAGE_TITLE":
                            font_name = _safe_get_font_name(shape)
                            if font_name != "Arial":
                                fonts["title"] = font_name
                        elif ph_type == "CONTENT_AREA":
                            font_name = _safe_get_font_name(shape)
                            if font_name != "Calibri":
                                fonts["body"] = font_name
                    
                    if fonts["title"] != "Arial" and fonts["body"] != "Calibri":
                        break
                except (AttributeError, TypeError) as e:
                    logger.debug(f"处理 slide_master shapes 失败: {e}")
                    continue
        except Exception as e:
            logger.warning(f"提取字体时发生错误: {e}")
        
        return fonts
    
    def extract_background_style(self) -> Dict[str, Any]:
        """提取背景样式（纯色/渐变）"""
        bg = {"type": "solid", "value": "#FFFFFF"}
        
        if not self._prs:
            return bg
        
        try:
            for slide in list(self._prs.slides)[:1]:
                try:
                    bg_fill = slide.background.fill
                    fill_type = getattr(bg_fill, "type", None)
                    
                    if fill_type is None:
                        continue
                    
                    fill_type_str = str(fill_type)
                    
                    if "SOLID" in fill_type_str:
                        try:
                            fore_color = bg_fill.fore_color
                            if fore_color:
                                color_rgb = getattr(fore_color, "rgb", None)
                                if color_rgb:
                                    bg["value"] = _rgb_to_hex(color_rgb)
                                else:
                                    theme_color = getattr(fore_color, "theme_color", None)
                                    if theme_color is not None:
                                        colors = self.extract_theme_colors()
                                        bg["value"] = colors.get("background", "#FFFFFF")
                        except Exception:
                            pass
                    elif "GRADIENT" in fill_type_str:
                        try:
                            gradient_format = bg_fill
                            angle = getattr(gradient_format, "angle", 0) or 0
                            stops = getattr(gradient_format, "gradient_stops", [])
                            
                            if len(stops) >= 2:
                                color1 = "#FFFFFF"
                                color2 = "#4472C4"
                                
                                try:
                                    stop1_color = getattr(stops[0], "color", None)
                                    if stop1_color and hasattr(stop1_color, "rgb"):
                                        color1 = _rgb_to_hex(stop1_color.rgb)
                                except Exception:
                                    pass
                                
                                try:
                                    stop2_color = getattr(stops[-1], "color", None)
                                    if stop2_color and hasattr(stop2_color, "rgb"):
                                        color2 = _rgb_to_hex(stop2_color.rgb)
                                except Exception:
                                    pass
                                
                                bg["type"] = "gradient"
                                bg["value"] = f"linear-gradient({angle}deg, {color1} 0%, {color2} 100%)"
                        except Exception:
                            pass
                except (AttributeError, TypeError) as e:
                    logger.debug(f"提取背景样式失败: {e}")
                    continue
        except Exception as e:
            logger.warning(f"提取背景时发生错误: {e}")
        
        return bg
    
    def extract_font_styles(self) -> Dict[str, Any]:
        """提取字体样式（大小、粗细）"""
        styles = {
            "title": {"font_size": 44, "font_weight": "bold"},
            "body": {"font_size": 18, "font_weight": "normal"},
        }
        
        if not self._prs:
            return styles
        
        try:
            for slide_master in self._prs.slide_masters:
                try:
                    for shape in slide_master.shapes:
                        ph_type = _get_placeholder_type(shape)
                        
                        if ph_type == "PAGE_TITLE":
                            try:
                                tf = shape.text_frame
                                if tf and tf.paragraphs:
                                    font = tf.paragraphs[0].font
                                    if font:
                                        if font.size:
                                            styles["title"]["font_size"] = int(font.size.pt)
                                        if font.bold:
                                            styles["title"]["font_weight"] = "bold"
                                        elif font.bold is False:
                                            styles["title"]["font_weight"] = "normal"
                            except (AttributeError, TypeError):
                                pass
                        elif ph_type == "CONTENT_AREA":
                            try:
                                tf = shape.text_frame
                                if tf and tf.paragraphs:
                                    font = tf.paragraphs[0].font
                                    if font:
                                        if font.size:
                                            styles["body"]["font_size"] = int(font.size.pt)
                                        if font.bold:
                                            styles["body"]["font_weight"] = "bold"
                                        elif font.bold is False:
                                            styles["body"]["font_weight"] = "normal"
                            except (AttributeError, TypeError):
                                pass
                    
                    break
                except (AttributeError, TypeError) as e:
                    logger.debug(f"提取字体样式失败: {e}")
                    continue
        except Exception as e:
            logger.warning(f"提取字体样式时发生错误: {e}")
        
        return styles
    
    def extract_responsive_config(self) -> Dict[str, Any]:
        """提取响应式配置"""
        font_styles = self.extract_font_styles()
        title_size = font_styles.get("title", {}).get("font_size", 44)
        
        return {
            "min_font_size": 14,
            "preferred_font_size": "4vw",
            "max_font_size": max(title_size * 1.5, 48),
        }
    
    def extract_layout_placeholders(self) -> List[Dict[str, Any]]:
        """提取所有版式的占位符坐标（规格化为 0.0~1.0）"""
        layouts: List[Dict[str, Any]] = []
        
        if not self._prs:
            return layouts
        
        try:
            for layout_idx, slide_layout in enumerate(self._prs.slide_layouts):
                layout_info: Dict[str, Any] = {
                    "layout_index": layout_idx,
                    "layout_name": slide_layout.name or f"Layout_{layout_idx}",
                    "placeholders": [],
                }
                
                try:
                    for shape in slide_layout.shapes:
                        ph_type = _get_placeholder_type(shape)
                        if ph_type is None:
                            continue
                        
                        try:
                            left = int(shape.left or 0)
                            top = int(shape.top or 0)
                            width = int(shape.width or 0)
                            height = int(shape.height or 0)
                        except (TypeError, ValueError):
                            continue
                        
                        if width <= 0 or height <= 0:
                            continue
                        
                        bbox_ratio, bbox_px = _normalize_bbox(
                            left, top, width, height,
                            self._slide_width_emu, self._slide_height_emu
                        )
                        
                        placeholder_info = {
                            "type": ph_type,
                            "bbox_ratio": bbox_ratio,
                            "bbox_px": bbox_px,
                        }
                        
                        layout_info["placeholders"].append(placeholder_info)
                
                except (AttributeError, TypeError) as e:
                    logger.debug(f"处理 slide_layout {layout_idx} 失败: {e}")
                    continue
                
                layouts.append(layout_info)
        
        except Exception as e:
            logger.warning(f"提取布局占位符时发生错误: {e}")
        
        return layouts
    
    def extract_complete_template_config(self) -> Dict[str, Any]:
        """输出完整的 WiseDeck 模板配置"""
        theme_colors = self.extract_theme_colors()
        fonts = self.extract_fonts()
        layouts = self.extract_layout_placeholders()
        background = self.extract_background_style()
        font_styles = self.extract_font_styles()
        responsive_config = self.extract_responsive_config()
        
        placeholder_markers = set()
        for layout in layouts:
            for ph in layout.get("placeholders", []):
                ph_type = ph.get("type")
                if ph_type:
                    placeholder_markers.add(ph_type)
        
        config = {
            "schema_version": 1,
            "source": "pptx_style_extractor",
            "slide_dimensions": {
                "width_emu": self._slide_width_emu,
                "height_emu": self._slide_height_emu,
                "width_pt": self.slide_width_pt,
                "height_pt": self.slide_height_pt,
            },
            "theme_colors": theme_colors,
            "fonts": fonts,
            "background": background,
            "font_styles": font_styles,
            "responsive_config": responsive_config,
            "layouts": layouts,
            "template_contract": {
                "placeholder_markers": sorted(list(placeholder_markers)),
                "layout_count": len(layouts),
            },
        }
        
        return config
    
    def get_summary(self) -> Dict[str, Any]:
        """获取提取结果的摘要信息"""
        config = self.extract_complete_template_config()
        return {
            "source": self._source_info,
            "slide_dimensions": config["slide_dimensions"],
            "theme_colors": config["theme_colors"],
            "fonts": config["fonts"],
            "layout_count": len(config["layouts"]),
            "placeholder_markers": config["template_contract"]["placeholder_markers"],
        }


def extract_pptx_template_config(pptx_source: Union[str, Path, bytes]) -> Dict[str, Any]:
    """
    便捷函数：从 PPTX 文件提取模板配置
    
    Args:
        pptx_source: PPTX 文件路径或字节数据
    
    Returns:
        完整的模板配置字典
    """
    extractor = PPTXStyleExtractor(pptx_source)
    return extractor.extract_complete_template_config()
