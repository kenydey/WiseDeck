# 完整编辑器数据传递问题修复计划

## 问题总结

完整编辑页面一直显示"正在加载中"（数据初始化中），无法加载幻灯片内容。用户已确认手动导入PPTX可以正常工作，说明PPTist核心功能正常。

## 当前状态分析

### 数据流程
1. 后端 `project_workspace_routes.py` → 获取 `project.slides_data`（WiseDeck格式）
2. 模板 `project_full_editor_iframe.html` → 嵌入到 `<script id="projectSlidesScript">`
3. main.js → 读取脚本内容，存入 `this.slidesData`
4. iframe加载后 → 存入 `localStorage` → PPTist轮询读取

### 问题定位
1. **localStorage跨域问题**：iframe和父页面虽然是同源，但存在时序问题
2. **数据格式转换**：WiseDeck格式需要转换为PPTist格式
3. **postMessage未被使用**：当前依赖localStorage，但localStorage可能未正确工作

### 关键文件
- `c:\dev\WiseDeck\src\wisedeck\web\static\js\pages\project\full_editor_iframe\main.js` - iframe通信
- `c:\dev\WiseDeck\src\PPTist\src\App.vue` - PPTist入口
- `c:\dev\WiseDeck\src\PPTist\src\utils\wiseDeckToPPTist.ts` - 格式转换
- `c:\dev\WiseDeck\src\wisedeck\web\templates\pages\project\project_full_editor_iframe.html` - iframe模板

## 修复方案

采用**直接postMessage发送数据**方案，替代localStorage传递。

### 修改1: main.js - 改用postMessage直接发送数据

**文件**: `c:\dev\WiseDeck\src\wisedeck\web\static\js\pages\project\full_editor_iframe\main.js`

**修改内容**:
1. 在iframe load事件中，**直接发送slides数据**而不是只发localStorage
2. 数据格式包含完整的slides数组
3. 移除对localStorage的依赖

### 修改2: App.vue - 接收postMessage数据并处理

**文件**: `c:\dev\WiseDeck\src\PPTist\src\App.vue`

**修改内容**:
1. 监听 `SYNC_SLIDES_TO_PPTIST` 消息类型
2. 直接使用传入的slides数据
3. 调用格式转换函数（如果需要）
4. 移除localStorage轮询逻辑（作为备用）

### 修改3: 数据格式确保一致性

确保发送的数据格式正确：
```javascript
{
  type: 'SYNC_SLIDES_TO_PPTIST',
  slides: slidesArray,  // WiseDeck格式
  projectId: projectId,
  slideIndex: 0
}
```

## 具体修改步骤

### 步骤1: 修改 main.js

将storeDataToLocalStorage方法改为直接postMessage：

```javascript
// iframe load事件处理
iframe.addEventListener('load', () => {
    console.log('[PPTistIFrameEditor] IFrame loaded');

    if (this.slidesData && this.slidesData.length > 0) {
        console.log('[PPTistIFrameEditor] Sending slides via postMessage:', this.slidesData.length);

        // 直接发送数据
        iframe.contentWindow.postMessage({
            type: 'SYNC_SLIDES_TO_PPTIST',
            slides: this.slidesData,
            projectId: this.projectId,
            slideIndex: 0
        }, '*');
    } else {
        console.warn('[PPTistIFrameEditor] No slides data to send');
    }
});
```

### 步骤2: 修改 App.vue

确保消息处理正确：

```javascript
window.addEventListener('message', (event: MessageEvent) => {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'SYNC_SLIDES_TO_PPTIST') {
        console.log('[PPTist] Received SYNC_SLIDES_TO_PPTIST');

        if (event.data.slides && Array.isArray(event.data.slides)) {
            const format = detectSlideFormat(event.data.slides);

            if (format === 'wisedeck') {
                const convertedSlides = convertWiseDeckSlidesToPPTist(event.data.slides);
                slidesStore.setSlides(convertedSlides);
            } else {
                slidesStore.setSlides(event.data.slides);
            }

            initialized.value = true;
            deleteDiscardedDB();
            snapshotStore.initSnapshotDatabase();
        }
    }
});
```

### 步骤3: 简化App.vue初始化逻辑

由于使用postMessage，可以简化初始化：
- 不再需要轮询localStorage
- iframe准备好后直接接收数据
- 保留localStorage作为fallback备用

### 步骤4: 重新构建PPTist

```bash
cd c:\dev\WiseDeck\src\PPTist
npm run build
```

## 验证步骤

1. 打开完整编辑页面 `/projects/{projectId}/full-editor`
2. 检查浏览器控制台日志：
   - `[PPTistIFrameEditor] IFrame loaded`
   - `[PPTistIFrameEditor] Sending slides via postMessage: X`
   - `[PPTist] Received SYNC_SLIDES_TO_PPTIST`
   - `[PPTist] Slides synced: X`
3. 确认幻灯片正确显示

## 预期结果

- 完整编辑页面打开后，幻灯片立即加载
- 不再显示"数据初始化中"
- 数据通过postMessage直接传递，无需等待localStorage
