
# 完整编辑器幻灯片渲染修复 - 产品需求文档

## Overview
- **Summary**: 修复完整编辑器中幻灯片内容渲染不正确的问题，包括文本重复显示、元素位置错误等问题
- **Purpose**: 确保点击"完整编辑"后，幻灯片内容能够正确、完整地渲染显示
- **Target Users**: 使用WiseDeck进行PPT编辑的用户

## Goals
- 修复文本元素重复显示的问题
- 修复文本元素位置计算错误的问题
- 修复缩略图渲染不完整的问题
- 确保幻灯片内容完整正确地加载和显示

## Non-Goals (Out of Scope)
- 不涉及新功能开发
- 不修改核心数据结构
- 不涉及性能优化

## Background & Context
从截图观察到：
1. 文本元素重复显示多次
2. 文本元素位置呈斜线排列，位置计算错误
3. 缩略图区域显示但内容不完整

这些问题可能源于：
1. `convertHtmlToElements` 方法解析HTML时重复提取文本
2. 元素位置计算逻辑错误
3. 缩略图渲染逻辑问题

## Functional Requirements
- **FR-1**: 幻灯片文本内容正确显示，不重复
- **FR-2**: 幻灯片元素位置正确，按照原始布局显示
- **FR-3**: 幻灯片缩略图正确显示各页面内容
- **FR-4**: 图片元素正确渲染显示

## Non-Functional Requirements
- **NFR-1**: 渲染性能不受影响
- **NFR-2**: 兼容性保持不变

## Constraints
- **Technical**: 使用现有代码结构，不重构核心架构
- **Dependencies**: 依赖现有的数据加载和渲染机制

## Assumptions
- 后端API返回的数据格式正确
- 幻灯片数据已正确存储在数据库中

## Acceptance Criteria

### AC-1: 文本元素不重复显示
- **Given**: 打开完整编辑器
- **When**: 幻灯片数据加载完成
- **Then**: 每个文本内容只显示一次
- **Verification**: `human-judgment`

### AC-2: 元素位置正确
- **Given**: 打开完整编辑器
- **When**: 幻灯片渲染完成
- **Then**: 元素按照原始布局正确显示，没有斜线排列
- **Verification**: `human-judgment`

### AC-3: 缩略图完整显示
- **Given**: 打开完整编辑器
- **When**: 缩略图渲染完成
- **Then**: 每个幻灯片缩略图正确显示页面内容预览
- **Verification**: `human-judgment`

### AC-4: 图片正确显示
- **Given**: 打开完整编辑器
- **When**: 幻灯片渲染完成
- **Then**: 图片元素正确显示在画布上
- **Verification**: `human-judgment`

## Open Questions
- [ ] 确认HTML解析逻辑是否正确处理嵌套标签
- [ ] 确认元素位置计算是否使用正确的坐标系统
