# 实施计划：导入 PPT/PPTX 自动生成系统模板

## 概述

**目标**：为 WiseDeck 开发"导入 PPT/PPTX 自动生成系统模板"功能，使用户上传的 PPT/PPTX 文件能够自动转换为可被 AI 调用的系统模板。

**核心决策**：
- ✅ 完全移除 LibreOffice 依赖，纯 python-pptx + 前端渲染
- ✅ 后端输出完整模板配置 JSON
- ✅ 前端渲染预览（基于占位符坐标）
- ✅ 缺少双栏布局时自动切分
- ✅ 前端适配器集成到现有 `globalMasterTemplates.js`

---

## 当前状态分析

### 现有模板导入系统架构

```
用户上传 PPT/PPTX
    ↓
TemplateImportService.import_from_upload()
    ↓
┌─────────────────────────────────────────────────────────┐
│ 1. LibreOffice 转换 (将被移除)                           │
│    - PPT → PDF → SVG (预览图)                           │
│    - PPT → HTML (html_template)                         │
├─────────────────────────────────────────────────────────┤
│ 2. python-pptx 提取 (保留并增强)                         │
│    - extract_pptx_layout_hints() - 布局提示              │
│    - extract_pptx_physical_structure() - 物理结构        │
│    - extract_visual_dna_v2() - 视觉DNA (颜色/字体)       │
│    - parse_pptx_to_readable_json() - pptxtojson         │
├─────────────────────────────────────────────────────────┤
│ 3. 模板契约构建                                          │
│    - build_template_contract_from_manifest()             │
│    - build_mapping_rules_from_physical_structure()       │
└─────────────────────────────────────────────────────────┘
    ↓
GlobalMasterTemplate 数据库记录
```

### 现有关键文件

| 文件路径 | 功能 | 状态 |
|---------|------|------|
| `services/template/template_import_service.py` | 模板导入主服务 | 需重构 |
| `services/template/pptx_physical_structure.py` | 物理结构提取 | 保留 |
| `services/template/pptx_slide_layout_hints.py` | 布局提示提取 | 保留 |
| `services/template/visual_dna_v2.py` | 视觉DNA提取 | 增强 |
| `services/template/pptx_readable_placeholders.py` | 占位符映射 | 保留 |
| `services/template/template_contract_build.py` | 契约构建 | 增强 |
| `services/template/template_mapping_builder.py` | 映射规则构建 | 增强 |
| `api/global_master_template_api.py` | API端点 | 需修改 |
| `web/static/js/pages/template/global_master/globalMasterTemplates.js` | 前端页面 | 需增强 |

### GlobalMasterTemplate 数据模型

```python
class GlobalMasterTemplate(Base):
    id: int
    user_id: Optional[int]
    template_name: str
    description: Optional[str]
    html_template: Optional[str]      # HTML 预览模板
    svg_template: Optional[str]       # SVG 模板
    preview_image: Optional[str]      # Base64 预览图
    import_summary: Optional[Dict]    # 导入摘要
    style_config: Optional[Dict]      # 样式配置
    tags: Optional[List[str]]
    is_default: bool
    is_active: bool
    usage_count: int
    created_by: Optional[str]
    created_at: float
    updated_at: float
```

---

## 提议的变更

### 变更 1：创建新的 PPTX 样式提取器

**文件**: `src/wisedeck/services/template/pptx_style_extractor.py` (新建)

**目的**: 创建一个统一的样式提取类，整合颜色、字体、占位符坐标提取

**核心类设计**:

```python
class PPTXStyleExtractor:
    """PPT/PPTX 样式提取器 - 提取颜色、字体、占位符坐标"""
    
    def __init__(self, pptx_path_or_bytes):
        """初始化，接收 .pptx 文件路径或字节"""
        
    def extract_theme_colors(self) -> Dict[str, str]:
        """提取主题色 (主色、背景色、Accent 1-6)"""
        
    def extract_fonts(self) -> Dict[str, str]:
        """提取标题/正文字体"""
        
    def extract_layout_placeholders(self) -> List[Dict]:
        """提取所有版式的占位符坐标 (规格化为 0.0~1.0)"""
        
    def extract_complete_template_config(self) -> Dict:
        """输出完整的 WiseDeck 模板配置"""
```

