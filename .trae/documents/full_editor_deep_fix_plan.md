# 完整编辑器数据传递问题深度修复计划

## 问题分析

页面显示"数据初始化中"，说明：
1. PPTist已加载但slidesStore.slides.length === 0
2. postMessage可能没有正确发送或接收
3. slidesData可能为空

## 关键检查点

### 1. 数据来源检查
模板中传递的slides数据：
```html
<script id="projectSlidesScript" type="application/json">{{ {'slides': project.slides_data or []}|tojson|safe }}</script>
```

如果project.slides_data为空，main.js中的this.slidesData也会为空。

### 2. postMessage发送检查
main.js中只有在slidesData.length > 0时才发送postMessage：
```javascript
if (this.slidesData && this.slidesData.length > 0) {
    iframe.contentWindow.postMessage({...}, '*');
}
```

### 3. postMessage接收检查
App.vue中的message监听器应该能接收到消息。

## 修复方案

### 方案1: 添加备选API获取数据

如果slidesData为空，通过API获取最新数据：

**修改 main.js**
```javascript
async fetchSlidesFromAPI() {
    if (!this.projectId) return;
    
    try {
        const response = await fetch(`/api/projects/${this.projectId}/slides-data`);
        if (response.ok) {
            const data = await response.json();
            if (data.slides_data && data.slides_data.length > 0) {
                this.slidesData = data.slides_data;
                console.log('[PPTistIFrameEditor] Fetched slides from API:', this.slidesData.length);
                return true;
            }
        }
    } catch (e) {
        console.error('[PPTistIFrameEditor] Failed to fetch slides:', e);
    }
    return false;
}
```

### 方案2: 添加调试日志

在关键位置添加日志，帮助定位问题。

### 方案3: 强制刷新JS缓存

更新main.js的版本号。

## 具体修改

### 修改1: main.js - 添加API获取作为备选

```javascript
async fetchSlidesFromAPI() {
    if (!this.projectId) {
        console.error('[PPTistIFrameEditor] No projectId for API fetch');
        return false;
    }
    
    try {
        console.log('[PPTistIFrameEditor] Fetching slides from API:', this.projectId);
        const response = await fetch(`/api/projects/${this.projectId}/slides-data`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            if (data.slides_data && data.slides_data.length > 0) {
                this.slidesData = data.slides_data;
                console.log('[PPTistIFrameEditor] Fetched slides from API:', this.slidesData.length);
                return true;
            } else {
                console.warn('[PPTistIFrameEditor] API returned empty slides');
            }
        } else {
            console.error('[PPTistIFrameEditor] API request failed:', response.status);
        }
    } catch (e) {
        console.error('[PPTistIFrameEditor] Failed to fetch slides from API:', e);
    }
    return false;
}

// 在iframe load事件中添加API获取作为备选
iframe.addEventListener('load', async () => {
    console.log('[PPTistIFrameEditor] IFrame loaded');
    this.iframeReady = true;

    if (this.slidesData && this.slidesData.length > 0) {
        console.log('[PPTistIFrameEditor] Sending slides via postMessage:', this.slidesData.length);
        iframe.contentWindow.postMessage({
            type: 'SYNC_SLIDES_TO_PPTIST',
            slides: this.slidesData,
            projectId: this.projectId,
            slideIndex: 0
        }, '*');
    } else {
        console.warn('[PPTistIFrameEditor] No slides data from template, trying API...');
        const fetched = await this.fetchSlidesFromAPI();
        if (fetched && this.slidesData && this.slidesData.length > 0) {
            console.log('[PPTistIFrameEditor] Sending fetched slides via postMessage:', this.slidesData.length);
            iframe.contentWindow.postMessage({
                type: 'SYNC_SLIDES_TO_PPTIST',
                slides: this.slidesData,
                projectId: this.projectId,
                slideIndex: 0
            }, '*');
        } else {
            console.error('[PPTistIFrameEditor] No slides data available');
        }
    }
});
```

### 修改2: 更新main.js版本号

```html
<script src="/static/js/pages/project/full_editor_iframe/main.js?v=2026050906"></script>
```

## 验证步骤

1. 打开完整编辑页面
2. 打开浏览器控制台
3. 检查日志：
   - `[PPTistIFrameEditor] Initializing...`
   - `[PPTistIFrameEditor] Loaded slides: X`
   - `[PPTistIFrameEditor] Sending slides via postMessage: X`
   - `[PPTist] Received SYNC_SLIDES_TO_PPTIST`
   - `[PPTist] Slides synced, current slides in store: X`
