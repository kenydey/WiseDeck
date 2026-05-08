# 完整编辑器修复计划

## 问题分析

### 1. 按钮无响应问题
**原因**：HTML 中部分按钮使用了内联 `onclick="editor.addTextElement()"` 事件，但 `editor` 变量在 DOMContentLoaded 之后才初始化。

### 2. 幻灯片缩略图显示问题
**原因**：`renderThumbnails()` 在初始化时调用，但 `slidesData` 可能未完全加载。

### 3. 预览页面过大问题
**原因**：`.slide-frame-wrapper` 使用固定尺寸 1280x720，未自适应容器。

### 4. 功能按钮未响应
**原因**：`sendToIframe()` 在 iframe 未就绪时发送消息失败。

## 修复方案

### 任务 1：修复按钮事件绑定
- 移除 HTML 中的内联 onclick 事件
- 在 JS 中统一绑定所有按钮事件

### 任务 2：修复幻灯片数据加载
- 确保 `slidesData` 在渲染缩略图前已加载完成
- 添加数据加载状态检查

### 任务 3：修复预览页面布局
- 修改 CSS，使预览区域自适应容器大小
- 添加滚动条支持

### 任务 4：修复 iframe 通信
- 添加 iframe 就绪状态检查
- 改进消息队列机制

### 任务 5：测试验证所有功能

## 文件修改

### 修改文件列表
1. `src/wisedeck/web/templates/pages/project/project_full_editor.html`
2. `src/wisedeck/web/static/js/pages/project/full_editor/main.js`
3. `src/wisedeck/web/static/css/pages/project/full_editor.css`

## 实施步骤

1. **修改 HTML**：移除内联 onclick 事件
2. **修改 JS**：
   - 修复事件绑定逻辑
   - 添加数据加载检查
   - 改进 iframe 通信机制
3. **修改 CSS**：调整预览区域布局
4. **测试验证**：确保所有功能正常工作