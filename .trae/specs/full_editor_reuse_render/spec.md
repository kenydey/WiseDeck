
# 完整编辑器复用PPT渲染器方案 - 产品需求文档

## Overview
- **Summary**: 重构完整编辑器，使其复用PPT编辑器的渲染逻辑，保持两者预览效果完全一致
- **Purpose**: 解决完整编辑器与PPT编辑器渲染不一致的问题，提升用户体验
- **Target Users**: 使用WiseDeck进行PPT编辑的用户

## Goals
- 完整编辑器直接调用PPT编辑器的渲染接口/组件
- 保持完整编辑器与PPT编辑器的预览效果完全一致
- 缩略图移到左侧（与PPT编辑器一致）
- 保持完整编辑的功能模块（工具栏、属性面板等）

## Non-Goals (Out of Scope)
- 不修改PPT编辑器的核心渲染逻辑
- 不改变数据存储格式
- 不涉及性能优化（除非必要）

## Background & Context
当前问题：
1. PPT编辑器使用iframe渲染幻灯片（slideFrame）
2. 完整编辑器使用独立的CanvasManager渲染
3. 两者渲染逻辑不同，导致预览效果不一致

用户期望：
1. 完整编辑器复用PPT编辑器的渲染方式
2. 界面布局与PPT编辑器保持一致（缩略图在左侧）
3. 只添加完整编辑特有的功能（如元素编辑、属性面板等）

## Functional Requirements
- **FR-1**: 完整编辑器使用与PPT编辑器相同的渲染方式
- **FR-2**: 缩略图显示在左侧（与PPT编辑器一致）
- **FR-3**: 保持完整编辑的功能（元素选择、拖拽、属性编辑等）
- **FR-4**: 保存后同步更新PPT编辑器

## Non-Functional Requirements
- **NFR-1**: 渲染性能不受影响
- **NFR-2**: 兼容性保持不变

## Constraints
- **Technical**: 复用现有代码，最小化改动
- **Dependencies**: 依赖PPT编辑器的渲染组件

## Assumptions
- PPT编辑器的渲染逻辑可以被独立封装和复用
- 数据格式兼容

## Acceptance Criteria

### AC-1: 渲染效果一致
- **Given**: 打开PPT编辑器和完整编辑器
- **When**: 查看同一幻灯片
- **Then**: 两者预览效果完全一致
- **Verification**: `human-judgment`

### AC-2: 缩略图在左侧
- **Given**: 打开完整编辑器
- **When**: 页面加载完成
- **Then**: 缩略图显示在左侧（与PPT编辑器一致）
- **Verification**: `human-judgment`

### AC-3: 元素编辑功能正常
- **Given**: 打开完整编辑器
- **When**: 编辑幻灯片元素
- **Then**: 元素可选中、拖拽、调整大小
- **Verification**: `human-judgment`

### AC-4: 保存同步正常
- **Given**: 在完整编辑器中保存修改
- **When**: 返回PPT编辑器
- **Then**: 修改内容已同步更新
- **Verification**: `human-judgment`

## Open Questions
- [ ] PPT编辑器的渲染逻辑是否可以独立封装？
- [ ] iframe渲染方式如何与元素编辑功能结合？