**关键实现要点**:
1. 使用 `try-except` 安全处理 `AttributeError`
2. EMU 坐标转换为比例 (除以 slide_width/height)
3. 颜色转换为 `#HEX` 格式
4. 提供默认值兜底

### 变更 2：增强视觉 DNA 提取

**文件**: `src/wisedeck/services/template/visual_dna_v2.py` (修改)

**目的**: 增强颜色和字体提取能力

**修改内容**:
- 增加 `extract_master_theme_colors()` 函数，从 `slide_master` 提取主题色
- 增加 `extract_master_fonts()` 函数，提取母版字体
- 增加异常处理，防止 `AttributeError`

### 变更 3：创建布局自动切分器

**文件**: `src/wisedeck/services/template/layout_auto_splitter.py` (新建)

**目的**: 当 PPT 缺少双栏布局时，自动基于单栏布局切分

**核心函数**:

```python
def auto_split_two_column_layout(single_column_layout: Dict) -> Dict:
    """
    从单栏布局自动切分双栏布局
    
    输入: 单栏 CONTENT_AREA 坐标 {x, y, w, h} (0.0~1.0)
    输出: 双栏布局坐标 {left: {...}, right: {...}}
    """
    # 左栏: x 不变, w = w * 0.48
    # 右栏: x = x + w * 0.52, w = w * 0.48
```

### 变更 4：重构模板导入服务

**文件**: `src/wisedeck/services/template/template_import_service.py` (修改)

**目的**: 移除 LibreOffice 依赖，使用纯 python-pptx 流程

**修改内容**:
1. 移除 `_run_soffice_convert()` 调用
2. 移除 `_pdf_to_page_assets()` 调用
3. 新增 `import_pptx_lightweight()` 方法，纯 python-pptx 流程
4. 保留 `build_lightweight_structured_manifest()` 方法

**新流程**:

```
用户上传 PPT/PPTX
    ↓
TemplateImportService.import_pptx_lightweight()
    ↓
┌─────────────────────────────────────────────────────────┐
│ 1. PPTXStyleExtractor.extract_complete_template_config() │
│    - 主题色、字体、占位符坐标                              │
├─────────────────────────────────────────────────────────┤
│ 2. LayoutAutoSplitter.auto_split_two_column_layout()     │
│    - 自动切分双栏布局                                     │
├─────────────────────────────────────────────────────────┤
│ 3. build_template_contract_from_manifest()               │
│    - 构建模板契约                                         │
└─────────────────────────────────────────────────────────┘
    ↓
返回完整模板配置 JSON
```

### 变更 5：修改 API 端点

**文件**: `src/wisedeck/api/global_master_template_api.py` (修改)

**目的**: 更新导入 API，移除 LibreOffice 相关代码

**修改内容**:
1. 修改 `convert_office_template()` 端点，使用新的轻量级导入
2. 移除 LibreOffice 相关的环境变量检查
3. 移除 `libreoffice_html_exporter` 导入

### 变更 6：创建前端适配器

**文件**: `src/wisedeck/web/static/js/pages/template/global_master/pptxImportAdapter.js` (新建)

**目的**: 将后端 JSON 数据转换为前端渲染所需的格式

**核心函数**:

```typescript
// 坐标比例转百分比字符串
function ratioToPercent(ratio: number): string {
    return `${Math.round(ratio * 100)}%`;
}

// 适配模板配置
function adaptPptxTemplateConfig(backendJson: object): TemplateConfig {
    // 转换坐标格式
    // 处理缺失布局
    // 生成预览 HTML
}

// 生成预览 HTML
function generatePreviewHtml(templateConfig: TemplateConfig): string {
    // 基于占位符坐标生成轻量级预览
}
```

### 变更 7：集成到现有前端页面

**文件**: `src/wisedeck/web/static/js/pages/template/global_master/globalMasterTemplates.js` (修改)

**目的**: 集成新的适配器，实现前端渲染预览

**修改内容**:
1. 导入 `pptxImportAdapter.js`
2. 修改模板导入成功后的处理逻辑
3. 使用 `generatePreviewHtml()` 渲染预览

---

## 数据流设计

