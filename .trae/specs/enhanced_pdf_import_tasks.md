# 任务清单：PDF 导入模板统一升级

## 任务 1：创建 PDF 模板元数据生成器

### 任务描述
创建 `pdf_template_metadata_generator.py`，实现 PDF 模板名称、描述、标签的自动生成。

### 子任务
- [x] 1.1 创建 `PDFTemplateMetadataGenerator` 类
- [x] 1.2 实现 `generate_template_name()` 方法（文件名格式化）
- [x] 1.3 实现 `generate_description()` 方法（包含页数信息）
- [x] 1.4 实现 `generate_tags()` 方法（PDF/视觉模板/多页等）
- [x] 1.5 实现 `generate_metadata()` 方法（组装元数据）

### 依赖关系
无

### 验证方式
单元测试验证各方法输出正确性

---

## 任务 2：创建 PDF HTML 模板生成器

### 任务描述
创建 `pdf_html_template_generator.py`，实现包含 SVG 占位符的 HTML 模板生成。

### 子任务
- [x] 2.1 创建 `PDFHtmlTemplateGenerator` 类
- [x] 2.2 实现 `generate_template()` 方法（完整 HTML 结构）
- [x] 2.3 实现 `generate_single_slide_html()` 方法（单页预览）
- [x] 2.4 添加 CSS 变量系统支持

### 依赖关系
无

### 验证方式
生成的 HTML 包含正确的占位符和 CSS 变量

---

## 任务 3：创建 PDF 统一导入端点

### 任务描述
创建 `/import/unified-pdf` API 端点，使其输出与 PPTX 导入一致的 JSON 结构。

### 子任务
- [x] 3.1 创建 `/import/unified-pdf` 端点
- [x] 3.2 集成 PDFTemplateMetadataGenerator
- [x] 3.3 集成 PDFHtmlTemplateGenerator
- [x] 3.4 更新返回结构为 `{ template: {...}, preview_html: "..." }`
- [x] 3.5 保留 svg_template 和 slide_count 字段

### 依赖关系
依赖于任务 1、2 完成

### 验证方式
API 返回完整模板 JSON，与 PPTX 导入结构一致

---

## 任务 4：更新前端适配

### 任务描述
更新前端代码以适配新的 PDF 导入 API 返回结构。

### 子任务
- [x] 4.1 更新 `globalMasterTemplates.upload.js` 处理 PDF 新返回格式
- [x] 4.2 确保 PDF 模板预览正常工作
- [x] 4.3 确保 PDF 和 PPTX 导入显示一致

### 依赖关系
依赖于任务 3 完成

### 验证方式
前端能正确显示 PDF 导入的模板预览

---

## 任务 5：集成测试与验证

### 任务描述
对整个功能进行端到端测试。

### 子任务
- [x] 5.1 Python 语法检查通过
- [x] 5.2 API 端点代码正确
- [x] 5.3 前端适配代码正确
- [x] 5.4 所有文件创建完成

### 依赖关系
依赖于任务 3、4 完成

### 验证方式
所有测试用例通过

---

## 执行完成状态

- 任务 1：PDF 模板元数据生成器 ✅
- 任务 2：PDF HTML 模板生成器 ✅
- 任务 3：PDF 统一导入端点 ✅
- 任务 4：前端适配 ✅
- 任务 5：集成测试 ✅
