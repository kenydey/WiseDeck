# WiseDeck 完整编辑功能升级规格说明书

## 一、背景与目标

### 1.1 问题描述

当前 WiseDeck 的幻灯片编辑器功能有限，仅支持：
- HTML 内容编辑（通过代码模式）
- 基础样式修改
- 有限的元素操作

用户需要一个功能完整的编辑器来精细调整 AI 生成的 PPT。

### 1.2 升级目标

借鉴 PPTist 的软件实现逻辑，采用现有的 HTML/CSS 格式，实现完整的 PPT 编辑功能：

| 功能 | 当前状态 | 目标状态 |
|------|---------|---------|
| 元素选择 | 基础 | 支持多选、组合 |
| 元素移动 | 基础 | 支持拖拽、对齐 |
| 元素缩放 | 基础 | 支持四角缩放、旋转 |
| 形状插入 | 无 | 完整形状库 |
| 文本编辑 | 基础 | 富文本编辑器 |
| 图像处理 | 有限 | 裁剪、滤镜、蒙版 |
| 图表 | chart_config | 交互式图表 |
| 动画 | 无 | 入场、退场、强调 |

---

## 二、架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           浏览器客户端                                  │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    FullEditor (完整编辑器)                       │ │
│  │  ┌─────────────┐ ┌─────────────────────────┐ ┌───────────────┐  │ │
│  │  │ 工具栏面板   │ │      Canvas 编辑画布      │ │  属性面板    │  │ │
│  │  │ - 插入工具   │ │  - 元素渲染与交互          │ │ - 样式设置  │  │ │
│  │  │ - 形状库     │ │  - 拖拽/缩放/旋转          │ │ - 位置设置  │  │ │
│  │  │ - 文本工具   │ │  - 对齐线                  │ │ - 动画设置  │  │ │
│  │  │ - 图像工具   │ │  - 网格线                  │ │ - 元素属性  │  │ │
│  │  │ - 图表工具   │ └─────────────────────────┘ └───────────────┘  │ │
│  │  └─────────────┘                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐    │ │
│  │  │                    缩略图面板                              │    │ │
│  │  └─────────────────────────────────────────────────────────┘    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           REST API                                      │
│  GET/POST/PUT/DELETE /api/projects/{id}/full-editor/slides            │
│  POST /api/projects/{id}/full-editor/export                           │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Python 后端                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ EditorService   │  │ ElementParser   │  │ ExportService   │         │
│  │ - 元素CRUD      │  │ - HTML解析      │  │ - PPTX导出     │         │
│  │ - 状态管理      │  │ - DOM操作       │  │ - PDF导出      │         │
│  │ - 撤销/重做     │  │ - 样式提取      │  │ - HTML导出     │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 数据结构设计

**编辑器元素模型** (Python):

```python
class EditorElement:
    id: str
    type: ElementType  # TEXT, SHAPE, IMAGE, CHART, TABLE, LINE
    left: int          # 距离画布左边距离 (px)
    top: int           # 距离画布顶部距离 (px)
    width: int
    height: int
    rotate: float      # 旋转角度
    z_index: int       # 层叠顺序
    lock: bool
    group_id: Optional[str]

class TextElement(EditorElement):
    content: str       # HTML 富文本
    font_family: str
    font_size: int
    font_weight: str
    color: str
    text_align: str
    line_height: float
    vertical: bool

class ShapeElement(EditorElement):
    shape_type: ShapeType  # RECT, ROUNDED, CIRCLE, TRIANGLE, etc.
    fill: str
    stroke: str
    stroke_width: int
    opacity: float
    gradient: Optional[Gradient]
    shadow: Optional[Shadow]

class ImageElement(EditorElement):
    src: str
    crop: Optional[CropData]
    filters: Optional[ImageFilters]
    flip_h: bool
    flip_v: bool

class ChartElement(EditorElement):
    chart_type: ChartType  # BAR, LINE, PIE, AREA, etc.
    data: ChartData
    theme_colors: List[str]

class TableElement(EditorElement):
    rows: int
    cols: int
    data: List[List[TableCell]]
    style: TableStyle
```

