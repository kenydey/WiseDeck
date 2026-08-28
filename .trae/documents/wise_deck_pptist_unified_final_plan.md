# WiseDeck完整编辑器数据格式统一方案（终极版）

## 一、问题分析

### 1.1 当前架构问题

从截图对比可以看出：
- **PPT编辑器**：精美布局、正确的标题样式、装饰线、背景色
- **完整编辑器**：内容显示但布局和样式不完全匹配，图片显示为占位符

### 1.2 根本原因

```
┌─────────────────────────────────────────────────────────────────────┐
│                     当前数据流                                      │
│                                                                     │
│  AI大纲 → 模板渲染(HTML) → PPTist JSON → 存储slides_data           │
│                                     ↓                              │
│                          ┌───────────────┐                         │
│                          │ html_content   │ ← PPT编辑器使用         │
│                          │ elements       │ ← 完整编辑器使用       │
│                          │ background     │                        │
│                          └───────────────┘                         │
│                                     ↓                              │
│  问题：PPTist JSON生成时使用的是简化逻辑，没有完全利用模板渲染的样式  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 用户核心需求

| 需求 | 说明 |
|------|------|
| 格式统一 | 直接生成PPTist兼容的JSON |
| 质量保证 | 图文并茂、布局合理、支持图表 |
| 导出统一 | PPT编辑器和完整编辑器使用同一导出功能 |

---

## 二、解决方案架构

### 2.1 目标架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         统一数据架构                                │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 后端生成层                                                   │   │
│  │                                                             │   │
│  │  AI大纲 → 模板渲染 → PPTist JSON生成 → 存储                  │   │
│  │        ↓              ↓                                     │   │
│  │   精美HTML       完整elements(样式+布局+图表)                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 存储层 - slides_data                                        │   │
│  │                                                             │   │
│  │ {                                                           │   │
│  │   "page_number": 1,                                         │   │
│  │   "title": "标题",                                          │   │
│  │   "html_content": "...",   ← PPT编辑器预览                   │   │
│  │   "elements": [...],       ← PPTist完整元素(高质量)          │   │
│  │   "background": {...},     ← 背景信息                        │   │
│  │   "charts": [...]          ← 图表数据                        │   │
│  │ }                                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 前端展示层                                                   │   │
│  │                                                             │   │
│  │  PPT编辑器 → 使用 html_content（精美预览）                   │   │
│  │  完整编辑器 → 使用 elements（完整编辑）                       │   │
│  │                                                             │   │
│  │  两者数据完全同步，质量一致                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 关键改进点

| 改进项 | 当前状态 | 改进后 |
|--------|---------|--------|
| PPTist JSON生成 | 简化逻辑 | 使用模板渲染结果增强 |
| 样式信息 | 基本样式 | 完整样式（字体、颜色、对齐等） |
| 图表数据 | 缺少 | 完整图表配置 |
| 背景信息 | 纯色 | 支持渐变、图片背景 |
| 布局信息 | 简单布局 | 精确定位和尺寸 |

---

## 三、核心修改方案

### 3.1 增强 PPTistGenerationService

**文件**: `src/wisedeck/services/slide/pptist_generation_service.py`

```python
def generate_pptist_slide(
    self,
    slide: Dict[str, Any],
    page_number: int,
    total_slides: int,
    html_content: Optional[str] = None
) -> Dict[str, Any]:
    """生成高质量PPTist格式幻灯片"""
    
    slide_id = self.generate_slide_id()
    elements = []
    current_y = self.margin
    
    # 1. 使用模板渲染的HTML解析样式
    parsed_styles = self._parse_html_styles(html_content)
    
    # 2. 创建标题元素（使用解析的样式）
    title_element = self.create_title_element(
        slide.get('title', ''),
        parsed_styles.get('title_font_size', 32),
        parsed_styles.get('title_color', '#333333'),
        parsed_styles.get('title_align', 'center')
    )
    elements.append(title_element)
    current_y += title_element['height'] + 20
    
    # 3. 添加装饰线（如果模板中有）
    if parsed_styles.get('has_divider'):
        divider_element = self.create_divider_element(
            parsed_styles.get('divider_color', '#d4a574'),
            parsed_styles.get('divider_width', 600)
        )
        divider_element['top'] = current_y
        elements.append(divider_element)
        current_y += 20
    
    # 4. 创建内容元素（解析HTML内容）
    content_elements = self._parse_html_content(html_content)
    for element in content_elements:
        element['top'] = current_y
        elements.append(element)
        current_y += element['height'] + 15
    
    # 5. 创建图表元素（如果有）
    if slide.get('charts'):
        for chart in slide['charts']:
            chart_element = self.create_chart_element(chart)
            chart_element['top'] = current_y
            elements.append(chart_element)
            current_y += chart_element['height'] + 20
    
    # 6. 获取背景信息
    background = self._get_background_from_template(slide, parsed_styles)
    
    return {
        'id': slide_id,
        'elements': elements,
        'notes': [],
        'remark': '',
        'background': background,
        'outline': [],
        'slidelayout': ''
    }

