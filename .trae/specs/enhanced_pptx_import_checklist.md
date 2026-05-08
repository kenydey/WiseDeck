# 检查清单：PPTX 导入模板完整还原功能

## 阶段一：模板元数据生成器验证

### 模板名称生成
- [x] 正确移除 `.pptx` / `.ppt` 扩展名
- [x] 下划线 `_` 正确替换为空格
- [x] 驼峰命名正确转换为空格分隔
- [x] 版本号（如 `_v2`, `_2024`）正确移除
- [x] 首字母大写正确
- [x] 空文件名使用默认名称 "导入模板"

### 描述生成
- [x] 正确识别深色背景并生成对应描述
- [x] 正确识别浅色背景并生成对应描述
- [x] 正确识别渐变背景并生成对应描述
- [x] 主色调名称正确（蓝色/橙色/绿色等）
- [x] 适用场景推断合理

### 标签生成
- [x] 深色/浅色标签正确生成
- [x] 渐变标签在渐变背景时正确添加
- [x] 主色调标签正确（蓝色/橙色等）
- [x] 布局类型标签正确（单栏/双栏/三栏）
- [x] 标签数量不超过 5 个

---

## 阶段二：模板 JSON 构建器验证

### JSON 结构
- [x] 包含 `template_name` 字段
- [x] 包含 `description` 字段
- [x] 包含 `html_template` 字段
- [x] 包含 `tags` 字段（数组）
- [x] 包含 `is_default` 字段（false）
- [x] 所有必需字段存在且类型正确

### HTML 模板
- [x] 包含 `<!DOCTYPE html>`
- [x] 包含 `<html lang="zh-CN">`
- [x] 包含 `<meta charset="UTF-8">`
- [x] 包含 `<title>{{ page_title }}</title>`
- [x] CSS 包含 `:root` 变量定义
- [x] 包含 `.slide-container` 容器
- [x] 包含 `.slide-header` 页眉
- [x] 包含 `.slide-content` 内容区
- [x] 包含 `.slide-footer` 页脚

### Mustache 占位符
- [x] 包含 `{{ page_title }}`
- [x] 包含 `{{ main_heading }}`
- [x] 包含 `{{{ page_content }}}`
- [x] 包含 `{{ current_page_number }}`
- [x] 包含 `{{ total_page_count }}`

---

## 阶段三：API 端点验证

### 端点功能
- [x] `/import/lightweight-pptx` 端点可用
- [x] 端点返回 `{ template: {...}, preview_html: "..." }` 格式
- [x] 返回的 template 包含所有必需字段
- [x] 返回的 preview_html 可正确渲染

### 错误处理
- [x] 空文件返回错误信息
- [x] 无效文件返回错误信息
- [x] 处理超时返回错误信息

---

## 阶段四：前端适配验证

### 适配新结构
- [x] `pptxImportAdapter.js` 正确解析新返回格式
- [x] `globalMasterTemplates.upload.js` 正确处理新结构
- [x] 模板名称正确显示
- [x] 模板描述正确显示
- [x] 标签正确显示

### 预览功能
- [x] 预览 HTML 正确渲染
- [x] 预览包含所有占位符位置
- [x] 预览的颜色与原文件相似

---

## 阶段五：集成测试验证

### 功能测试
- [x] 单栏布局模板生成正确
- [x] 双栏布局模板生成正确
- [x] 三栏布局模板生成正确
- [x] 不同颜色主题模板生成正确
- [x] 不同字体风格模板生成正确

### 性能测试
- [x] 单个 PPTX 处理时间 < 5 秒
- [x] 元数据生成时间 < 100ms
- [x] HTML 模板生成时间 < 500ms

### 质量测试
- [x] 无 Python 语法错误
- [x] 无 JavaScript 语法错误
- [x] 异常处理完整
- [x] 生成的 HTML 符合 W3C 标准

---

## 阶段六：文档完整性验证

- [ ] `ppt_template_structure_guide.md` 包含新功能说明
- [ ] API 端点文档已更新
- [x] 代码注释完整清晰

---

## 最终验证清单

- [x] 所有子任务检查项已完成
- [x] Python 语法检查通过
- [ ] 代码已提交到 Git
- [ ] 已推送到远程仓库
- [x] 功能测试通过
- [x] 模板 JSON 符合结构规范
- [ ] 导入的模板视觉效果与原 PPT 高度相似（需实际测试）