### 后端输出 JSON 结构

```json
{
  "schema_version": 1,
  "source": "pptx_style_extractor",
  "slide_dimensions": {
    "width_emu": 9144000,
    "height_emu": 6858000,
    "width_pt": 720,
    "height_pt": 540
  },
  "theme_colors": {
    "primary": "#4472C4",
    "background": "#FFFFFF",
    "accent1": "#4472C4",
    "accent2": "#ED7D31",
    "accent3": "#A5A5A5",
    "accent4": "#FFC000",
    "accent5": "#5B9BD5",
    "accent6": "#70AD47"
  },
  "fonts": {
    "title": "Arial",
    "body": "Calibri"
  },
  "layouts": [
    {
      "layout_index": 0,
      "layout_name": "Title Slide",
      "placeholders": [
        {
          "type": "PAGE_TITLE",
          "bbox_ratio": [0.1, 0.3, 0.8, 0.15],
          "bbox_px": {"x": 92, "y": 162, "w": 736, "h": 81}
        },
        {
          "type": "SUBTITLE",
          "bbox_ratio": [0.1, 0.5, 0.8, 0.1],
          "bbox_px": {"x": 92, "y": 270, "w": 736, "h": 54}
        }
      ]
    },
    {
      "layout_index": 1,
      "layout_name": "Title and Content",
      "placeholders": [
        {
          "type": "PAGE_TITLE",
          "bbox_ratio": [0.1, 0.05, 0.8, 0.1],
          "bbox_px": {"x": 92, "y": 27, "w": 736, "h": 54}
        },
        {
          "type": "CONTENT_AREA",
          "bbox_ratio": [0.1, 0.2, 0.8, 0.7],
          "bbox_px": {"x": 92, "y": 108, "w": 736, "h": 378}
        }
      ],
      "auto_generated": {
        "two_column": {
          "left": {
            "type": "CONTENT_AREA_LEFT",
            "bbox_ratio": [0.1, 0.2, 0.38, 0.7]
          },
          "right": {
            "type": "CONTENT_AREA_RIGHT",
            "bbox_ratio": [0.52, 0.2, 0.38, 0.7]
          }
        }
      }
    }
  ],
  "template_contract": {
    "placeholder_markers": ["PAGE_TITLE", "CONTENT_AREA", "SUBTITLE"],
    "layout_signatures": [...]
  }
}
```

### 前端适配器输出结构

```typescript
interface AdaptedTemplate {
  template_name: string;
  description: string;
  style_config: {
    colors: Record<string, string>;
    fonts: { title: string; body: string };
  };
  placeholder_layouts: {
    [layoutName: string]: {
      placeholders: {
        type: string;
        x: string;  // "10%"
        y: string;  // "30%"
        width: string;  // "80%"
        height: string;  // "15%"
      }[];
    };
  };
  preview_html: string;  // 轻量级预览 HTML
}
```

---

## 异常处理策略

### python-pptx 常见异常

| 异常场景 | 处理方式 |
|---------|---------|
| 颜色未定义 | 返回默认颜色 `#000000` |
| 字体未定义 | 返回默认字体 `Arial` |
| 占位符坐标缺失 | 跳过该占位符 |
| 母版主题缺失 | 使用幻灯片级别样式 |
| 文件损坏 | 返回错误信息 |

### 代码示例

```python
def safe_get_color(theme, color_name, default="#000000"):
    try:
        color = getattr(theme, color_name, None)
        if color and hasattr(color, 'rgb'):
            return f"#{color.rgb}"
        return default
    except (AttributeError, TypeError):
        return default

def safe_get_font(placeholder, default="Arial"):
    try:
        tf = placeholder.text_frame
        if tf and tf.paragraphs:
            font = tf.paragraphs[0].font
            if font and font.name:
                return font.name
        return default
    except (AttributeError, TypeError):
        return default
```

---

## 验证步骤

### 单元测试

1. **颜色提取测试**
   - 测试标准主题色提取
   - 测试缺失颜色兜底

2. **字体提取测试**
   - 测试标题/正文字体提取
   - 测试缺失字体兜底

3. **坐标转换测试**
   - 测试 EMU → 比例转换
   - 测试边界值处理

