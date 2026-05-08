
# 完整编辑器集成修复计划

## 问题分析

用户报告了完整编辑器的以下问题：
1. 点击"完整编辑"按钮后，新窗口显示"缺少项目ID"错误
2. 画布为空，没有显示PPT内容
3. 底部幻灯片缩略图区域为空
4. 在完整编辑器中保存后，修改不能同步回PPT编辑器页面

## 问题根源

### 1. 项目ID获取不一致
- PPT编辑器页面路径：`/projects/{project_id}/edit`（复数）
- 完整编辑器路由：`/project/{project_id}/full-editor`（单数）
- `openFullEditor()` 中的路径匹配使用复数，但后端路由使用单数

### 2. 幻灯片数据格式不匹配
- 现有代码期望的幻灯片数据格式与实际存储的格式不同
- 需要确保数据能够正确转换和显示

### 3. 主页面缺少消息监听
- 完整编辑器保存后会发送 `postMessage`，但主页面没有监听器接收

### 4. 缩略图渲染问题
- 需要确保缩略图容器ID正确，渲染逻辑正常

## 修复步骤

### 步骤1：修复项目ID获取逻辑
修改 `projectSlidesEditor.fullEditor.js`，确保项目ID正确获取

### 步骤2：验证完整编辑器数据加载
检查 `main.js` 中的 `loadProject()` 方法，确保数据来源正确

### 步骤3：在主编辑器页面添加消息监听器
修改 `projectSlidesEditor.init.js` 或相关文件，添加消息监听器

### 步骤4：验证缩略图渲染
检查 `main.js` 中的 `renderThumbnails()` 方法

## 文件修改清单

1. `src/wisedeck/web/static/js/pages/project/slides_editor/projectSlidesEditor.fullEditor.js`
2. `src/wisedeck/web/static/js/pages/project/full_editor/main.js`
3. `src/wisedeck/web/static/js/pages/project/slides_editor/projectSlidesEditor.init.js`

## 测试验证

1. 在PPT编辑器页面点击"完整编辑"按钮
2. 验证完整编辑器窗口正常打开并显示PPT内容
3. 验证底部缩略图正确显示
4. 在完整编辑器中修改并保存
5. 验证主页面接收到保存消息并刷新内容
