# PPT 模板 JSON 文件结构说明文档

## 一、JSON 文件顶层字段

### 必需字段 (Required Fields)

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `template_name` | string | 模板名称 | `"现代商务模板"` |
| `description` | string | 模板描述，说明适用场景和风格特点 | `"适用于企业介绍、产品发布等正式场合"` |
| `html_template` | string | 完整的 HTML 模板字符串（含 CSS 和占位符） | `"<html>..."` |
| `tags` | array[string] | 模板标签，用于分类和搜索 | `["商务", "现代", "深色"]` |
| `is_default` | boolean | 是否为默认模板 | `false` |

### 可选字段 (Optional Fields)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `export_info` | object | 导出信息（系统自动生成） |
| `export_info.exported_at` | string | ISO 8601 时间戳 |
| `export_info.original_id` | integer | 原始模板 ID |
| `export_info.original_created_at` | number | Unix 时间戳（秒） |

---

## 二、HTML 模板占位符 (Placeholders)

### 2.1 标准占位符 (Mustache 语法)

使用 `{{ 变量名 }}` 格式，在渲染时会被替换为实际内容。

| 占位符 | 用途 | 数据类型 | 示例替换值 |
|--------|------|----------|------------|
| `{{ page_title }}` | 页面标题（浏览器标签页标题） | string | `"企业介绍 - 正泰集团"` |
| `{{ main_heading }}` | 主标题（幻灯片大标题） | string | `"正泰集团简介"` |
| `{{ page_content }}` | 页面主体内容（HTML 片段） | string | `"<p>正泰集团成立于 1984 年...</p>"` |
| `{{ current_page_number }}` | 当前页码 | integer | `1` |
| `{{ total_page_count }}` | 总页数 | integer | `15` |

### 2.2 条件占位符 (Conditional Blocks)

```html
{{#if show_logo}}
  <img src="{{ logo_url }}" class="logo" />
{{/if}}
```

| 占位符 | 用途 | 数据类型 |
|--------|------|----------|
| `{{#if 变量}}...{{/if}}` | 条件渲染块 | boolean |
| `{{#unless 变量}}...{{/unless}}` | 条件取反渲染 | boolean |

### 2.3 循环占位符 (Iteration Blocks)

```html
{{#each items}}
  <li>{{ this.name }}</li>
{{/each}}
```

| 占位符 | 用途 | 数据类型 |
|--------|------|----------|
| `{{#each 数组变量}}...{{/each}}` | 遍历数组 | array[object] |

---

## 三、CSS 样式关键配置

### 3.1 画布尺寸 (Canvas Size)

```css
body {
  width: 1280px;    /* 标准 16:9 宽度 */
  height: 720px;    /* 标准 16:9 高度 */
  /* 可选尺寸：1920x1080 (全高清), 1280x720 (高清) */
}
```

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| `width` | `1280px` 或 `1920px` | 画布宽度 |
| `height` | `720px` 或 `1080px` | 画布高度 |
| `aspect_ratio` | `16:9` | 标准宽屏比例 |

### 3.2 字体配置 (Font Stack)

```css
font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
```

| 平台 | 推荐字体 | 回退顺序 |
|------|----------|----------|
| 中文 Windows | `Microsoft YaHei` (微软雅黑) | `Arial`, `sans-serif` |
| 中文 macOS | `PingFang SC` (苹方) | `Helvetica Neue`, `sans-serif` |
| 英文环境 | `Helvetica Neue` | `Arial`, `sans-serif` |

### 3.3 背景样式 (Background)

```css
/* 纯色背景 */
background-color: #1e293b;

/* 渐变背景 */
background: linear-gradient(135deg, #1e293b 0%, #334155 100%);

/* 多色渐变 */
background: linear-gradient(135deg, 
  #1e293b 0%, 
  #334155 50%, 
  #475569 100%
);
```

### 3.4 颜色变量 (Color Palette)

在模板中定义的颜色变量应遵循以下命名：

```css
:root {
  --primary-color: #60a5fa;      /* 主色调 */
  --secondary-color: #3b82f6;    /* 辅助色 */
  --text-color: #e2e8f0;         /* 正文文本 */
  --heading-color: #60a5fa;      /* 标题文本 */
  --border-color: rgba(96, 165, 250, 0.3);  /* 边框色 */
  --bg-color: #1e293b;           /* 背景色 */
}
```

---

## 四、布局结构模板

### 4.1 标准幻灯片布局

```html
<div class="slide-container">
  <!-- 页眉区域 -->
  <div class="slide-header">
    <h1 class="slide-title">{{ main_heading }}</h1>
  </div>
  
  <!-- 内容区域 -->
  <div class="slide-content">
    <div class="content-main">
      {{{ page_content }}}  <!-- 三重括号表示不转义 HTML -->
    </div>
  </div>
  
  <!-- 页脚区域 -->
  <div class="slide-footer">
    <span class="page-number">{{ current_page_number }} / {{ total_page_count }}</span>
  </div>
</div>
```

