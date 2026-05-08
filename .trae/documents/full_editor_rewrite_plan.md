
# 完整编辑器重写计划

## 一、需求分析

### 1.1 用户核心需求
根据用户的最新需求，需要对完整编辑器进行彻底重写：

| 需求点 | 描述 | 优先级 |
| :--- | :--- | :--- |
| 页面预览 | 保留与PPT编辑器一致的页面预览效果 | 高 |
| 快编功能复刻 | 将快编所有功能集成到完整编辑页面 | 高 |
| 导出功能 | 采用PPT编辑器相同的导出功能 | 高 |
| 放映功能 | 预览改为放映，调用PPT编辑器的放映功能 | 高 |
| 保存功能 | 直接调用PPT编辑器的保存功能 | 高 |
| 右侧功能重写 | 参考PPTist重写右侧所有功能的前端和后端代码 | 高 |
| 删除旧代码 | 删除之前的完整编辑代码 | 高 |

### 1.2 当前问题分析
- 现有的完整编辑器代码功能不完整
- 右侧功能按钮无响应
- 元素选择和编辑功能存在问题
- 与PPT编辑器的预览效果不一致

## 二、参考架构分析（PPTist）

### 2.1 PPTist架构概览

```
PPTist-master/
├── src/
│   ├── components/          # 通用组件（颜色选择器、弹窗、按钮等）
│   ├── configs/            # 配置文件（动画、图表、元素、形状等）
│   ├── hooks/              # 业务逻辑hooks
│   │   ├── useCreateElement.ts     # 创建元素
│   │   ├── useDeleteElement.ts     # 删除元素
│   │   ├── useSelectElement.ts     # 选择元素
│   │   ├── useMoveElement.ts       # 移动元素
│   │   ├── useCopyAndPasteElement.ts # 复制粘贴
│   │   ├── useExport.ts            # 导出功能
│   │   ├── useScreening.ts         # 放映功能
│   │   └── ...
│   ├── store/              # Pinia状态管理
│   │   ├── main.ts         # 主状态（选中元素、工具栏状态等）
│   │   └── slides.ts       # 幻灯片数据状态
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   └── views/              # 视图组件
│       └── Editor/         # 编辑器主组件
│           ├── Canvas/     # 画布组件
│           ├── Toolbar/    # 右侧工具栏
│           ├── Thumbnails/ # 左侧缩略图
│           └── ...
```

### 2.2 核心状态管理

**slides.ts** - 幻灯片数据管理：
- `slides`: 幻灯片数组
- `slideIndex`: 当前页面索引
- `theme`: 主题样式
- 方法：addSlide、deleteSlide、addElement、updateElement、deleteElement

**main.ts** - 编辑器状态管理：
- `activeElementIdList`: 选中元素ID列表
- `toolbarState`: 工具栏状态
- `canvasScale`: 画布缩放比例
- `creatingElement`: 正在创建的元素

### 2.3 核心功能Hooks

| Hook | 功能描述 |
| :--- | :--- |
| `useCreateElement` | 创建文本、形状、图表、表格等元素 |
| `useDeleteElement` | 删除元素 |
| `useSelectElement` | 选择元素 |
| `useMoveElement` | 移动元素 |
| `useCopyAndPasteElement` | 复制粘贴元素 |
| `useExport` | 导出PPTX/PDF/图片 |
| `useScreening` | 幻灯片放映 |
| `useHistorySnapshot` | 撤销/重做 |

## 三、实施计划

### 3.1 整体架构设计

