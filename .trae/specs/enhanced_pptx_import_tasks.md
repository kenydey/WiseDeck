# 任务清单：PPTX 导入模板完整还原功能

## 任务 1：创建模板元数据生成器

### 任务描述
创建 `template_metadata_generator.py`，实现模板名称、描述、标签的自动生成。

### 子任务
- [x] 1.1 创建 `TemplateMetadataGenerator` 类
- [x] 1.2 实现 `generate_template_name()` 方法（文件名格式化）
- [x] 1.3 实现 `generate_description()` 方法（基于样式特征）
- [x] 1.4 实现 `generate_tags()` 方法（最多 5 个标签）
- [x] 1.5 实现 `generate_metadata()` 方法（组装元数据）

### 依赖关系
无

### 验证方式
单元测试验证各方法输出正确性

---

## 任务 2：创建模板 JSON 构建器

### 任务描述
创建 `template_json_builder.py`，实现完整的模板 JSON 组装。

### 子任务
- [x] 2.1 创建 `TemplateJsonBuilder` 类
- [x] 2.2 实现 `build_template_json()` 方法
- [x] 2.3 集成 `TemplateMetadataGenerator` 和 `HtmlTemplateGenerator`
- [x] 2.4 添加便捷函数 `build_template_json_from_pptx()`

### 依赖关系
依赖于任务 1 完成

### 验证方式
生成完整的模板 JSON 符合结构规范

---

## 任务 3：更新 API 端点

### 任务描述
更新 `global_master_template_api.py` 中的轻量级导入端点，使用新的构建器。

### 子任务
- [x] 3.1 导入 `TemplateJsonBuilder`
- [x] 3.2 修改端点使用新构建器生成模板 JSON
- [x] 3.3 更新返回结构为 `{ template: {...}, preview_html: "..." }`
- [x] 3.4 添加错误处理增强

### 依赖关系
依赖于任务 1、2 完成

### 验证方式
API 返回完整模板 JSON

---

## 任务 4：更新前端适配

### 任务描述
更新前端代码以适配新的 API 返回结构。

### 子任务
- [x] 4.1 更新 `pptxImportAdapter.js` 适配新返回格式
- [x] 4.2 更新 `globalMasterTemplates.upload.js` 处理新结构
- [x] 4.3 确保模板预览正常工作

### 依赖关系
依赖于任务 3 完成

### 验证方式
前端能正确显示导入的模板预览

---

## 任务 5：集成测试与验证

### 任务描述
对整个功能进行端到端测试。

### 子任务
- [x] 5.1 使用多个测试 PPTX 文件验证提取效果
- [x] 5.2 验证生成的 HTML 模板渲染正确
- [x] 5.3 验证模板预览与原文件相似度
- [x] 5.4 验证模板 JSON 符合结构规范

### 依赖关系
依赖于任务 3、4 完成

### 验证方式
所有测试用例通过

---

## 任务 6：文档更新

### 任务描述
更新相关文档。

### 子任务
- [ ] 6.1 更新 `ppt_template_structure_guide.md` 添加新的提取字段说明
- [ ] 6.2 更新 API 文档

### 依赖关系
无

### 验证方式
文档完整准确

---

## 任务依赖关系图

```
任务 1 (元数据生成器)
    ↓
任务 2 (JSON 构建器) ← 任务 1
    ↓
任务 3 (API) ← 任务 2
    ↓
任务 4 (前端) ← 任务 3
    ↓
任务 5 (测试) ← 任务 4
任务 6 (文档) ← 并行
```

---

## 执行顺序

1. 任务 1：创建模板元数据生成器 ✅
2. 任务 2：创建模板 JSON 构建器 ✅
3. 任务 3：更新 API ✅
4. 任务 4：更新前端 ✅
5. 任务 5：集成测试 ✅
6. 任务 6：文档更新 (进行中)
