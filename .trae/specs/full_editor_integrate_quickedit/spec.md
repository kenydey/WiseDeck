
# 完整编辑器集成快编功能 Spec

## Why
当前完整编辑器的功能按钮无法正常工作，需要复用PPT编辑器中已实现的快编功能。快编功能已经在PPT编辑器中完整实现并正常工作，包括元素选择、拖拽、调整大小、样式编辑等功能。

## What Changes
- 复用快编功能的所有前端代码和逻辑
- 复用快编功能的后端API调用
- 确保完整编辑器的iframe内编辑功能与快编完全一致

## Impact
- Affected specs: 完整编辑器所有编辑功能
- Affected code: 
  - `src/wisedeck/web/static/js/pages/project/full_editor/main.js`
  - 快编中的所有JS文件

## 快编功能清单

### 1. 元素选择功能 (projectSlidesEditor.quickEdit.js)
- `initEditableElements()` - 初始化可编辑元素
- `canDirectEditElement()` - 检查元素是否可编辑
- `selectQuickEditElement()` - 选择元素
- `deselectQuickEditElement()` - 取消选择
- `makeElementDirectlyEditable()` - 进入文字编辑模式
- `finishDirectEdit()` - 结束文字编辑

### 2. 元素拖拽和调整大小 (projectSlidesEditor.quickEditActions.js)
- `startDrag()` - 开始拖拽
- `handleDrag()` - 处理拖拽
- `stopDrag()` - 停止拖拽
- `addResizeHandles()` - 添加调整大小手柄
- `startResize()` - 开始调整大小
- `handleResize()` - 处理调整大小
- `stopResize()` - 停止调整大小

### 3. 样式编辑 (projectSlidesEditor.quickEditStyling.js)
- `quickEditIncreaseFontSize()` - 增大字体
- `quickEditDecreaseFontSize()` - 减小字体
- `quickEditToggleBold()` - 切换粗体
- `quickEditToggleItalic()` - 切换斜体
- `quickEditToggleUnderline()` - 切换下划线
- `quickEditSetFontColor()` - 设置字体颜色
- `quickEditSetBgColor()` - 设置背景颜色
- `updateStyleButtonStates()` - 更新样式按钮状态

### 4. 撤销/重做 (projectSlidesEditor.quickEditActions.js)
- `saveStateForUndo()` - 保存撤销状态
- `quickEditUndo()` - 撤销
- `quickEditRedo()` - 重做
- `applyHtmlState()` - 应用HTML状态

### 5. 元素操作 (projectSlidesEditor.quickEditActions.js)
- `quickEditDelete()` - 删除元素
- `quickEditDuplicate()` - 复制元素
- `quickEditMoveUp()` - 上移层级
- `quickEditMoveDown()` - 下移层级
- `quickEditAlignLeft()` - 左对齐
- `quickEditAlignCenter()` - 居中对齐
- `quickEditAlignRight()` - 右对齐
- `quickEditMoveSelectedElementByKeyboard()` - 键盘方向键移动

### 6. 快捷键支持
- `handleQuickEditKeyboardShortcuts()` - 处理键盘快捷键
- Ctrl+Z: 撤销
- Ctrl+Y: 重做
- Delete: 删除元素
- Arrow keys: 移动元素
- Escape: 取消选择

## 技术方案
1. 将快编相关的JS文件作为依赖引入完整编辑器
2. 初始化快编模式，启用编辑功能
3. 确保iframe内的事件处理正常工作
4. 复用保存和加载逻辑