```
完整编辑器页面架构
┌─────────────────────────────────────────────────────────────┐
│  Header (工具栏)                                            │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐   │
│  │撤销 │重做 │导出 │放映 │保存 │上一页│下一页│缩放 │返回 │   │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘   │
├─────────────────────────────────────────────────────────────┤
│  Main Content                                               │
│  ┌──────────────┬──────────────────────┬─────────────────┐  │
│  │ 左侧缩略图   │      中间画布区域      │   右侧工具栏    │  │
│  │ (Thumbnails) │     (Canvas)         │   (Toolbar)     │  │
│  │              │                      │                 │  │
│  │ 幻灯片列表   │   PPT预览 + 编辑层    │  属性面板       │  │
│  │              │                      │  - 样式          │  │
│  │              │                      │  - 位置          │  │
│  │              │                      │  - 动画          │  │
│  └──────────────┴──────────────────────┴─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 实施步骤

#### 阶段一：清理旧代码（1天）

| 任务 | 描述 | 文件路径 |
| :--- | :--- | :--- |
| 删除旧JS代码 | 删除现有的完整编辑器JS代码 | `src/wisedeck/web/static/js/pages/project/full_editor/` |
| 删除旧CSS代码 | 删除现有的完整编辑器CSS | `src/wisedeck/web/static/css/pages/project/full_editor.css` |
| 删除旧HTML模板 | 删除现有的完整编辑器模板 | `src/wisedeck/web/templates/pages/project/project_full_editor.html` |

#### 阶段二：重构HTML模板（1天）

| 任务 | 描述 | 文件路径 |
| :--- | :--- | :--- |
| 创建新模板结构 | 参考PPTist的布局结构 | `src/wisedeck/web/templates/pages/project/project_full_editor.html` |
| 集成幻灯片预览 | 使用iframe嵌入现有PPT预览 | 同上 |
| 添加工具栏结构 | 顶部工具栏和右侧属性面板 | 同上 |

#### 阶段三：实现核心功能（3天）

| 任务 | 描述 | 优先级 |
| :--- | :--- | :--- |
| 元素选择功能 | 点击选中元素，显示选中框 | 高 |
| 元素拖拽功能 | 拖拽移动元素位置 | 高 |
| 元素调整大小 | 拖动调整元素尺寸 | 高 |
| 文本编辑 | 双击进入文本编辑模式 | 高 |
| 添加文本元素 | 点击画布添加文本框 | 高 |
| 添加形状元素 | 支持多种形状（矩形、圆形、箭头等） | 高 |
| 添加图表元素 | 支持多种图表类型 | 中 |
| 添加表格元素 | 支持表格创建和编辑 | 中 |
| 删除元素 | Delete键删除选中元素 | 高 |
| 复制粘贴 | Ctrl+C/V复制粘贴元素 | 高 |
| 撤销重做 | Ctrl+Z/Y撤销重做操作 | 高 |

#### 阶段四：实现右侧工具栏（2天）

| 任务 | 描述 | 优先级 |
| :--- | :--- | :--- |
| 样式面板 | 填充颜色、边框、阴影、透明度 | 高 |
| 位置面板 | X/Y坐标、宽度/高度、旋转角度 | 高 |
| 文本面板 | 字体、字号、颜色、对齐方式 | 高 |
| 幻灯片设计面板 | 背景颜色、主题样式 | 中 |

#### 阶段五：集成保存和导出功能（1天）

| 任务 | 描述 | 优先级 |
| :--- | :--- | :--- |
| 保存功能 | 调用PPT编辑器的保存API | 高 |
| 导出功能 | 调用PPT编辑器的导出API | 高 |
| 放映功能 | 调用PPT编辑器的放映功能 | 高 |

#### 阶段六：测试和验证（1天）

| 任务 | 描述 |
| :--- | :--- |
| 功能测试 | 验证所有编辑功能正常工作 |
| 页面渲染测试 | 验证所有幻灯片页面正确显示 |
| 保存同步测试 | 验证保存后PPT编辑器页面同步更新 |
| 导出测试 | 验证导出功能正常 |

### 3.3 文件结构规划

```
src/wisedeck/web/static/js/pages/project/full_editor/
├── main.js                    # 主入口文件
├── components/                # UI组件
│   ├── Toolbar.js             # 右侧工具栏
│   ├── Thumbnails.js          # 左侧缩略图
│   ├── PropertyPanel.js       # 属性面板
│   ├── FloatingToolbar.js     # 浮动工具栏
│   └── ShapePanel.js          # 形状选择面板
├── managers/                  # 状态管理
│   ├── SlideManager.js        # 幻灯片管理
│   ├── ElementManager.js      # 元素管理
│   ├── SelectionManager.js    # 选择管理
│   └── HistoryManager.js      # 历史记录管理
├── utils/                     # 工具函数
│   ├── dom.js                 # DOM操作工具
│   ├── math.js                # 数学计算工具
│   └── elementFactory.js      # 元素创建工厂
└── api/                       # API调用
    └── projectApi.js          # 项目相关API