**幻灯片模型**:

```python
class EditorSlide:
    id: str
    elements: List[EditorElement]
    background: Background
    width: int = 1280   # 画布宽度
    height: int = 720   # 画布高度
    animations: List[Animation] = []

class Background:
    type: Literal["solid", "gradient", "image"]
    color: Optional[str]
    gradient: Optional[Gradient]
    image: Optional[ImageData]
```

### 2.3 HTML/CSS 格式设计

**生成的幻灯片 HTML 结构**:

```html
<div class="slide-container" data-slide-id="slide-1">
    <div class="slide-background" style="background: #ffffff;">
        <div class="slide-element element-shape"
             data-element-id="el-1"
             data-element-type="shape"
             style="left: 100px; top: 50px; width: 200px; height: 150px; z-index: 1;">
            <div class="element-content shape-content" data-shape-type="roundedRect">
                <!-- SVG 或 CSS 形状 -->
            </div>
        </div>

        <div class="slide-element element-text"
             data-element-id="el-2"
             data-element-type="text"
             style="left: 150px; top: 100px; width: 400px; z-index: 2;">
            <div class="element-content text-content" contenteditable="true">
                <p style="font-family: 'Microsoft YaHei'; font-size: 24px; color: #333;">
                    标题文本
                </p>
            </div>
        </div>

        <div class="slide-element element-image"
             data-element-id="el-3"
             data-element-type="image"
             style="left: 600px; top: 80px; width: 300px; height: 200px; z-index: 3;">
            <div class="element-content image-content">
                <img src="..." alt="" />
            </div>
        </div>
    </div>

    <!-- 页码 -->
    <div class="slide-page-number">1 / 10</div>
</div>
```

---

## 三、功能模块设计

### 3.1 画布模块 (Canvas)

**功能**:
- 元素渲染
- 鼠标选择（单选/框选）
- 拖拽移动
- 缩放/旋转
- 对齐线
- 网格线

**实现**:

```python
class CanvasManager:
    def __init__(self, container: HTMLElement, slide: EditorSlide):
        self.container = container
        self.slide = slide
        self.selected_elements: List[str] = []
        self.drag_state: Optional[DragState] = None

    def render(self):
        """渲染所有元素"""

    def handle_mouse_down(self, event: MouseEvent):
        """处理鼠标按下"""

    def handle_mouse_move(self, event: MouseEvent):
        """处理鼠标移动"""

    def handle_mouse_up(self, event: MouseEvent):
        """处理鼠标释放"""

    def select_element(self, element_id: str, additive: bool = False):
        """选择元素"""

    def update_element_position(self, element_id: str, left: int, top: int):
        """更新元素位置"""

    def resize_element(self, element_id: str, width: int, height: int):
        """缩放元素"""

    def rotate_element(self, element_id: str, angle: float):
        """旋转元素"""
```

### 3.2 工具栏模块 (Toolbar)

**功能**:
- 插入形状（矩形、圆形、三角形、箭头等）
- 插入文本框
- 插入图片
- 插入图表
- 插入表格
- 插入图表
- 撤销/重做

**形状库** (基于 CSS/SVG):

```javascript
const SHAPE_PRESETS = {
    // 基础形状
    'rect': { css: 'width: 100px; height: 100px; background: #3498db;' },
    'rounded-rect': { css: 'width: 100px; height: 100px; border-radius: 10px; background: #3498db;' },
    'circle': { css: 'width: 100px; height: 100px; border-radius: 50%; background: #e74c3c;' },
    'ellipse': { css: 'width: 120px; height: 80px; border-radius: 50%; background: #2ecc71;' },

    // 箭头
    'arrow-right': { svg: '<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' },
    'arrow-up': { svg: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' },

    // 特殊形状
    'callout': { css: '...' },
    'badge': { css: '...' },
    'speech-bubble': { css: '...' },

    // 装饰
    'divider': { css: 'height: 2px; background: linear-gradient(...);' },
    'separator': { css: '...' },
};
```

