# 检查清单：PDF 导入模板统一升级

## 阶段一：PDF 模板元数据生成器验证

### 模板名称生成
- [x] 正确移除 `.pdf` 扩展名
- [x] 正确格式化文件名
- [x] 空文件名使用默认名称 "PDF 导入模板"

### 描述生成
- [x] 包含 "PDF 视觉模板" 描述
- [x] 包含页数信息（单页/多页）
- [x] 适用场景推断合理

### 标签生成
- [x] 包含 "PDF" 标签
- [x] 包含 "视觉模板" 标签
- [x] 多页 PDF 包含 "多页" 标签
- [x] 标签数量不超过 5 个

---

## 阶段二：PDF HTML 模板生成器验证

### HTML 结构
- [x] 包含 `<!DOCTYPE html>`
- [x] 包含 `<html lang="zh-CN">`
- [x] 包含 `<meta charset="UTF-8">`
- [x] 包含 `<title>{{ page_title }}</title>`

### CSS 样式
- [x] CSS 包含 `:root` 变量定义
- [x] 包含 `--primary-color` 变量
- [x] 包含 `--text-color` 变量
- [x] 包含 `--bg-color` 变量
- [x] body 设置了正确的宽高 (1280x720)

### Mustache 占位符
- [x] 包含 `{{ page_title }}`
- [x] 包含 `{{{ svg_content }}}` 或 `{{{ page_content }}}`
- [x] 包含 `{{ current_page_number }}`
- [x] 包含 `{{ total_page_count }}`

### SVG 支持
- [x] 支持 SVG 占位符嵌入
- [x] 支持单页预览 HTML 生成

---

## 阶段三：API 端点验证

### 端点功能
- [x] `/import/unified-pdf` 端点可用
- [x] 端点返回 `{ template: {...}, preview_html: "..." }` 格式
- [x] 返回的 template 包含所有必需字段
- [x] 返回的 preview_html 可正确渲染
- [x] 保留 svg_template 字段
- [x] 保留 slide_count 字段

### 错误处理
- [x] 空文件返回错误信息
- [x] 无效文件返回错误信息
- [x] SVG 缺失时有兜底处理

---

## 阶段四：前端适配验证

### 适配新结构
- [x] 正确解析 PDF 新返回格式
- [x] 模板名称正确显示
- [x] 模板描述正确显示
- [x] 标签正确显示

### 预览功能
- [x] PDF 预览 HTML 正确渲染
- [x] PDF 和 PPTX 导入显示一致

---

## 阶段五：集成测试验证

### 功能测试
- [x] 单页 PDF 导入正确
- [x] 多页 PDF 导入正确
- [x] 不同页面尺寸 PDF 正确

### 一致性测试
- [x] PDF 和 PPTX 导入 JSON 结构一致
- [x] 必需字段（template_name, description, tags, html_template, is_default）都存在

### 质量测试
- [x] 无 Python 语法错误
- [x] 无 JavaScript 语法错误
- [x] 异常处理完整
- [x] 生成的 HTML 符合 W3C 标准

---

## 最终验证清单

- [x] 所有子任务检查项已完成
- [x] Python 语法检查通过
- [x] 功能测试通过
- [x] PDF 和 PPTX 导入结构一致
- [x] 模板 JSON 符合结构规范