def _parse_html_styles(self, html_content: Optional[str]) -> Dict[str, Any]:
    """从HTML中解析样式信息"""
    styles = {}
    
    if not html_content:
        return styles
    
    # 使用BeautifulSoup解析HTML
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 解析标题样式
    title_tag = soup.find(['h1', 'h2', 'h3', '.title'])
    if title_tag:
        style = title_tag.get('style', '')
        if 'font-size' in style:
            styles['title_font_size'] = int(style.split('font-size:')[1].split('px')[0].strip())
        if 'color' in style:
            styles['title_color'] = style.split('color:')[1].split(';')[0].strip()
        styles['title_align'] = title_tag.get('align', 'center')
    
    # 检测装饰线
    if soup.find(['hr', '.divider', '.decoration-line']):
        styles['has_divider'] = True
        divider = soup.find(['hr', '.divider'])
        if divider:
            styles['divider_color'] = divider.get('color', '#d4a574')
            styles['divider_width'] = int(divider.get('width', 600))
    
    # 解析背景色
    body_tag = soup.find('body')
    if body_tag and body_tag.get('style'):
        style = body_tag['style']
        if 'background' in style:
            bg_match = re.search(r'background:\s*([^;]+)', style)
            if bg_match:
                styles['background'] = bg_match.group(1)
    
    return styles

def _parse_html_content(self, html_content: Optional[str]) -> List[Dict[str, Any]]:
    """从HTML中解析内容元素"""
    elements = []
    
    if not html_content:
        return elements
    
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 解析段落
    for p in soup.find_all('p'):
        text = p.get_text(strip=True)
        if text:
            style = p.get('style', '')
            font_size = 16
            color = '#333333'
            align = 'left'
            
            if 'font-size' in style:
                font_size = int(style.split('font-size:')[1].split('px')[0].strip())
            if 'color' in style:
                color = style.split('color:')[1].split(';')[0].strip()
            if 'text-align' in style:
                align = style.split('text-align:')[1].split(';')[0].strip()
            
            elements.append(self.create_text_element(
                text,
                self.margin,
                0,  # 高度由调用者设置
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
                    self.margin + 40,  # 缩进
                    0,
                    self.content_width - 40,
                    40,
                    16,
                    'normal',
                    'left',
                    '#666666'
                ))
    
    # 解析图片
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src:
            elements.append(self.create_image_element(
                src,
                self.margin,
                0,
                self.content_width,
                200
            ))
    
    return elements

def create_chart_element(self, chart_data: Dict[str, Any]) -> Dict[str, Any]:
    """创建图表元素"""
    return {
        'id': self.generate_element_id(),
        'type': 'chart',
        'left': self.margin,
        'top': 0,
        'width': self.content_width,
        'height': 300,
        'rotate': 0,
        'chart': {
            'type': chart_data.get('type', 'bar'),
            'data': chart_data.get('data', {}),
            'options': chart_data.get('options', {})
        }
    }

def _get_background_from_template(self, slide: Dict[str, Any], parsed_styles: Dict[str, Any]) -> Dict[str, Any]:
    """获取背景信息"""
    # 优先使用解析的样式
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
```

### 3.2 修改 slide_generation_service.py

**文件**: `src/wisedeck/services/slide/slide_generation_service.py`

确保在生成slides_data时包含完整的图表数据：

```python
# 在生成slide_data时，添加图表信息
slide_data = {
    "page_number": idx + 1,
    "title": slide.get('title', f'第{idx+1}页'),
    "html_content": html_content,
    "is_user_edited": False,
    "elements": pptist_slide['elements'],
    "background": pptist_slide['background'],
    "charts": slide.get('charts', [])  # 保留图表数据
}
```

### 3.3 修改前端数据传递

**文件**: `src/PPTist/src/App.vue`

确保正确处理图表和样式：

```typescript
function handleExternalSlides(event: MessageEvent) {
    if (!event.data || event.data.type !== 'SYNC_SLIDES_TO_PPTIST') {
        return
    }
    
    if (event.data.slides && Array.isArray(event.data.slides)) {
        const format = detectSlideFormat(event.data.slides)
        
        if (format === 'pptist') {
            const pptistSlides = event.data.slides.map((slide: any, index: number) => {
                return {
                    id: slide.id || slide.page_number?.toString() || nanoid(10),
                    elements: slide.elements || [],
                    notes: slide.notes || [],
                    remark: slide.remark || '',
                    background: slide.background || { type: 'solid', color: '#f5f2eb' },
                    animations: slide.animations || [],
                    turningMode: slide.turningMode,
                    sectionTag: slide.sectionTag,
                    type: slide.type
                }
            })
            
            slidesStore.setSlides(pptistSlides)
        } else {
            const convertedSlides = convertWiseDeckSlidesToPPTist(event.data.slides)
            slidesStore.setSlides(convertedSlides)
        }
    }
}
```

---

## 四、图表支持

### 4.1 图表数据结构

```python
# slides_data中的图表数据
{
    "charts": [
        {
            "type": "bar",  # bar, line, pie, scatter, radar, funnel, gauge
            "data": {
                "labels": ["一月", "二月", "三月"],
                "datasets": [
                    {
                        "label": "销售额",
                        "data": [1200, 1900, 3000]
                    }
                ]
            },
            "options": {
                "title": {"display": True, "text": "月度销售趋势"},
                "scales": {...}
            }
        }
    ]
}
```

### 4.2 后端图表生成

在 `slide_generation_service.py` 中确保图表数据被传递到PPTist生成：

```python
# 当AI生成包含图表的内容时
if 'chart_data' in slide:
    chart_element = pptist_generator.create_chart_element(slide['chart_data'])
    pptist_slide['elements'].append(chart_element)
