
# 完整编辑器复用PPT渲染器方案 - 实现计划

## [x] Task 1: 修改HTML模板，使用iframe渲染幻灯片
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 `project_full_editor.html`，使用iframe渲染幻灯片（与PPT编辑器一致）
  - 将缩略图移到左侧（与PPT编辑器一致）
  - 保留完整编辑的工具栏和属性面板
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `human-judgement` TR-1.1: 打开完整编辑器，确认使用iframe渲染
  - `human-judgement` TR-1.2: 确认缩略图在左侧显示
- **Notes**: 参考PPT编辑器的slideFrame实现方式

## [x] Task 2: 实现iframe内容操作逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修改 `main.js`，通过JavaScript操作iframe内容
  - 实现元素选择、拖拽、调整大小等编辑功能
  - 实现幻灯片切换功能
- **Acceptance Criteria Addressed**: AC-1, AC-3
- **Test Requirements**:
  - `human-judgement` TR-2.1: 确认可以选中iframe中的元素
  - `human-judgement` TR-2.2: 确认可以拖拽移动元素
  - `human-judgement` TR-2.3: 确认可以调整元素大小
- **Notes**: 需要处理iframe跨域问题，使用srcdoc避免跨域

## [x] Task 3: 实现属性面板同步更新
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 实现选中元素时属性面板显示元素属性
  - 实现属性面板编辑后同步更新iframe中的元素
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgement` TR-3.1: 选中元素时属性面板正确显示属性
  - `human-judgement` TR-3.2: 修改属性后iframe中的元素同步更新
- **Notes**: 需要监听iframe中的DOM变化

## [x] Task 4: 实现保存功能
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 实现从iframe中提取HTML内容
  - 实现保存到后端API
  - 实现postMessage通知PPT编辑器同步
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgement` TR-4.1: 保存功能正常工作
  - `human-judgement` TR-4.2: PPT编辑器接收到保存消息后同步更新
- **Notes**: 需要正确提取iframe中的HTML内容

## [x] Task 5: 更新CSS样式
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 更新 `full_editor.css`，适配新的布局（左侧缩略图）
  - 确保样式与PPT编辑器保持一致
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `human-judgement` TR-5.1: 界面布局与PPT编辑器一致
  - `human-judgement` TR-5.2: 样式美观，无布局错乱
- **Notes**: 参考PPT编辑器的CSS样式

## [x] Task 6: 端到端测试验证
- **Priority**: P2
- **Depends On**: Task 1, 2, 3, 4, 5
- **Description**: 
  - 整体测试完整编辑器功能
  - 确保所有修复生效，渲染效果与PPT编辑器一致
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgement` TR-6.1: 完整测试完整编辑器的所有功能
  - `human-judgement` TR-6.2: 确认渲染效果与PPT编辑器一致