### 4.2 关键 CSS 类名规范

| 类名 | 用途 | 必需性 |
|------|------|--------|
| `.slide-container` | 幻灯片容器 | 必需 |
| `.slide-header` | 页眉区域 | 推荐 |
| `.slide-title` | 主标题 | 推荐 |
| `.slide-content` | 内容区域 | 必需 |
| `.content-main` | 主体内容 | 推荐 |
| `.slide-footer` | 页脚区域 | 可选 |
| `.page-number` | 页码 | 可选 |

---

## 五、从现有 PPT 提取信息的步骤

### 5.1 需要提取的核心信息

1. **布局信息**
   - 画布尺寸（宽 x 高）
   - 页边距（padding/margin）
   - 分栏结构（单栏/双栏/多栏）
   - 元素位置（绝对定位/相对定位）

2. **样式信息**
   - 字体族（font-family）
   - 字体大小（font-size，使用 clamp 函数实现响应式）
   - 字体颜色（color）
   - 背景色/渐变（background-color/background）
   - 边框样式（border）

3. **占位符映射**
   - 标题 → `{{ main_heading }}`
   - 正文 → `{{ page_content }}`
   - 页码 → `{{ current_page_number }}` / `{{ total_page_count }}`
   - Logo → `{{ logo_url }}`（如有）

4. **颜色方案**
   - 主色调（primary color）
   - 辅助色（secondary color）
   - 文本色（text color）
   - 背景色（background color）

### 5.2 提取工具推荐

```bash
# 使用 python-pptx 读取 PPTX 文件
pip install python-pptx

# 示例代码
from pptx import Presentation

prs = Presentation('template.pptx')
slide = prs.slides[0]

# 提取母版信息
master = slide.slide_layout.parent
print(f"母版宽度：{master.width}")
print(f"母版高度：{master.height}")

# 提取占位符
for shape in slide.placeholders:
    print(f"占位符：{shape.name}, 类型：{shape.placeholder_format.type}")
```

---

## 六、完整示例模板

```json
{
  "template_name": "现代商务模板",
  "description": "适用于企业介绍、产品发布等正式场合，深色背景搭配蓝色主题",
  "html_template": "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>{{ page_title }}</title>\n  <style>\n    html {\n      height: 100%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background-color: #111827;\n    }\n    body {\n      width: 1280px;\n      height: 720px;\n      margin: 0;\n      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);\n      font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;\n    }\n    .slide-title {\n      font-size: clamp(2rem, 4vw, 3.5rem);\n      color: #60a5fa;\n    }\n    .content-main {\n      font-size: clamp(1rem, 2.5vw, 1.4rem);\n      color: #e2e8f0;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"slide-container\">\n    <div class=\"slide-header\">\n      <h1 class=\"slide-title\">{{ main_heading }}</h1>\n    </div>\n    <div class=\"slide-content\">\n      <div class=\"content-main\">{{{ page_content }}}</div>\n    </div>\n    <div class=\"slide-footer\">\n      <span>{{ current_page_number }} / {{ total_page_count }}</span>\n    </div>\n  </div>\n</body>\n</html>",
  "tags": ["商务", "现代", "深色", "蓝色"],
  "is_default": true
}
```

---

## 七、快速参考表

### 7.1 字段速查

| 类别 | 字段 | 必需 | 默认值 |
|------|------|------|--------|
| 元数据 | `template_name` | ✓ | 无 |
| 元数据 | `description` | ✓ | 无 |
| 元数据 | `tags` | ✓ | `[]` |
| 模板 | `html_template` | ✓ | 无 |
| 配置 | `is_default` | ✗ | `false` |

### 7.2 占位符速查

| 占位符 | 用途 | 必需 |
|--------|------|------|
| `{{ page_title }}` | 页面标题 | ✓ |
| `{{ main_heading }}` | 主标题 | ✓ |
| `{{ page_content }}` | 正文内容 | ✓ |
| `{{ current_page_number }}` | 当前页码 | 推荐 |
| `{{ total_page_count }}` | 总页数 | 推荐 |

### 7.3 CSS 关键属性速查

| 属性 | 推荐值 | 说明 |
|------|--------|------|
| `width` | `1280px` | 16:9 标准宽度 |
| `height` | `720px` | 16:9 标准高度 |
| `font-family` | 中文 + 英文组合 | 确保跨平台兼容 |
| `font-size` | `clamp()` 函数 | 响应式缩放 |
| `background` | 渐变色 | 提升视觉层次 |

---

**文档版本**: 1.0  
**最后更新**: 2026-05-07  
**适用系统**: PPT 生成管道 v3.0