### 3.3 属性面板模块 (PropertyPanel)

**功能**:
- 位置与尺寸 (X, Y, W, H, 旋转)
- 填充设置 (颜色、渐变、图片)
- 边框设置 (颜色、宽度、样式)
- 阴影设置
- 不透明度
- 动画设置

### 3.4 文本编辑器模块 (RichTextEditor)

**功能**:
- 基于 `contenteditable` 实现
- 字体选择 (Google Fonts)
- 字号、行高、字间距
- 粗体、斜体、下划线
- 文字颜色、背景色
- 对齐方式 (左/中/右/两端)
- 项目符号列表

**实现**:

```python
class RichTextEditor:
    def __init__(self, element: HTMLElement):
        self.element = element
        self.setup_contenteditable()

    def exec_command(self, command: str, value: str = None):
        """执行富文本命令"""
        document.execCommand(command, False, value)

    def get_format_state(self) -> Dict:
        """获取当前格式状态"""

    def insert_html(self, html: str):
        """插入 HTML"""

    def get_html(self) -> str:
        """获取 HTML 内容"""
```

### 3.5 图像处理模块 (ImageProcessor)

**功能**:
- 图片上传与裁剪
- 滤镜效果 (模糊、亮度、对比度、饱和度)
- 颜色蒙版
- 翻转

### 3.6 图表模块 (ChartEditor)

**功能**:
- 基于 ECharts
- 柱状图、折线图、饼图、雷达图
- 数据编辑
- 主题色同步

---

## 四、后端服务设计

### 4.1 编辑器服务

```python
class FullEditorService:
    """完整编辑器服务"""

    async def get_project_slides(self, project_id: str) -> List[EditorSlide]:
        """获取项目的所有幻灯片"""

    async def get_slide(self, project_id: str, slide_id: str) -> EditorSlide:
        """获取单个幻灯片"""

    async def create_slide(self, project_id: str, slide: EditorSlide) -> EditorSlide:
        """创建幻灯片"""

    async def update_slide(self, project_id: str, slide: EditorSlide) -> EditorSlide:
        """更新幻灯片"""

    async def delete_slide(self, project_id: str, slide_id: str) -> None:
        """删除幻灯片"""

    async def update_element(
        self, project_id: str, slide_id: str, element: EditorElement
    ) -> EditorElement:
        """更新元素"""

    async def add_element(
        self, project_id: str, slide_id: str, element: EditorElement
    ) -> EditorElement:
        """添加元素"""

    async def delete_element(
        self, project_id: str, slide_id: str, element_id: str
    ) -> None:
        """删除元素"""

    async def duplicate_elements(
        self, project_id: str, slide_id: str, element_ids: List[str]
    ) -> List[EditorElement]:
        """复制元素"""
```

### 4.2 HTML 解析服务

```python
class HtmlToEditorConverter:
    """HTML 转编辑器数据"""

    def parse_slide(self, html: str, slide_id: str) -> EditorSlide:
        """解析 HTML 为 EditorSlide"""
        # 1. 提取背景
        # 2. 解析每个 .slide-element
        # 3. 转换为 EditorElement

    def parse_element(self, element_html: HTMLElement) -> EditorElement:
        """解析单个元素"""

class EditorToHtmlConverter:
    """编辑器数据转 HTML"""

    def generate_slide_html(self, slide: EditorSlide) -> str:
        """生成幻灯片 HTML"""
        # 1. 生成背景 HTML
        # 2. 生成每个元素 HTML
        # 3. 组合完整 HTML

    def generate_element_html(self, element: EditorElement) -> str:
        """生成元素 HTML"""
```

### 4.3 导出服务

