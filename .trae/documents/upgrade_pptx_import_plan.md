# 升级计划：PPTX 导入生成完整模板信息

## 概述

**目标**：将 PPTX 轻量级导入升级为生成完整的 WiseDeck 模板信息，包括完整的 HTML 模板（含 Mustache 占位符）、CSS 样式、预览图等。

**核心决策**：
- ✅ 后端完整生成 HTML 模板
- ✅ 提取完整样式信息（颜色、字体、响应式设置）
- ✅ 标准占位符映射（Mustache 语法）
- ✅ 统一模板结构
- ✅ 生成预览图

---

## 当前状态分析

### 现有系统架构

```
PPTX 文件
    ↓
PPTXStyleExtractor (提取颜色、字体、占位符坐标)
    ↓
LayoutAutoSplitter (自动切分布局)
    ↓
前端生成简单预览 HTML
    ↓
GlobalMasterTemplate (缺少完整信息)
```

### 当前输出结构

```json
{
  "schema_version": 1,
  "source": "pptx_style_extractor",
  "slide_dimensions": { ... },
  "theme_colors": { ... },
  "fonts": { ... },
  "layouts": [ ... ],
  "template_contract": { ... }
}
```

### 目标输出结构

```json
{
  "template_name": "导入的模板",
  "description": "详细描述",
  "html_template": "<!DOCTYPE html>...{{ main_heading }}...{{ page_content }}...</html>",
  "tags": ["导入", "PPTX"],
  "is_default": false,
  "style_config": {
    "colors": { ... },
    "fonts": { ... },
    "dimensions": { "width": 1280, "height": 720 },
    "background": { "type": "gradient", "value": "..." },
    "responsive": { ... }
  },
  "preview_image": "base64..."
}
```

---

## 提议的变更

### 变更 1：增强 PPTXStyleExtractor

**文件**: `src/wisedeck/services/template/pptx_style_extractor.py`

**新增功能**:
1. 提取背景样式（纯色/渐变）
2. 提取字体大小（标题/正文）
3. 提取字体粗细
4. 提取响应式配置
5. 生成完整 HTML 模板

**新增方法**:
```python
def extract_background_style(self) -> Dict[str, Any]:
    """提取背景样式（纯色/渐变）"""

def extract_font_styles(self) -> Dict[str, Any]:
    """提取字体样式（大小、粗细）"""

def extract_responsive_config(self) -> Dict[str, Any]:
    """提取响应式配置"""

def generate_html_template(self) -> str:
    """生成完整的 HTML 模板（含 Mustache 占位符）"""
```

### 变更 2：创建 HTML 模板生成器

**文件**: `src/wisedeck/services/template/html_template_generator.py` (新建)

**核心功能**:
1. 根据提取的样式信息生成 CSS
2. 根据占位符坐标生成布局结构
3. 生成完整的 HTML 模板（Mustache 语法）
4. 生成预览图（Base64）

