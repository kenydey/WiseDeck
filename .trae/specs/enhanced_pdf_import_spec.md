# PDF 导入模板统一升级规格说明书

## 一、背景与目标

### 1.1 问题描述

当前 PDF 导入功能和 PPTX 导入功能输出的模板 JSON 存在差异：

| 字段 | PPTX 导入 | PDF 导入 |
|------|-----------|----------|
| `template_name` | ✅ 自动生成 | ❌ 仅 suggested_template_name |
| `description` | ✅ 自动生成 | ❌ 缺少 |
| `html_template` | ✅ 完整结构 | ⚠️ 仅 SVG 堆叠 |
| `tags` | ✅ 自动生成 | ❌ 缺少 |
| `is_default` | ✅ false | ❌ 缺少 |

这导致从 PDF 导入创建的模板与从 PPTX 导入创建的模板不一致，无法完美还原原文件的视觉效果。

### 1.2 升级目标

使 PDF 导入功能输出的模板 JSON 与 PPTX 导入保持一致，包含所有必需字段：

#### 核心能力目标

| 目标 | 说明 |
|------|------|
| 统一模板 JSON | PDF 和 PPTX 导入输出相同的 JSON 结构 |
| 模板名称生成 | 从 PDF 文件名自动生成 |
| 描述生成 | 根据 PDF 内容特征自动生成描述 |
| 标签生成 | 根据 PDF 类型/特征自动生成标签 |
| HTML 模板 | 生成完整的 HTML 模板结构 |

#### 模板 JSON 输出目标

```json
{
  "template_name": "从文件名提取的模板名称",
  "description": "基于 PDF 内容自动生成的描述",
  "html_template": "<!DOCTYPE html>...</html>",
  "tags": ["PDF", "视觉模板"],
  "is_default": false
}
```

---

## 二、当前实现分析

### 2.1 PDF 导入现状

当前 `_convert_pdf_template_sync()` 函数：
1. 使用 `import_pdf_from_upload()` 将 PDF 转换为 PNG/SVG
2. 使用 `bundle_workspace_svgs()` 生成 SVG 模板
3. 使用 `build_import_summary()` 构建导入摘要
4. 返回 `TemplateOfficeConvertResponse`

**缺失功能**：
- 模板名称仅作为 `suggested_template_name` 建议值
- 无 `description` 字段
- 无 `tags` 字段
- 无 `is_default` 字段
- `html_template` 仅是 SVG 堆叠的 HTML 包装

### 2.2 PPTX 导入现状（已完成）

已实现的 PPTX 轻量级导入：
- 使用 `TemplateMetadataGenerator` 生成模板名称、描述、标签
- 使用 `HtmlTemplateGenerator` 生成完整 HTML 模板
- 返回 `{ template: {...}, preview_html: "..." }` 结构

### 2.3 需要统一的功能

| 功能 | 当前 PDF | 目标 PDF | 实现方式 |
|------|---------|---------|---------|
| template_name | suggested_template_name | 自动生成 | 复用 TemplateMetadataGenerator |
| description | 无 | 自动生成 | 复用 TemplateMetadataGenerator |
| tags | 无 | 自动生成 | 复用 TemplateMetadataGenerator + PDF 特征 |
| html_template | SVG 堆叠 | 完整 HTML | 复用 HtmlTemplateGenerator |
| is_default | 无 | false | 固定值 |

---

## 三、升级规格说明

### 3.1 新增需求：PDF 样式分析

#### 需求：PDF 内容特征分析

系统**必须**能够分析 PDF 内容特征以生成元数据：

| 分析目标 | 提取方式 | 输出 |
|---------|---------|------|
| 文件名 | 直接使用 | template_name 基础 |
| 页数 | manifest.slide_assets.page_count | 描述组成 |
| 视觉风格 | 分析 SVG/PNG 主色调 | tags 组成 |
| 页面尺寸 | SVG 或 manifest | slide_dimensions |

### 3.2 新增需求：PDF 元数据生成器