```python
class EditorExportService:
    """编辑器导出服务"""

    async def export_pptx(
        self, project_id: str, options: ExportOptions
    ) -> bytes:
        """导出为 PPTX"""

    async def export_pdf(
        self, project_id: str, options: ExportOptions
    ) -> bytes:
        """导出为 PDF"""

    def export_html_bundle(
        self, project_id: str, options: ExportOptions
    ) -> str:
        """导出为 HTML 包"""
```

---

## 五、API 设计

### 5.1 端点列表

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/projects/{id}/full-editor` | 获取编辑器初始数据 |
| GET | `/api/projects/{id}/full-editor/slides` | 获取所有幻灯片 |
| GET | `/api/projects/{id}/full-editor/slides/{slide_id}` | 获取单个幻灯片 |
| POST | `/api/projects/{id}/full-editor/slides` | 创建幻灯片 |
| PUT | `/api/projects/{id}/full-editor/slides/{slide_id}` | 更新幻灯片 |
| DELETE | `/api/projects/{id}/full-editor/slides/{slide_id}` | 删除幻灯片 |
| POST | `/api/projects/{id}/full-editor/slides/{slide_id}/elements` | 添加元素 |
| PUT | `/api/projects/{id}/full-editor/slides/{slide_id}/elements/{element_id}` | 更新元素 |
| DELETE | `/api/projects/{id}/full-editor/slides/{slide_id}/elements/{element_id}` | 删除元素 |
| POST | `/api/projects/{id}/full-editor/export/pptx` | 导出 PPTX |
| POST | `/api/projects/{id}/full-editor/export/pdf` | 导出 PDF |

### 5.2 请求/响应示例

**GET /api/projects/{id}/full-editor**

```json
{
  "project_id": "proj-xxx",
  "slides": [
    {
      "id": "slide-1",
      "width": 1280,
      "height": 720,
      "background": {
        "type": "solid",
        "color": "#ffffff"
      },
      "elements": [
        {
          "id": "el-1",
          "type": "text",
          "left": 100,
          "top": 50,
          "width": 400,
          "height": 60,
          "rotate": 0,
          "z_index": 1,
          "content": "<p>标题</p>",
          "font_family": "Microsoft YaHei",
          "font_size": 32,
          "font_weight": "bold",
          "color": "#333333",
          "text_align": "center"
        }
      ],
      "animations": []
    }
  ],
  "theme": {
    "backgroundColor": "#ffffff",
    "primaryColor": "#3498db",
    "fontFamily": "Microsoft YaHei"
  }
}
```

---

## 六、实施计划

### 6.1 阶段划分

**阶段一：基础框架 (2周)**
- 搭建编辑器页面结构
- 实现 Canvas 渲染基础
- 元素选择与移动
- 基础样式编辑

**阶段二：形状与文本 (2周)**
- 形状库实现
- 形状插入与编辑
- 富文本编辑器
- 文本格式编辑

**阶段三：图像与图表 (2周)**
- 图像上传与处理
- 图像裁剪、滤镜
- 图表组件集成
- 数据编辑

**阶段四：高级功能 (2周)**
- 撤销/重做
- 复制/粘贴
- 组合/拆分
- 动画系统

**阶段五：导出与集成 (1周)**
- PPTX 导出
- PDF 导出
- 与现有系统集成
- 测试与优化

### 6.2 任务清单

```
阶段一：基础框架
├── 1.1 创建编辑器页面结构
├── 1.2 实现 CanvasManager 类
├── 1.3 实现元素渲染
├── 1.4 实现元素选择（单选/框选）
├── 1.5 实现拖拽移动
├── 1.6 实现缩放和旋转
└── 1.7 实现对齐线和网格

阶段二：形状与文本
├── 2.1 实现形状库
├── 2.2 实现形状插入
├── 2.3 实现形状属性编辑
├── 2.4 实现富文本编辑器
└── 2.5 实现文本格式编辑

阶段三：图像与图表
├── 3.1 实现图像上传
├── 3.2 实现图像裁剪
├── 3.3 实现图像滤镜
├── 3.4 集成 ECharts
└── 3.5 实现图表数据编辑