4. **双栏切分测试**
   - 测试自动切分逻辑
   - 测试间距计算

### 集成测试

1. **导入流程测试**
   - 上传标准 PPTX 文件
   - 验证输出 JSON 结构
   - 验证前端预览渲染

2. **AI 调用测试**
   - 使用导入的模板生成 PPT
   - 验证占位符填充正确

### 测试用例

```python
# tests/test_pptx_style_extractor.py

def test_extract_theme_colors():
    """测试主题色提取"""
    extractor = PPTXStyleExtractor("test.pptx")
    colors = extractor.extract_theme_colors()
    assert "primary" in colors
    assert colors["primary"].startswith("#")

def test_extract_layout_placeholders():
    """测试占位符坐标提取"""
    extractor = PPTXStyleExtractor("test.pptx")
    layouts = extractor.extract_layout_placeholders()
    assert len(layouts) > 0
    for layout in layouts:
        for ph in layout["placeholders"]:
            bbox = ph["bbox_ratio"]
            assert all(0 <= v <= 1 for v in bbox)

def test_auto_split_two_column():
    """测试双栏自动切分"""
    single = {"x": 0.1, "y": 0.2, "w": 0.8, "h": 0.7}
    result = auto_split_two_column_layout(single)
    assert "left" in result
    assert "right" in result
    assert result["left"]["x"] == 0.1
    assert result["right"]["x"] > 0.5
```

---

## 实施步骤

### 阶段 1：后端核心实现 (预计 2-3 小时)

1. 创建 `pptx_style_extractor.py`
2. 创建 `layout_auto_splitter.py`
3. 增强 `visual_dna_v2.py`
4. 编写单元测试

### 阶段 2：服务层重构 (预计 1-2 小时)

1. 修改 `template_import_service.py`
2. 移除 LibreOffice 相关代码
3. 更新 `global_master_template_api.py`

### 阶段 3：前端适配器 (预计 1-2 小时)

1. 创建 `pptxImportAdapter.js`
2. 修改 `globalMasterTemplates.js`
3. 实现前端渲染预览

### 阶段 4：集成测试 (预计 1 小时)

1. 端到端测试
2. AI 调用验证
3. 边界情况处理

---

## 假设与决策

### 假设

1. 用户上传的 PPT/PPTX 文件格式正确
2. python-pptx 能正确解析大多数标准 PPTX 文件
3. 前端渲染预览足够满足用户需求

### 决策

1. **完全移除 LibreOffice**：简化部署，减少依赖
2. **自动切分双栏**：提高模板可用性
3. **前端渲染预览**：减少后端计算负担
4. **完整模板配置输出**：减少前端处理逻辑

---

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| python-pptx 无法解析某些 PPTX | 导入失败 | 提供友好的错误提示 |
| 颜色提取不准确 | 样式偏差 | 提供手动调整选项 |
| 前端预览与实际不符 | 用户体验差 | 增加预览验证机制 |

---

## 文件变更清单

### 新建文件

| 文件路径 | 说明 |
|---------|------|
| `src/wisedeck/services/template/pptx_style_extractor.py` | PPTX 样式提取器 |
| `src/wisedeck/services/template/layout_auto_splitter.py` | 布局自动切分器 |
| `src/wisedeck/web/static/js/pages/template/global_master/pptxImportAdapter.js` | 前端适配器 |

### 修改文件

| 文件路径 | 修改内容 |
|---------|---------|
| `src/wisedeck/services/template/template_import_service.py` | 移除 LibreOffice，新增轻量级导入 |
| `src/wisedeck/services/template/visual_dna_v2.py` | 增强颜色/字体提取 |
| `src/wisedeck/api/global_master_template_api.py` | 更新 API 端点 |
| `src/wisedeck/web/static/js/pages/template/global_master/globalMasterTemplates.js` | 集成适配器 |

### 可删除文件 (可选)

| 文件路径 | 说明 |
|---------|------|
| `src/wisedeck/services/template/libreoffice_html_exporter.py` | LibreOffice HTML 导出 (不再需要) |
| `src/wisedeck/services/template/pptx_readable_runner.py` | pptxtojson Node 脚本执行器 (可选保留) |

---

*计划生成时间：2026-05-07*