#### 需求：PDFTemplateMetadataGenerator

创建专门的 PDF 模板元数据生成器：

```python
class PDFTemplateMetadataGenerator:
    """PDF 模板元数据生成器"""

    def __init__(
        self,
        source_filename: str,
        slide_count: int = 0,
        page_width: int = 1280,
        page_height: int = 720,
        dominant_colors: List[str] = None,
    ):
        self.source_filename = source_filename
        self.slide_count = slide_count
        self.page_width = page_width
        self.page_height = page_height
        self.dominant_colors = dominant_colors or []

    def generate_template_name(self) -> str:
        """从 PDF 文件名生成模板名称"""
        # 复用 TemplateMetadataGenerator 的逻辑

    def generate_description(self) -> str:
        """根据 PDF 内容生成描述"""
        # PDF 视觉模板描述
        # 页数信息
        # 适用场景

    def generate_tags(self) -> List[str]:
        """根据 PDF 特征生成标签"""
        # ["PDF", "视觉模板"] 基础
        # 颜色标签（如有）
        # 多页标签（如有）

    def generate_metadata(self) -> Dict[str, Any]:
        """生成完整的元数据"""
        return {
            "template_name": self.generate_template_name(),
            "description": self.generate_description(),
            "tags": self.generate_tags(),
            "is_default": False,
        }
```

### 3.3 新增需求：PDF HTML 模板生成

#### 需求：基于 SVG 的 HTML 模板

