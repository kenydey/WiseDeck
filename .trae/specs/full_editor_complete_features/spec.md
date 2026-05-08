
# 完整编辑器功能完善 Spec

## Why
当前完整编辑器只能预览幻灯片，无法进行编辑操作。用户需要在完整编辑器中能够选择元素、添加文本、添加形状、添加图表、添加表格等，实现完整的编辑功能。

## What Changes
- 实现iframe内元素的选择功能
- 实现元素的拖拽移动和调整大小功能
- 实现添加文本功能
- 实现添加形状功能
- 实现添加图表功能
- 实现添加表格功能
- 实现属性面板与选中元素的同步
- **BREAKING** 需要重构main.js以支持iframe内编辑

## Impact
- Affected specs: 完整编辑器所有功能
- Affected code: 
  - `src/wisedeck/web/static/js/pages/project/full_editor/main.js`
  - `src/wisedeck/web/static/css/pages/project/full_editor.css`

## ADDED Requirements

### Requirement: 元素选择功能
系统应该允许用户在iframe内点击选择元素，选中后显示选中状态边框和控制点。

#### Scenario: 选择文本元素
- **WHEN** 用户点击iframe内的文本元素
- **THEN** 该元素显示选中边框和控制点，属性面板显示该元素的属性

#### Scenario: 选择图片元素
- **WHEN** 用户点击iframe内的图片元素
- **THEN** 该元素显示选中边框和控制点，属性面板显示该元素的属性

### Requirement: 元素拖拽移动功能
系统应该允许用户拖拽选中的元素来移动位置。

#### Scenario: 拖拽移动元素
- **WHEN** 用户选中元素后拖拽
- **THEN** 元素跟随鼠标移动，释放后元素位置更新

### Requirement: 元素调整大小功能
系统应该允许用户通过拖拽控制点来调整元素大小。

#### Scenario: 调整元素大小
- **WHEN** 用户选中元素后拖拽边角控制点
- **THEN** 元素大小随之改变

### Requirement: 添加文本功能
系统应该允许用户在幻灯片中添加新的文本元素。

#### Scenario: 添加文本
- **WHEN** 用户点击"文本"工具后在画布上点击
- **THEN** 在点击位置创建新的文本元素，用户可以输入文本内容

### Requirement: 添加形状功能
系统应该允许用户在幻灯片中添加各种形状元素。

#### Scenario: 添加矩形
- **WHEN** 用户选择矩形形状后在画布上拖拽
- **THEN** 在拖拽区域创建矩形形状

### Requirement: 添加图表功能
系统应该允许用户在幻灯片中添加图表元素。

#### Scenario: 添加图表
- **WHEN** 用户点击"图表"工具后在画布上点击
- **THEN** 弹出图表编辑器，用户可以配置图表数据和样式

### Requirement: 添加表格功能
系统应该允许用户在幻灯片中添加表格元素。

#### Scenario: 添加表格
- **WHEN** 用户点击"表格"工具后在画布上点击
- **THEN** 创建默认表格，用户可以编辑表格内容

### Requirement: 属性面板同步
系统应该在属性面板中显示选中元素的属性，并允许用户修改。

#### Scenario: 修改文本属性
- **WHEN** 用户选中文本元素后在属性面板修改字体大小
- **THEN** 选中文本的字体大小立即更新

## MODIFIED Requirements

### Requirement: 工具栏按钮响应
工具栏按钮点击后应该激活对应的工具模式，并在画布上显示相应的交互提示。

## REMOVED Requirements
无