**模板结构**:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ page_title }}</title>
    <style>
        body {
            width: 1280px;
            height: 720px;
            font-family: 'Microsoft YaHei', 'PingFang SC', ...;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        }
        .slide-title {
            font-size: clamp(2rem, 4vw, 3.5rem);
            font-weight: bold;
        }
        .content-area {
            position: absolute;
            left: {{ content_left }}%;
            top: {{ content_top }}%;
            width: {{ content_width }}%;
            height: {{ content_height }}%;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <h1 class="slide-title">{{ main_heading }}</h1>
        <div class="content-area">{{{ page_content }}}</div>
        <div class="page-number">{{ current_page_number }} / {{ total_page_count }}</div>
    </div>
</body>
</html>
```

### 变更 3：创建预览图生成器

**文件**: `src/wisedeck/services/template/preview_generator.py` (新建)

**核心功能**:
1. 接收 HTML 模板和模板配置
2. 使用 Playwright 渲染 HTML
3. 生成 Base64 预览图

**实现方式**:
```python
async def generate_preview_image(
    html_template: str,
    style_config: Dict[str, Any]
) -> str:
    """生成预览图（Base64）"""
```

### 变更 4：更新 API 端点

**文件**: `src/wisedeck/api/global_master_template_api.py`

**修改内容**:
1. 更新 `/import/lightweight-pptx` 端点
2. 返回完整的模板信息（含 HTML 模板和预览图）

---

## 详细实现

### 任务 1：增强 PPTXStyleExtractor

**文件**: `src/wisedeck/services/template/pptx_style_extractor.py`

**新增方法**:

```python
def extract_background_style(self) -> Dict[str, Any]:
    """提取背景样式"""
    bg = {"type": "solid", "value": "#FFFFFF"}
    
    # 从母版/幻灯片提取背景
    for slide in self._prs.slides[:1]:
        try:
            bg_fill = slide.background.fill
            if bg_fill.type == SOLID:  # 纯色
                color = bg_fill.fore_color.rgb
                bg = {"type": "solid", "value": _rgb_to_hex(color)}
            elif bg_fill.type == GRADIENT:  # 渐变
                # 提取渐变信息
                stops = bg_fill.gradient_stops
                bg = {
                    "type": "gradient",
                    "value": f"linear-gradient(135deg, {color1} 0%, {color2} 100%)"
                }
        except Exception:
            pass
    
    return bg

def extract_font_styles(self) -> Dict[str, Any]:
    """提取字体样式"""
    styles = {
        "title": {"font_size": 44, "font_weight": "bold"},
        "body": {"font_size": 18, "font_weight": "normal"}
    }
    
    # 从母版占位符提取
    for shape in self._prs.slide_masters[0].shapes:
        if _get_placeholder_type(shape) == "PAGE_TITLE":
            try:
                font = shape.text_frame.paragraphs[0].font
                if font.size:
                    styles["title"]["font_size"] = int(font.size.pt)
                if font.bold:
                    styles["title"]["font_weight"] = "bold"
            except Exception:
                pass
    
    return styles

def extract_responsive_config(self) -> Dict[str, Any]:
    """提取响应式配置"""
    return {
        "min_font_size": 14,
        "preferred_font_size": "4vw",
        "max_font_size": 48
    }
```

### 任务 2：创建 HTML 模板生成器

**文件**: `src/wisedeck/services/template/html_template_generator.py`

```python
class HtmlTemplateGenerator:
    """HTML 模板生成器"""
    
    def __init__(
        self,
        style_config: Dict[str, Any],
        layouts: List[Dict[str, Any]],
        theme_colors: Dict[str, str],
        fonts: Dict[str, str]
    ):
        self.style_config = style_config
        self.layouts = layouts
        self.theme_colors = theme_colors
        self.fonts = fonts
    
    def generate_template(self) -> str:
        """生成完整的 HTML 模板"""
        css = self._generate_css()
        html = self._generate_html_structure()
        return f"<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>...{css}...</head>\n<body>...{html}...</body>\n</html>"
    
    def _generate_css(self) -> str:
        """生成 CSS 样式"""
        bg = self.style_config.get("background", {})
        bg_value = bg.get("value", "#FFFFFF")
        bg_type = bg.get("type", "solid")
        
        if bg_type == "gradient":
            bg_css = f"background: {bg_value};"
        else:
            bg_css = f"background-color: {bg_value};"
        
        return f"""
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        html, body {{
            width: 100%;
            height: 100%;
            overflow: hidden;
        }}
        body {{
            width: 1280px;
            height: 720px;
            font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
            {bg_css}
        }}
        .slide-container {{
            position: relative;
            width: 100%;
            height: 100%;
        }}
        .slide-title {{
            position: absolute;
            left: {self._get_placeholder_position('PAGE_TITLE')};
            top: ...;
            width: ...;
            font-size: clamp({self.style_config.get('min_font_size', 14)}px, {self.style_config.get('preferred_font_size', '4vw')}, {self.style_config.get('max_font_size', 48)}px);
            font-weight: {self.style_config.get('title_font_weight', 'bold')};
            color: {self.theme_colors.get('primary', '#4472C4')};
        }}
        .content-area {{
            position: absolute;
            {self._get_placeholder_position('CONTENT_AREA')};
            font-size: {self.style_config.get('body_font_size', 18)}px;
            color: #333333;
        }}
        .page-number {{
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 14px;
            color: #666666;
        }}
    </style>"""
    
    def _generate_html_structure(self) -> str:
        """生成 HTML 结构"""
        return """
    <div class="slide-container">
        <h1 class="slide-title">{{ main_heading }}</h1>
        <div class="content-area">{{{ page_content }}}</div>
        <div class="page-number">{{ current_page_number }} / {{ total_page_count }}</div>
    </div>"""
    
    def _get_placeholder_position(self, ph_type: str) -> str:
        """获取占位符位置"""
        for layout in self.layouts:
            for ph in layout.get("placeholders", []):
                if ph.get("type") == ph_type:
                    bbox = ph.get("bbox_ratio", [])
                    if len(bbox) == 4:
                        return f"left: {bbox[0]*100:.1f}%; top: {bbox[1]*100:.1f}%; width: {bbox[2]*100:.1f}%; height: {bbox[3]*100:.1f}%;"
        return ""
```

### 任务 3：创建预览图生成器

**文件**: `src/wisedeck/services/template/preview_generator.py`

```python
async def generate_preview_image(
    html_template: str,
    template_config: Dict[str, Any]
) -> Optional[str]:
    """生成预览图（Base64）"""
    try:
        from playwright.async_api import async_playwright
        
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page(viewport={"width": 1280, "height": 720})
            
            # 渲染 HTML
            await page.set_content(html_template)
            
            # 截图
            screenshot = await page.screenshot(full_page=False)
            await browser.close()
            
            # 转为 Base64
            import base64
            return base64.b64encode(screenshot).decode("utf-8")
    except Exception as e:
        logger.warning(f"预览图生成失败: {e}")
        return None
```

### 任务 4：更新 API 端点

**文件**: `src/wisedeck/api/global_master_template_api.py`

```python
@router.post("/import/lightweight-pptx")
async def import_pptx_lightweight(request: TemplateImportUploadRequest):
    """轻量级 PPTX 导入 - 生成完整模板信息"""
    importer = _template_import_service()
    
    # 提取配置
    template_config = importer.import_pptx_lightweight(
        filename=request.filename,
        data=request.data,
    )
    
    # 生成 HTML 模板
    from wisedeck.services.template.html_template_generator import HtmlTemplateGenerator
    
    generator = HtmlTemplateGenerator(
        style_config=template_config.get("style_config", {}),
        layouts=template_config.get("layouts", []),
        theme_colors=template_config.get("theme_colors", {}),
        fonts=template_config.get("fonts", {})
    )
    
    template_config["html_template"] = generator.generate_template()
    
    # 生成预览图（可选，异步）
    try:
        preview_image = await generate_preview_image(
            template_config["html_template"],
            template_config
        )
        if preview_image:
            template_config["preview_image"] = preview_image
    except Exception as e:
        logger.warning(f"预览图生成失败: {e}")
    
    return template_config
```

---

## 占位符映射

| PPTX 占位符类型 | Mustache 变量 | 说明 |
|----------------|---------------|------|
| PAGE_TITLE | `{{ main_heading }}` | 主标题 |
| SUBTITLE | `{{ subtitle }}` | 副标题 |
| CONTENT_AREA | `{{{ page_content }}}` | 正文内容（HTML，不转义） |
| CONTENT_AREA_LEFT | `{{{ page_content_left }}}` | 左栏内容 |
| CONTENT_AREA_RIGHT | `{{{ page_content_right }}}` | 右栏内容 |
| - | `{{ current_page_number }}` | 当前页码 |
| - | `{{ total_page_count }}` | 总页数 |
| - | `{{ page_title }}` | 页面标题 |

---

## 依赖关系

| 依赖 | 说明 |
|------|------|
| python-pptx | 已安装 |
| Playwright | 用于预览图生成 |
| Pillow | 可选，图片处理 |

---

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| Playwright 未安装 | 预览图生成失败 | 使用 HTML 模板作为降级方案 |
| PPTX 格式不规范 | 样式提取失败 | 使用默认样式兜底 |
| 预览图生成耗时 | API 响应慢 | 使用异步生成或可选 |

---

## 实施步骤

### 阶段 1：增强 PPTXStyleExtractor

1. 添加 `extract_background_style()` 方法
2. 添加 `extract_font_styles()` 方法
3. 添加 `extract_responsive_config()` 方法
4. 更新 `extract_complete_template_config()` 返回完整 style_config

### 阶段 2：创建 HTML 模板生成器

1. 创建 `html_template_generator.py`
2. 实现 `HtmlTemplateGenerator` 类
3. 实现 CSS 生成逻辑
4. 实现 HTML 结构生成逻辑

### 阶段 3：创建预览图生成器

1. 创建 `preview_generator.py`
2. 实现 Playwright 截图功能
3. 添加 Base64 编码功能

### 阶段 4：更新 API

1. 更新 `/import/lightweight-pptx` 端点
2. 集成 HTML 模板生成
3. 集成预览图生成

### 阶段 5：测试验证

1. 测试 PPTX 导入
2. 验证 HTML 模板格式
3. 验证预览图显示

---

## 文件变更清单

### 新建文件

| 文件路径 | 说明 |
|---------|------|
| `src/wisedeck/services/template/html_template_generator.py` | HTML 模板生成器 |
| `src/wisedeck/services/template/preview_generator.py` | 预览图生成器 |

### 修改文件

| 文件路径 | 修改内容 |
|---------|---------|
| `src/wisedeck/services/template/pptx_style_extractor.py` | 增强样式提取功能 |
| `src/wisedeck/api/global_master_template_api.py` | 更新 API 端点 |

---

*计划生成时间：2026-05-07*
