# PPTX 导入模板完整还原功能升级规格说明书

## 一、背景与目标

### 1.1 问题描述

当前 PPTX 轻量级导入功能虽然已经可以提取颜色、字体、占位符坐标等信息，但生成的 HTML 模板与原文件格式存在较大差距，无法完美还原原 PPT 文件的视觉效果。此外，导出的模板 JSON 缺少 `template_name`、`description`、`tags`、`is_default` 等必需字段，无法直接用于 WiseDeck 模板系统。

### 1.2 升级目标

使导入的 PPTX 模板能够**完美还原原文件的格式**，并输出符合 WiseDeck 模板规范的完整 JSON：

#### 核心能力目标

| 目标 | 说明 |
|------|------|
| 格式还原度 | ≥90% 视觉相似度（背景、字体、颜色、布局） |
| 完整模板 JSON | 包含所有必需字段（template_name, description, tags, html_template, is_default） |
| 占位符映射 | 标题、正文、页码等元素正确映射到 Mustache 变量 |
| 多栏支持 | 单栏/双栏/三栏布局自动识别与生成 |

#### 模板 JSON 输出目标

```json
{
  "template_name": "从文件名提取的模板名称",
  "description": "基于 PPTX 内容自动生成的描述",
  "html_template": "<!DOCTYPE html>...</html>",
  "tags": ["商务", "深色", "现代"],
  "is_default": false
}
```

---

## 二、当前实现分析

### 2.1 现有提取能力

| 功能 | 当前状态 | 与目标差距 |
|------|---------|-----------|
| 主题色提取 | ✅ 已实现 | 仅提取 accent1-6，未提取文字颜色 |
| 背景色提取 | ✅ 已实现 | 纯色/渐变已支持 |
| 字体提取 | ✅ 已实现 | 已提取 family, size, color, weight |
| 页边距提取 | ✅ 已实现 | top/bottom/left/right 已支持 |
| 占位符坐标 | ✅ 已实现 | 坐标正确，已生成完整布局结构 |
| HTML 模板生成 | ✅ 已实现 | CSS 变量、页眉、页脚已支持 |
| 模板名称生成 | ❌ 未实现 | 缺少从文件名生成模板名的逻辑 |
| 描述生成 | ❌ 未实现 | 缺少自动生成模板描述的逻辑 |
| 标签生成 | ❌ 未实现 | 缺少基于颜色/风格生成标签的逻辑 |

### 2.2 缺失的关键信息

根据模板结构指南，完整模板 JSON 需要以下字段：

| 字段 | 当前状态 | 实现方案 |
|------|---------|---------|
| `template_name` | ❌ 缺失 | 从文件名自动生成（移除扩展名、格式化） |
| `description` | ❌ 缺失 | 根据背景色、字体风格自动生成描述 |
| `html_template` | ✅ 已有 | 使用 HtmlTemplateGenerator 生成 |
| `tags` | ❌ 缺失 | 根据颜色主题、风格特征自动提取 |
| `is_default` | ⚠️ 默认 false | 自动设置为 false |

---

## 三、升级规格说明

### 3.1 新增需求：模板元数据生成

#### 需求 1：模板名称自动生成

系统**必须**能够根据 PPTX 文件名自动生成模板名称：

| 输入示例 | 输出示例 |
|---------|---------|
| `企业介绍模板.pptx` | `"企业介绍模板"` |
| `modern_dark_theme.pptx` | `"Modern Dark Theme"` |
| `产品发布_v2.pptx` | `"产品发布"` |
| `财务报告2024.pptx` | `"财务报告"` |

**生成规则**：
1. 移除 `.pptx` / `.ppt` 扩展名
2. 将下划线 `_` 替换为空格
3. 将驼峰命名转换为空格分隔
4. 移除版本号（如 `_v2`, `_2024`）
5. 首字母大写

#### 需求 2：模板描述自动生成

系统**必须**能够根据 PPTX 样式特征自动生成描述：

| 样式特征 | 描述模板 |
|---------|---------|
| 深色背景 + 蓝色主色 | "深色背景搭配蓝色主题，适合商务演示" |
| 浅色背景 + 橙色辅色 | "清新明亮风格，适合创意展示" |
| 渐变背景 | "渐变视觉效果，现代感十足" |
| 大标题字号 | "突出标题的设计风格" |

