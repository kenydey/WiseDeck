# PPT编辑器与完整编辑器渲染一致性 - 实现计划

## [x] Task 1: 梳理代码调用链，确认最新代码被调用
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 分析完整编辑器的数据流向
  - 确认调用的是最新的`PPTistGenerationService`
  - 检查是否有过时的代码被调用
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic`: 检查日志确认调用了`PPTistGenerationService.generate_pptist_slide`
  - `human-judgment`: 确认没有调用过时的转换函数
- **Notes**: 需要查看`project_workspace_routes.py`中的调用逻辑

## [x] Task 2: 增强HTML样式解析（背景、字体、颜色）
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 增强`_parse_html_styles`方法，提取CSS变量
  - 支持渐变背景解析
  - 提取主题颜色和字体样式
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `programmatic`: 解析包含CSS变量的HTML，验证提取的样式正确
  - `human-judgment`: 确认渐变背景和主题色被正确识别
- **Notes**: 修改文件`pptist_generation_service.py`

## [x] Task 3: 增强HTML内容解析（装饰元素）
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 增强`_parse_html_content`方法
  - 添加标题(h1,h2)解析
  - 添加表格和装饰元素解析
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic`: 解析包含装饰线条和Logo的HTML
  - `human-judgment`: 确认装饰元素在PPTist中正确显示
- **Notes**: 修改文件`pptist_generation_service.py`

## [x] Task 4: 添加背景图片支持
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 解析HTML中的背景图片
  - 创建PPTist背景图片元素
  - 处理图片URL路径
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic`: 解析包含背景图片的HTML
  - `human-judgment`: 背景图片在PPTist中正确显示
- **Notes**: 需要处理CSS background-image属性

## [x] Task 5: 添加装饰元素支持（Logo、日期、线条）
- **Priority**: P0
- **Depends On**: Task 4
- **Description**: 
  - 解析HTML中的Logo元素
  - 解析日期和装饰线条
  - 创建PPTist形状和文本元素
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic`: 解析包含装饰元素的HTML
  - `human-judgment`: 装饰元素在PPTist中正确显示
- **Notes**: 需要识别常见的装饰元素模式

## [ ] Task 6: 端到端测试验证
- **Priority**: P0
- **Depends On**: Task 5
- **Description**: 
  - 测试多个项目验证渲染一致性
  - 对比PPT编辑器和完整编辑器效果
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3
- **Test Requirements**:
  - `human-judgment`: 对比PPT编辑器和完整编辑器的渲染效果
- **Notes**: 需要用户参与验证

