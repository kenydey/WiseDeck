# 修复计划：PPTX 轻量级导入预览空白问题

## 问题分析

### 问题描述
导入 PPTX 文件后：
- ✅ 布局数量正确显示（如"5个布局"）
- ❌ 预览区域空白，没有显示占位符布局预览
- ❌ 缺少详细的模板信息（如描述、标签等）

### 根本原因分析

**原因 1：预览 HTML 生成问题**
当前 `generateLightweightPreviewHtml()` 函数生成的 HTML 使用 `aspect-ratio: 16/9`，但 iframe 容器的高度可能没有正确设置。

**原因 2：模板数据结构不完整**
与商务模板相比，轻量级导入的模板缺少：
- 完整的描述信息
- 合适的标签
- 丰富的样式配置

### 与商务模板的对比

| 字段 | 商务模板 | 轻量级导入 |
|------|---------|-----------|
| `template_name` | 有意义的名称 | 文件名 |
| `description` | 详细描述 | 简单描述 |
| `html_template` | 完整 HTML 模板 | 简单预览 |
| `tags` | 多个标签 | 只有 3 个标签 |
| `style_config` | 完整样式配置 | 基本配置 |

---

## 修复方案

### 方案 1：修复预览 HTML 生成
增强 `generateLightweightPreviewHtml()` 函数，确保生成的 HTML 在 iframe 中正确显示。

### 方案 2：完善模板数据结构
添加更完整的模板信息，使其与商务模板结构一致。

### 方案 3：后端增强预览生成
在后端生成预览 HTML，确保格式正确。

---

## 实施计划

### 任务 1：修复前端预览 HTML 生成
**文件**: `src/wisedeck/web/static/js/pages/template/global_master/globalMasterTemplates.upload.js`

**修改内容**:
- 修复 `generateLightweightPreviewHtml()` 函数
- 使用固定尺寸（1280x720）代替 `aspect-ratio`
- 确保 CSS 样式正确应用

### 任务 2：完善模板数据结构
**文件**: `src/wisedeck/web/static/js/pages/template/global_master/globalMasterTemplates.upload.js`

**修改内容**:
- 添加更详细的描述信息
- 添加更多标签
- 完善 `style_config` 结构

### 任务 3：后端增强（可选）
**文件**: `src/wisedeck/services/template/pptx_style_extractor.py`

**修改内容**:
- 在后端生成预览 HTML
- 确保 HTML 格式正确

### 任务 4：测试验证
- 使用测试 PPTX 文件验证修复效果
- 确保预览正确显示
- 确保模板数据结构完整

---

## 预期结果

修复后，导入的 PPTX 模板应该：
- ✅ 正确显示预览（占位符布局可视化）
- ✅ 显示完整的描述信息
- ✅ 包含合适的标签
- ✅ 支持多种布局预览

---

*计划生成时间：2026-05-07*
