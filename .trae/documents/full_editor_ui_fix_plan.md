
# 完整编辑器UI布局修复计划

## 问题分析

从用户提供的截图来看，完整编辑器界面存在以下问题：

1. **UI元素重叠** - 工具栏按钮重复显示，布局混乱
2. **画布显示异常** - 画布区域显示为黑色大圆角矩形，没有正确渲染幻灯片内容
3. **布局结构问题** - 整体布局错乱，元素位置不正确

## 问题根源

### 1. CSS样式冲突
HTML模板中同时引入了两个CSS文件：
- `project_slides_editor.css`（主编辑器样式）
- `full_editor.css`（完整编辑器样式）

这两个样式文件可能存在冲突，导致布局混乱。

### 2. 缺少基础布局样式
`full_editor.css` 只包含了元素样式，但缺少整体布局的关键样式（header、main、footer等）。

### 3. 画布初始化问题
画布区域显示为黑色，可能是因为：
- 背景色设置错误
- CanvasManager初始化问题
- 幻灯片数据未正确加载

## 修复步骤

### 步骤1：修复HTML模板的CSS引入
移除与主编辑器的CSS冲突，只保留完整编辑器需要的样式。

### 步骤2：添加完整编辑器的布局样式
补充header、main、footer等关键布局样式。

### 步骤3：修复画布初始化
确保CanvasManager正确初始化，画布区域正确显示。

### 步骤4：验证数据加载
确保幻灯片数据正确加载并渲染。

## 文件修改清单

1. `src/wisedeck/web/templates/pages/project/project_full_editor.html`
   - 修复CSS引入
   - 确保HTML结构正确

2. `src/wisedeck/web/static/css/pages/project/full_editor.css`
   - 添加完整的布局样式

3. `src/wisedeck/web/static/js/pages/project/full_editor/main.js`
   - 修复Canvas初始化逻辑

## 测试验证

1. 打开完整编辑器页面
2. 验证工具栏布局正常（无重叠）
3. 验证画布区域正确显示白色背景
4. 验证幻灯片内容正确渲染
5. 验证缩略图区域正常显示
