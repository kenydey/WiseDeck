# 完整编辑器升级方案 - 基于 PPTist IFrame 集成

## 方案概述

采用 **IFrame 微前端架构 + 跨窗口状态同步 (postMessage)** 方案，将 PPTist 完美集成到 WiseDeck 中。

### 核心思路
1. 将 PPTist 作为独立的 Vue3 应用打包
2. 在 WiseDeck 完整编辑页面中通过 IFrame 嵌入 PPTist
3. 通过 postMessage 实现数据双向同步
4. 不改变 WiseDeck 现有技术栈，实现像素级一致的编辑体验

## 当前状态分析

### 已完成
- [x] PPTist 源码已放置在 `src/PPTist/` 目录
- [x] WiseDeck 基础架构完善
- [x] PPT 编辑器页面已完成

### 待完成
- [ ] 配置 PPTist 的 Vite 打包输出到 WiseDeck static 目录
- [ ] 改造 PPTist 的跨窗口通信逻辑（postMessage）
- [ ] 创建 WiseDeck 完整编辑 IFrame 页面
- [ ] 实现数据双向同步
- [ ] 测试验证

## 实施计划

### 阶段一：PPTist 打包配置

#### 1.1 修改 vite.config.ts
- 设置 `base: '/static/pptist_dist/'`
- 设置 `build.outDir: '../wisedeck/web/static/pptist_dist'`

#### 1.2 创建输出目录
- 在 `src/wisedeck/web/static/` 下创建 `pptist_dist/` 目录

### 阶段二：PPTist 跨窗口通信改造

#### 2.1 修改 App.vue
添加 postMessage 监听：
```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'SYNC_SLIDES_TO_PPTIST') {
    slidesStore.setSlides(event.data.slides);
    if (event.data.slideIndex !== undefined) {
      slidesStore.setSlideIndex(event.data.slideIndex);
    }
  }
});
```

#### 2.2 修改 EditorHeader/index.vue
添加"保存并返回"按钮：
```javascript
const saveAndReturn = () => {
  window.parent.postMessage({
    type: 'SAVE_SLIDES_FROM_PPTIST',
    slides: JSON.parse(JSON.stringify(slidesStore.slides))
  }, '*');
};
```

### 阶段三：WiseDeck IFrame 页面

#### 3.1 创建完整编辑模板
文件：`src/wisedeck/web/templates/pages/project/project_full_editor_iframe.html`

结构：
- 全屏 Modal 容器
- IFrame 嵌入 PPTist
- postMessage 通信逻辑

#### 3.2 创建完整编辑 JS
文件：`src/wisedeck/web/static/js/pages/project/full_editor_iframe/main.js`

功能：
- 打开/关闭 Modal
- 数据注入到 PPTist
- 接收 PPTist 回传的数据
- 更新 WiseDeck 视图

### 阶段四：数据格式转换（如需要）

#### 4.1 WiseDeck 数据格式
```json
{
  "slides_data": [
    {
      "id": "slide_xxx",
      "html_content": "<html>..."
    }
  ]
}
```

#### 4.2 PPTist 数据格式
```json
{
  "slides": [
    {
      "id": "slide_xxx",
      "elements": [...]
    }
  ]
}
```

#### 4.3 转换策略
- 导入时：将 WiseDeck HTML 转换为 PPTist JSON
- 导出时：将 PPTist JSON 转换回 WiseDeck HTML

## 文件清单

### 需要修改的文件

1. **src/PPTist/vite.config.ts**
   - 修改 base 路径
   - 修改输出目录

2. **src/PPTist/src/App.vue**
   - 添加 postMessage 监听

3. **src/PPTist/src/views/Editor/EditorHeader/index.vue**
   - 添加保存并返回按钮

### 需要创建的文件

4. **src/wisedeck/web/templates/pages/project/project_full_editor_iframe.html**
   - IFrame 页面模板

5. **src/wisedeck/web/static/js/pages/project/full_editor_iframe/main.js**
   - IFrame 通信逻辑

6. **src/wisedeck/web/static/css/pages/project/full_editor_iframe.css**
   - IFrame 页面样式

### 需要创建的工具文件

7. **src/wisedeck/web/static/js/pages/project/full_editor_iframe/dataConverter.js**
   - WiseDeck HTML 与 PPTist JSON 互转

## 实施步骤

### 步骤 1：修改 PPTist Vite 配置
- 修改 vite.config.ts
- 运行 npm install（如需要）

### 步骤 2：改造 PPTist 通信
- 修改 App.vue 添加监听
- 修改 EditorHeader 添加保存按钮

### 步骤 3：创建 WiseDeck IFrame 页面
- 创建 HTML 模板
- 创建 JS 通信逻辑
- 创建 CSS 样式

### 步骤 4：创建数据转换器
- 实现 HTML → PPTist JSON
- 实现 PPTist JSON → HTML

### 步骤 5：打包 PPTist
- 进入 src/PPTist 目录
- 运行 npm install
- 运行 npm run build

### 步骤 6：测试验证
- 启动 WiseDeck
- 打开完整编辑功能
- 测试数据同步

## 技术要点

### IFrame 通信协议

**WiseDeck → PPTist:**
```javascript
{
  type: 'SYNC_SLIDES_TO_PPTIST',
  slides: [...],      // PPTist JSON 格式
  slideIndex: 0,      // 当前页面索引
  projectId: 'xxx'     // 项目ID（可选）
}
```

**PPTist → WiseDeck:**
```javascript
{
  type: 'SAVE_SLIDES_FROM_PPTIST',
  slides: [...],      // PPTist JSON 格式
  projectId: 'xxx'    // 项目ID
}
```

### 样式隔离
- IFrame 完美隔离 PPTist 样式
- 无需担心 CSS 污染
- 可单独升级 PPTist

### 状态管理
- PPTist 保持独立的 Pinia Store
- WiseDeck 保持独立的状态
- 仅在需要时同步数据

## 风险与注意事项

1. **CORS 问题**：确保 postMessage 使用 '*' 作为目标源
2. **数据格式**：确保 WiseDeck 和 PPTist 数据格式兼容
3. **性能考虑**：大数据量时注意传输效率
4. **错误处理**：添加适当的错误处理逻辑