系统**必须**能够生成包含 SVG 的 HTML 模板：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>{{ page_title }}</title>
    <style>
        :root {
            --primary-color: #4472C4;
            --text-color: #333333;
            --bg-color: #FFFFFF;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        body {
            width: 1280px;
            height: 720px;
            margin: 0 auto;
            background: var(--bg-color);
            font-family: 'Microsoft YaHei', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .slide-container {
            position: relative;
            width: 100%;
            height: 100%;
        }
        .slide-svg {
            width: 100%;
            height: 100%;
        }
        .slide-content {
            position: absolute;
            left: 5%;
            top: 20%;
            width: 90%;
            height: 60%;
            overflow: hidden;
        }
        .slide-footer {
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="slide-svg">{{{ svg_content }}}</div>
        <div class="slide-content">{{{ page_content }}}</div>
        <div class="slide-footer">
            <span>{{ current_page_number }} / {{ total_page_count }}</span>
        </div>
    </div>
</body>
</html>
```

---

## 四、技术规格

### 4.1 文件结构

```
services/template/
├── pptx_style_extractor.py          # 已存在
├── html_template_generator.py          # 已存在
├── template_metadata_generator.py      # 已存在
├── pdf_template_metadata_generator.py  # 新增：PDF 元数据生成器
├── pdf_html_template_generator.py      # 新增：PDF HTML 模板生成器
└── template_json_builder.py            # 已存在
```

### 4.2 新增文件规格

#### 4.2.1 pdf_template_metadata_generator.py

```python
class PDFTemplateMetadataGenerator:
    """PDF 模板元数据生成器"""

    def __init__(
        self,
        source_filename: str,
        slide_count: int = 0,
        page_width: int = 1280,
        page_height: int = 720,
        dominant_colors: Optional[List[str]] = None,
    ):
        self.source_filename = source_filename
        self.slide_count = slide_count
        self.page_width = page_width
        self.page_height = page_height
        self.dominant_colors = dominant_colors or []

    def generate_template_name(self) -> str:
        """从 PDF 文件名生成模板名称"""
        # 移除 .pdf 扩展名
        # 格式化处理
        # 默认值："PDF 导入模板"
        pass

    def generate_description(self) -> str:
        """根据 PDF 内容生成描述"""
        # PDF 视觉模板描述
        # 页数信息（多页/单页）
        # 适用场景推断
        pass

    def generate_tags(self) -> List[str]:
        """根据 PDF 特征生成标签"""
        # ["PDF", "视觉模板"] 基础
        # 颜色标签
        # 多页标签
        # 最多 5 个
        pass

    def generate_metadata(self) -> Dict[str, Any]:
        """生成完整的元数据"""
        return {
            "template_name": self.generate_template_name(),
            "description": self.generate_description(),
            "tags": self.generate_tags(),
            "is_default": False,
        }
```

#### 4.2.2 pdf_html_template_generator.py

```python
class PDFHtmlTemplateGenerator:
    """PDF HTML 模板生成器"""

    def __init__(
        self,
        svg_template: Optional[str] = None,
        page_width: int = 1280,
        page_height: int = 720,
        theme_colors: Optional[Dict[str, str]] = None,
    ):
        self.svg_template = svg_template
        self.page_width = page_width
        self.page_height = page_height
        self.theme_colors = theme_colors or {}

    def generate_template(self) -> str:
        """生成包含 SVG 占位符的 HTML 模板"""
        pass

    def generate_single_slide_html(self) -> str:
        """生成单页 HTML（用于预览）"""
        pass
```

### 4.3 数据结构

#### 4.3.1 PDF 导入输入

```json
{
  "filename": "演示文稿.pdf",
  "data": "base64...",
  "png_zoom": 2.0,
  "bundle_mode": "per_slide"
}
```

#### 4.3.2 PDF 导入输出（目标）

```json
{
  "template": {
    "template_name": "演示文稿",
    "description": "PDF 视觉模板，共 10 页，适合内容展示",
    "html_template": "<!DOCTYPE html>...</html>",
    "tags": ["PDF", "视觉模板", "多页"],
    "is_default": false
  },
  "preview_html": "<!DOCTYPE html>...</html>",
  "svg_template": "<svg>...</svg>",
  "slide_count": 10
}
```

---

## 五、实施约束

### 5.1 向后兼容

- **BREAKING**: PDF 导入端点返回结构从 `TemplateOfficeConvertResponse` 改为 `{ template, preview_html, ... }`
- 保留 `svg_template` 和 `slide_count` 字段以兼容现有功能
- 前端需要适配新的返回结构

### 5.2 性能要求

- PDF 导入处理时间不超过 10 秒
- 元数据生成时间不超过 100ms
- HTML 模板生成时间不超过 200ms

### 5.3 异常处理

| 场景 | 处理方式 |
|------|---------|
| 文件名为空 | 使用默认名称 "PDF 导入模板" |
| SVG 模板为空 | 生成基础 HTML 模板 |
| 页数解析失败 | 使用默认值 1 |

---

## 六、影响范围

### 6.1 受影响的文件

| 文件 | 修改类型 |
|------|---------|
| `global_master_template_api.py` | 新增 PDF 导入统一端点 |
| `pdf_template_metadata_generator.py` | 新增 |
| `pdf_html_template_generator.py` | 新增 |
| `globalMasterTemplates.upload.js` | 适配新返回结构 |

### 6.2 API 变更

**新增端点**: `/import/unified-pdf` (或更新现有端点)

**返回格式**:
```json
{
  "template": {
    "template_name": "...",
    "description": "...",
    "html_template": "...",
    "tags": [...],
    "is_default": false
  },
  "preview_html": "...",
  "svg_template": "...",
  "slide_count": 10,
  "warnings": [...]
}
```

---

## 七、验收标准

### 7.1 功能验收

- [ ] PDF 导入返回完整的模板 JSON
- [ ] template_name 从文件名自动生成
- [ ] description 自动生成（包含页数信息）
- [ ] tags 自动生成（包含 "PDF"、"视觉模板"）
- [ ] html_template 包含完整的 HTML 结构
- [ ] 预览 HTML 正确渲染

### 7.2 兼容性验收

- [ ] 现有前端代码能适配新的返回格式
- [ ] PDF 和 PPTX 导入返回结构一致
- [ ] 生成的模板可被模板系统正常加载

---

*文档版本：1.0*
*创建日期：2026-05-07*
*适用版本：WiseDeck v0.2.0+*