**描述组成**：
1. **背景风格**：深色/浅色/渐变 + 视觉风格描述
2. **主色调**：颜色名称（蓝色/橙色/绿色等）+ 主题描述
3. **适用场景**：基于布局推断（商务/创意/教育等）

#### 需求 3：标签自动生成

系统**必须**能够根据样式特征自动生成标签：

| 样式特征 | 生成标签 |
|---------|---------|
| 背景色为深色 (#1e293b 等) | `["深色"]` |
| 背景包含渐变 | `["渐变"]` |
| 字体包含"雅黑" | `["商务"]` |
| 字体包含"宋体" | `["传统"]` |
| 主色为蓝色系 | `["蓝色"]` |
| 主色为橙色系 | `["橙色"]` |
| 双栏布局 | `["双栏"]` |
| 三栏布局 | `["三栏"]` |

**标签生成规则**：
1. 从背景色推断：`["深色"]` 或 `["浅色"]`
2. 从背景类型推断：渐变背景添加 `["渐变"]`
3. 从主色调推断：蓝色系→`["蓝色"]`，橙色系→`["橙色"]`等
4. 从布局类型推断：`["单栏"]`/`["双栏"]`/`["三栏"]`
5. 标签数量限制：最多 5 个

---

### 3.2 新增需求：完整模板 JSON 生成

#### 需求：模板 JSON 组装

系统**必须**能够组装完整的模板 JSON：

```json
{
  "template_name": "企业介绍模板",
  "description": "深色背景搭配蓝色主题，现代商务风格，适用于企业介绍、产品发布等正式场合",
  "html_template": "<!DOCTYPE html>...",
  "tags": ["深色", "蓝色", "商务", "现代", "单栏"],
  "is_default": false
}
```

---

### 3.3 增强需求：HTML 模板优化

#### 需求：Mustache 占位符完整性

生成的 HTML 模板**必须**包含以下占位符：

| 占位符 | 用途 | 必需性 |
|--------|------|--------|
| `{{ page_title }}` | 页面标题（浏览器标签） | 必需 |
| `{{ main_heading }}` | 主标题 | 必需 |
| `{{{ page_content }}}` | 正文内容（不转义） | 必需 |
| `{{ current_page_number }}` | 当前页码 | 推荐 |
| `{{ total_page_count }}` | 总页数 | 推荐 |
| `{{ subtitle }}` | 副标题 | 可选 |

---

## 四、技术规格

### 4.1 文件结构

```
services/template/
├── pptx_style_extractor.py       # 增强：深度样式提取
├── html_template_generator.py     # 增强：完整结构生成
├── template_metadata_generator.py  # 新增：模板元数据生成
├── layout_auto_splitter.py         # 保留：多栏布局切分
└── template_json_builder.py        # 新增：完整模板 JSON 组装
```

### 4.2 新增文件规格

#### 4.2.1 template_metadata_generator.py

```python
class TemplateMetadataGenerator:
    """模板元数据生成器"""

    def __init__(self, theme_colors, fonts, background, layout_type, source_filename):
        self.theme_colors = theme_colors
        self.fonts = fonts
        self.background = background
        self.layout_type = layout_type
        self.source_filename = source_filename

    def generate_template_name(self) -> str:
        """从文件名生成模板名称"""
        # 移除扩展名
        # 下划线转空格
        # 移除版本号
        # 首字母大写
        pass

    def generate_description(self) -> str:
        """根据样式特征生成描述"""
        # 背景风格描述
        # 主色调描述
        # 适用场景推断
        pass

    def generate_tags(self) -> List[str]:
        """根据样式特征生成标签"""
        # 深色/浅色
        # 渐变（若有）
        # 主色调
        # 布局类型
        pass

    def generate_metadata(self) -> Dict[str, Any]:
        """生成完整的元数据"""
        return {
            "template_name": self.generate_template_name(),
            "description": self.generate_description(),
            "tags": self.generate_tags(),
            "is_default": False
        }
```

#### 4.2.2 template_json_builder.py

```python
class TemplateJsonBuilder:
    """模板 JSON 构建器"""

    def __init__(
        self,
        template_config: Dict[str, Any],  # schema_version: 2
        source_filename: str
    ):
        self.config = template_config
        self.source_filename = source_filename

    def build_template_json(self) -> Dict[str, Any]:
        """构建完整的模板 JSON"""
        metadata_gen = TemplateMetadataGenerator(
            theme_colors=self.config.get("theme_colors"),
            fonts=self.config.get("fonts"),
            background=self.config.get("background"),
            layout_type=self.config.get("template_contract", {}).get("layout_type", "single_column"),
            source_filename=self.source_filename
        )

        html_gen = HtmlTemplateGenerator(
            theme_colors=self.config.get("theme_colors"),
            fonts=self.config.get("fonts"),
            layouts=self.config.get("layouts"),
            slide_dimensions=self.config.get("slide_dimensions"),
            background=self.config.get("background"),
            margins=self.config.get("margins"),
            spacing=self.config.get("spacing"),
            responsive_config=self.config.get("responsive_config"),
            layout_type=self.config.get("template_contract", {}).get("layout_type", "single_column"),
        )

        metadata = metadata_gen.generate_metadata()
        html_template = html_gen.generate_template()

        return {
            "template_name": metadata["template_name"],
            "description": metadata["description"],
            "html_template": html_template,
            "tags": metadata["tags"],
            "is_default": metadata["is_default"]
        }
```

### 4.3 数据结构

#### 4.3.1 输入：PPTXStyleExtractor 输出 (schema_version: 2)

```json
{
  "schema_version": 2,
  "source": "pptx_style_extractor",
  "theme_colors": {...},
  "fonts": {...},
  "background": {...},
  "margins": {...},
  "spacing": {...},
  "layouts": [...],
  "template_contract": {
    "layout_type": "single_column",
    "placeholder_markers": [...]
  }
}
```

#### 4.3.2 输出：完整模板 JSON

```json
{
  "template_name": "企业介绍模板",
  "description": "深色背景搭配蓝色主题，现代商务风格，适用于企业介绍、产品发布等正式场合",
  "html_template": "<!DOCTYPE html>...",
  "tags": ["深色", "蓝色", "商务", "现代", "单栏"],
  "is_default": false
}
```

---

## 五、实施约束

### 5.1 向后兼容

- **BREAKING**: API 返回结构从 `{ config: {...}, preview_html: "..." }` 改为 `{ template: {...}, preview_html: "..." }`
- `template.html_template` 字段替换原有的 `config` 字段
- 前端需要适配新的返回结构

### 5.2 性能要求

- 单个 PPTX 文件处理时间不超过 5 秒
- 元数据生成时间不超过 100ms
- HTML 模板生成时间不超过 500ms

### 5.3 异常处理

| 场景 | 处理方式 |
|------|---------|
| 文件名为空 | 使用默认名称 "导入模板" |
| 颜色解析失败 | 使用默认值兜底 |
| 字体解析失败 | 使用系统默认字体 |
| HTML 生成失败 | 返回错误信息 |

---

## 六、影响范围

### 6.1 受影响的功能

| 功能 | 影响类型 | 说明 |
|------|---------|------|
| PPTX 轻量级导入 | 增强 | 输出完整模板 JSON |
| 模板预览 | 增强 | 更准确的预览效果 |
| 模板保存 | 增强 | 直接可用的模板 JSON |
| AI 生成 PPT | 无影响 | 使用已有模板 |

### 6.2 受影响的文件

| 文件 | 修改类型 |
|------|---------|
| `pptx_style_extractor.py` | 无需修改 |
| `html_template_generator.py` | 无需修改 |
| `template_metadata_generator.py` | **新增** |
| `template_json_builder.py` | **新增** |
| `global_master_template_api.py` | 适配新输出格式 |
| `globalMasterTemplates.upload.js` | 适配新返回结构 |

---

## 七、验收标准

### 7.1 功能验收

- [ ] 能从文件名生成 `template_name`
- [ ] 能根据样式特征生成 `description`
- [ ] 能根据样式特征生成 `tags`（最多 5 个）
- [ ] 生成的 HTML 模板包含所有必需占位符
- [ ] 输出的模板 JSON 符合结构规范
- [ ] API 返回 `{ template: {...}, preview_html: "..." }` 格式

### 7.2 质量验收

- [ ] 导入的模板视觉效果与原 PPT 高度相似
- [ ] 所有占位符能正确映射到 Mustache 变量
- [ ] 无运行时错误或异常信息
- [ ] 生成的 HTML 符合 W3C 标准

### 7.3 兼容性验收

- [ ] 现有前端代码能适配新的返回格式
- [ ] 生成的模板 JSON 可直接保存到数据库
- [ ] 模板可被模板系统正常加载

---

*文档版本：2.0*
*创建日期：2026-05-07*
*适用版本：WiseDeck v0.2.0+*
