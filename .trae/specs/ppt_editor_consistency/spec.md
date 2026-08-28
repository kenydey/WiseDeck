# PPT编辑器与完整编辑器渲染一致性 - 产品需求文档

## Overview
- **Summary**: 实现PPT编辑器与完整编辑器(PPTist)幻灯片内容的完全一致性，确保用户在两个编辑器中看到相同的渲染效果。
- **Purpose**: 解决用户反馈的PPT编辑器和完整编辑器内容差距巨大的问题，提升用户体验。
- **Target Users**: 所有使用WiseDeck创建和编辑PPT的用户

## Goals
- [x] 确保PPT编辑器和完整编辑器显示完全相同的幻灯片内容
- [x] 梳理代码调用链，确保最新代码被正确调用
- [x] 修复HTML到PPTist格式转换中的样式丢失问题
- [x] 确保背景、字体、颜色、布局等样式正确传递

## Non-Goals (Out of Scope)
- 新增PPT编辑功能
- 修改PPTist前端组件
- 重构整体架构

## Background & Context
从用户提供的截图可以看出：
1. **PPT编辑器**显示完整设计模板（背景图、Logo、装饰元素、日期等）
2. **完整编辑器**只显示基本文本（标题和副标题），缺少样式和装饰元素

问题根源：HTML到PPTist的转换不完整，丢失了样式信息。

## Functional Requirements
- **FR-1**: 完整编辑器应正确显示幻灯片背景（图片、渐变、纯色）
- **FR-2**: 完整编辑器应正确显示字体样式（大小、颜色、粗细）
- **FR-3**: 完整编辑器应正确显示装饰元素（线条、形状、Logo）
- **FR-4**: 完整编辑器应正确显示布局结构（多列、定位）
- **FR-5**: 确保最新代码被调用，没有使用过时的接口

## Non-Functional Requirements
- **NFR-1**: 转换性能不应影响页面加载速度（<200ms）
- **NFR-2**: 向后兼容旧格式数据

## Constraints
- **Technical**: Python 3.11+, FastAPI, BeautifulSoup
- **Dependencies**: PPTist iframe组件（外部依赖）

## Assumptions
- [x] HTML模板包含完整的样式信息
- [x] PPTist支持所有需要的元素类型

## Acceptance Criteria

### AC-1: 背景样式一致性
- **Given**: PPT编辑器显示带有背景图片的幻灯片
- **When**: 用户打开完整编辑器
- **Then**: 完整编辑器显示相同的背景图片
- **Verification**: `human-judgment`

### AC-2: 字体样式一致性
- **Given**: PPT编辑器显示不同字体大小和颜色的文本
- **When**: 用户打开完整编辑器
- **Then**: 完整编辑器显示相同字体大小和颜色
- **Verification**: `human-judgment`

### AC-3: 装饰元素显示
- **Given**: PPT编辑器显示Logo、日期、装饰线条等元素
- **When**: 用户打开完整编辑器
- **Then**: 完整编辑器显示相同的装饰元素
- **Verification**: `human-judgment`

### AC-4: 转换性能
- **Given**: 项目包含10张幻灯片
- **When**: 用户打开完整编辑器
- **Then**: 页面在2秒内加载完成
- **Verification**: `programmatic`

### AC-5: 代码调用链验证
- **Given**: 系统运行中
- **When**: 用户访问完整编辑器
- **Then**: 后端日志显示调用最新的转换代码
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否有其他隐藏的样式需要支持？

---

# Implementation Plan

## Task 1: 梳理代码调用链，确认最新代码被调用
- **Priority**: P0
- **Depends On**: None
- **Description**: 分析完整编辑器的数据流，确认调用的是最新代码
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic`: 检查日志确认调用了`PPTistGenerationService.generate_pptist_slide`
  - `human-judgment`: 确认没有调用过时的转换函数

## Task 2: 增强HTML样式解析（背景、字体、颜色）
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 增强`_parse_html_styles`方法，提取完整样式信息
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `programmatic`: 解析包含CSS变量的HTML，验证提取的样式正确
  - `human-judgment`: 确认渐变背景和主题色被正确识别

## Task 3: 增强HTML内容解析（装饰元素）
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 增强`_parse_html_content`方法，解析装饰元素
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic`: 解析包含装饰线条和Logo的HTML
  - `human-judgment`: 确认装饰元素在PPTist中正确显示

## Task 4: 优化转换性能
- **Priority**: P1
- **Depends On**: Task 3
- **Description**: 优化HTML解析和转换逻辑，提升性能
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic`: 10张幻灯片转换时间<200ms
  - `human-judgment`: 页面加载流畅无卡顿

## Task 5: 端到端测试验证
- **Priority**: P0
- **Depends On**: Task 4
- **Description**: 测试多个项目，验证渲染一致性
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3
- **Test Requirements**:
  - `human-judgment`: 对比PPT编辑器和完整编辑器的渲染效果

---

# Verification Checklist
- [ ] 代码调用链确认：最新的`PPTistGenerationService`被调用
- [ ] 背景样式解析：支持纯色、渐变、图片背景
- [ ] 字体样式解析：支持字体大小、颜色、粗细
- [ ] 装饰元素解析：支持线条、形状、Logo等
- [ ] 转换性能：10张幻灯片转换<200ms
- [ ] 端到端测试：PPT编辑器和完整编辑器显示一致