```

### 3.4 核心类设计

#### SlideManager（幻灯片管理器）

| 方法 | 功能 | 参数 | 返回值 |
| :--- | :--- | :--- | :--- |
| `loadSlides()` | 加载幻灯片数据 | - | Promise |
| `getCurrentSlide()` | 获取当前幻灯片 | - | Slide |
| `setCurrentSlide(index)` | 设置当前幻灯片 | index: number | void |
| `addSlide()` | 添加新幻灯片 | - | void |
| `deleteSlide(index)` | 删除指定幻灯片 | index: number | void |
| `updateSlide(index, data)` | 更新幻灯片内容 | index: number, data: object | void |

#### ElementManager（元素管理器）

| 方法 | 功能 | 参数 | 返回值 |
| :--- | :--- | :--- | :--- |
| `createElement(type, config)` | 创建元素 | type: string, config: object | Element |
| `deleteElement(id)` | 删除元素 | id: string | void |
| `updateElement(id, updates)` | 更新元素属性 | id: string, updates: object | void |
| `moveElement(id, x, y)` | 移动元素位置 | id: string, x: number, y: number | void |
| `resizeElement(id, width, height)` | 调整元素大小 | id: string, width: number, height: number | void |
| `bringToFront(id)` | 置于顶层 | id: string | void |
| `sendToBack(id)` | 置于底层 | id: string | void |

#### SelectionManager（选择管理器）

| 方法 | 功能 | 参数 | 返回值 |
| :--- | :--- | :--- | :--- |
| `selectElement(id)` | 选中元素 | id: string | void |
| `deselectElement(id)` | 取消选中 | id: string | void |
| `clearSelection()` | 清空选择 | - | void |
| `getSelectedElements()` | 获取选中元素列表 | - | Element[] |
| `isSelected(id)` | 判断元素是否被选中 | id: string | boolean |

#### HistoryManager（历史记录管理器）

| 方法 | 功能 | 参数 | 返回值 |
| :--- | :--- | :--- | :--- |
| `saveSnapshot()` | 保存当前状态快照 | - | void |
| `undo()` | 撤销上一步操作 | - | void |
| `redo()` | 重做下一步操作 | - | void |
| `canUndo()` | 是否可以撤销 | - | boolean |
| `canRedo()` | 是否可以重做 | - | boolean |

### 3.5 API接口规划

| API路径 | 方法 | 功能 | 参数 |
| :--- | :--- | :--- | :--- |
| `/api/projects/{id}/slides` | GET | 获取项目幻灯片列表 | projectId |
| `/api/projects/{id}/slides` | PUT | 更新幻灯片数据 | projectId, slides_data |
| `/api/projects/{id}/export/pptx` | POST | 导出PPTX文件 | projectId |
| `/api/projects/{id}/export/pdf` | POST | 导出PDF文件 | projectId |
| `/api/projects/{id}/export/image` | POST | 导出图片 | projectId, slideIndex |

## 四、技术实现方案

### 4.1 数据传递方案

使用Jinja2模板变量在HTML中注入项目数据：

```html
<script id="projectData" type="application/json">
{{ {'projectId': project.project_id, 'slides': project.slides_data}|tojson|safe }}
</script>
```

### 4.2 跨窗口通信方案

使用`window.postMessage`实现编辑器与PPT预览iframe的通信：

| 消息类型 | 方向 | 描述 |
| :--- | :--- | :--- |
| `elementSelected` | iframe → parent | 元素被选中 |
| `elementMoved` | iframe → parent | 元素被移动 |
| `elementResized` | iframe → parent | 元素被调整大小 |
| `addElement` | parent → iframe | 添加新元素 |
| `updateElement` | parent → iframe | 更新元素属性 |
| `deleteElement` | parent → iframe | 删除元素 |

### 4.3 元素渲染方案

在iframe中渲染幻灯片HTML，通过注入脚本实现编辑功能：

```javascript
// 注入编辑脚本到iframe
function injectEditorScript(iframe) {
    const doc = iframe.contentDocument;
    const script = doc.createElement('script');
    script.textContent = `
        // 编辑逻辑
        document.addEventListener('click', handleClick);
        document.addEventListener('mousedown', handleMouseDown);
        // ...
    `;
    doc.head.appendChild(script);
}
```

## 五、风险评估

| 风险 | 描述 | 影响程度 | 应对措施 |
| :--- | :--- | :--- | :--- |
| iframe跨域问题 | iframe内脚本注入可能遇到安全限制 | 高 | 使用srcdoc属性或同域策略 |
| 性能问题 | 大量元素时渲染性能下降 | 中 | 实现虚拟滚动和懒加载 |
| 状态同步问题 | 编辑状态与PPT编辑器不一致 | 高 | 保存时同步更新主编辑器 |
| 浏览器兼容性 | 某些功能在旧浏览器不支持 | 中 | 使用polyfill和降级方案 |
| 数据丢失风险 | 编辑过程中意外关闭页面 | 高 | 实现自动保存和本地存储 |

## 六、进度安排

| 阶段 | 时间 | 任务 |
| :--- | :--- | :--- |
| 阶段一 | 第1天 | 清理旧代码 |
| 阶段二 | 第2天 | 重构HTML模板 |
| 阶段三 | 第3-5天 | 实现核心编辑功能 |
| 阶段四 | 第6-7天 | 实现右侧工具栏 |
| 阶段五 | 第8天 | 集成保存和导出功能 |
| 阶段六 | 第9天 | 测试和验证 |
| **总计** | **9天** | |

## 七、验收标准

| 功能 | 验收标准 |
| :--- | :--- |
| 页面预览 | 完整显示所有幻灯片页面，与PPT编辑器一致 |
| 元素选择 | 点击元素可选中，显示选中框 |
| 元素拖拽 | 可拖拽移动元素位置 |
| 元素调整大小 | 可调整元素尺寸和旋转角度 |
| 文本编辑 | 双击可进入文本编辑模式 |
| 添加元素 | 可添加文本、形状、图表、表格 |
| 删除元素 | Delete键可删除选中元素 |
| 复制粘贴 | Ctrl+C/V可复制粘贴元素 |
| 撤销重做 | Ctrl+Z/Y可撤销重做 |
| 右侧工具栏 | 样式、位置、动画面板功能正常 |
| 保存功能 | 保存后PPT编辑器页面同步更新 |
| 导出功能 | 可导出PPTX/PDF/图片 |
| 放映功能 | 可进入全屏放映模式 |

---

**文档版本**: v1.0  
**创建日期**: 2024年  
**状态**: 待审核