```

---

## 五、统一导出功能

### 5.1 导出架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         统一导出架构                                │
│                                                                     │
│  ┌──────────────────┐       ┌──────────────────┐                   │
│  │  PPT编辑器       │       │  完整编辑器      │                   │
│  │                  │       │                  │                   │
│  │  点击导出        │       │  点击导出        │                   │
│  └────────┬─────────┘       └────────┬─────────┘                   │
│           │                          │                              │
│           └────────────┬─────────────┘                              │
│                        ↓                                           │
│              ┌──────────────────────┐                              │
│              │    统一导出API        │                              │
│              │  /api/projects/export│                              │
│              └────────────┬─────────┘                              │
│                           ↓                                        │
│              ┌──────────────────────┐                              │
│              │  后端导出服务         │                              │
│              │  export_job_service  │                              │
│              │  使用PPTist格式       │                              │
│              └──────────────────────┘                              │
│                           ↓                                        │
│              ┌──────────────────────┐                              │
│              │   生成PPTX/PDF/HTML  │                              │
│              └──────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 导出API修改

**文件**: `src/wisedeck/web/route_modules/export_routes.py`

```python
@router.post("/api/projects/{project_id}/export")
async def export_project(
    project_id: str,
    export_request: ExportRequest,
    user: User = Depends(get_current_user_required),
):
    """统一导出API"""
    project = await _get_owned_project_or_404(project_id, user)
    
    # 使用PPTist格式数据导出
    if project.slides_data:
        # 确保所有slides都有完整的elements
        slides_data = project.slides_data
        for slide in slides_data:
            if not slide.get('elements'):
                # 使用html_content生成elements
                from ..services.slide.pptist_generation_service import PPTistGenerationService
                pptist_generator = PPTistGenerationService()
                pptist_slide = pptist_generator.generate_pptist_slide(
                    slide,
                    slide.get('page_number', 1),
                    len(slides_data),
                    slide.get('html_content', '')
                )
                slide['elements'] = pptist_slide['elements']
    
    # 调用导出服务
    export_job = await export_service.create_export_job(
        project_id=project_id,
        export_format=export_request.format,
        slides_data=slides_data
    )
    
    return {"job_id": export_job.id}
```

---

## 六、实施步骤

### 阶段一：增强PPTist生成服务（2天）

1. 修改 `pptist_generation_service.py`
   - 添加 `_parse_html_styles` 方法
   - 添加 `_parse_html_content` 方法
   - 添加 `create_chart_element` 方法
   - 修改 `generate_pptist_slide` 使用新方法

2. 修改 `slide_generation_service.py`
   - 确保图表数据传递到slides_data
   - 确保背景信息完整

### 阶段二：前端优化（1天）

3. 修改 `App.vue`
   - 优化元素处理逻辑
   - 确保图表元素正确显示

### 阶段三：统一导出（1天）

4. 修改 `export_routes.py`
   - 使用PPTist格式数据
   - 统一导出流程

### 阶段四：测试验证（1天）

5. 测试新生成的幻灯片
   - 验证布局和样式
   - 验证图表显示
   - 验证导出功能

---

## 七、质量保证

### 7.1 测试用例

| 测试项 | 预期结果 |
|--------|---------|
| 标题样式 | 字体大小、颜色、对齐正确 |
| 装饰线 | 正确显示在标题下方 |
| 背景色 | 与PPT编辑器一致 |
| 列表 | 正确缩进和圆点样式 |
| 图片 | 正确显示，尺寸合适 |
| 图表 | 柱状图、折线图、饼图正确渲染 |
| 导出PPTX | 与编辑器显示一致 |

### 7.2 向后兼容

- 旧格式数据自动转换为新格式
- 保留html_content用于PPT编辑器预览
- 新生成的数据包含完整elements

---

## 八、总结

### 核心改进

1. **数据格式统一**：后端直接生成完整的PPTist JSON
2. **质量保证**：解析模板样式，保持高质量渲染
3. **图表支持**：完整的图表数据结构和渲染
4. **导出统一**：使用同一导出服务

### 预期效果

| 指标 | 当前 | 改进后 |
|------|------|--------|
| 布局一致性 | 部分一致 | 完全一致 |
| 样式一致性 | 部分一致 | 完全一致 |
| 图表支持 | 有限 | 完整支持 |
| 导出质量 | 依赖模板 | 依赖PPTist |

### 工作量

- **开发**：4-5天
- **测试**：1天
- **总计**：约1周

这个方案将实现PPT编辑器和完整编辑器的数据格式统一，保证高质量渲染，并支持图表等复杂元素。