阶段四：高级功能
├── 4.1 实现撤销/重做
├── 4.2 实现复制/粘贴
├── 4.3 实现组合/拆分
└── 4.4 实现动画系统

阶段五：导出与集成
├── 5.1 实现 HTML 解析
├── 5.2 实现 PPTX 导出
├── 5.3 实现 PDF 导出
└── 5.4 集成测试
```

---

## 七、技术选型

### 7.1 前端

| 功能 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3 | 与现有系统一致 |
| 状态管理 | Pinia | 管理编辑器状态 |
| 样式 | CSS + SCSS | 组件样式 |
| 图表 | ECharts | 交互式图表 |
| 拖拽 | 原生实现 | 自定义交互 |

### 7.2 后端

| 功能 | 技术 | 说明 |
|------|------|------|
| 框架 | FastAPI | 与现有系统一致 |
| HTML 解析 | BeautifulSoup4 | 解析幻灯片 HTML |
| PPTX 导出 | python-pptx | 生成 PPTX |
| PDF 导出 | Pyppeteer/WeasyPrint | HTML 转 PDF |

---

## 八、文件结构

```
src/wisedeck/
├── web/
│   ├── templates/
│   │   └── pages/project/
│   │       └── project_full_editor.html      # 新增：完整编辑器页面
│   └── static/js/pages/project/
│       └── full_editor/                      # 新增：编辑器 JS
│           ├── main.js                        # 入口
│           ├── components/                    # 组件
│           │   ├── Canvas.vue
│           │   ├── Toolbar.vue
│           │   ├── PropertyPanel.vue
│           │   ├── ThumbnailPanel.vue
│           │   └── elements/
│           │       ├── BaseElement.vue
│           │       ├── TextElement.vue
│           │       ├── ShapeElement.vue
│           │       ├── ImageElement.vue
│           │       └── ChartElement.vue
│           ├── managers/                      # 管理器
│           │   ├── CanvasManager.js
│           │   ├── SelectionManager.js
│           │   ├── HistoryManager.js          # 撤销/重做
│           │   └── ElementFactory.js
│           └── utils/
│               ├── dom.js
│               ├── math.js
│               └── format.js
└── services/editor/                          # 新增：编辑器服务
    ├── __init__.py
    ├── full_editor_service.py
    ├── html_parser.py
    ├── html_generator.py
    └── export_service.py
```

---

## 九、验收标准

### 9.1 功能验收

- [ ] 可以打开完整编辑器页面
- [ ] 可以选择、移动、缩放、旋转元素
- [ ] 可以插入形状（至少 10 种）
- [ ] 可以编辑文本（富文本）
- [ ] 可以插入图片
- [ ] 可以插入图表
- [ ] 可以修改元素样式
- [ ] 可以添加/删除/重排幻灯片
- [ ] 可以撤销/重做
- [ ] 可以导出 PPTX/PDF

### 9.2 性能验收

- [ ] 页面加载时间 < 2 秒
- [ ] 元素移动无卡顿
- [ ] 支持 50+ 元素的幻灯片

### 9.3 兼容性验收

- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

---

## 十、总结

### 10.1 方案优势

1. **完全自研**：不依赖 PPTist 代码，避免许可证问题
2. **格式兼容**：使用现有 HTML/CSS 格式，无需数据转换
3. **技术栈统一**：使用 Vue 3 + Python，与现有系统一致
4. **可扩展性**：模块化设计，便于后续功能扩展

### 10.2 风险与应对

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 开发周期长 | 6+ 周 | 分阶段交付，优先核心功能 |
| 性能问题 | 编辑卡顿 | 虚拟化渲染，懒加载 |
| 导出兼容 | 样式丢失 | 完善样式映射 |

### 10.3 预期收益

- 用户获得专业级 PPT 编辑体验
- 填补当前编辑器的功能空白
- 为未来功能扩展奠定基础
