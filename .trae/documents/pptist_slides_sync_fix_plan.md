# PPTist 完整编辑器加载项目幻灯片数据修复计划

## 问题分析

当前流程存在时序问题：

```
PPTist onMounted() 执行顺序：
1. 第50-51行：加载 mock 数据 → slidesStore.setSlides(slides)
2. 第57行：注册 postMessage 监听器

WiseDeck iframe.onload 执行顺序：
1. 调用 syncDataToPPTist()
2. 发送 SYNC_SLIDES_TO_PPTIST 消息
```

**问题**：PPTist 已加载默认模板后才接收外部数据，可能导致同步失败或数据不一致。

## 修复方案

### 方案一：延迟初始化 + 等待外部数据（推荐）

修改 `App.vue`，让 PPTist 在嵌入模式下等待接收外部数据：

```typescript
onMounted(async () => {
  if (isAudienceMode) {
    // 观众模式逻辑保持不变
  } else if (isEmbedMode) {
    // 嵌入模式：等待外部数据
    await waitForExternalData();
  } else {
    // 独立模式：加载 mock 数据
    const slides = await api.getMockData('slides');
    slidesStore.setSlides(slides);
  }
  // ...
});
```

### 方案二：强制覆盖模式

修改 postMessage 监听器，确保收到数据后强制更新：

```typescript
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_SLIDES_TO_PPTIST') {
    // 强制更新，不管之前是否有数据
    if (event.data.slides && event.data.slides.length > 0) {
      slidesStore.setSlides(event.data.slides);
      slidesStore.setSlideIndex(event.data.slideIndex || 0);
    }
  }
});
```

## 文件修改清单

| 文件 | 修改内容 |
|-----|---------|
| `src/PPTist/src/App.vue` | 修改 onMounted 逻辑，支持嵌入模式等待外部数据 |
| `full_editor_iframe/main.js` | 确保发送数据的时机正确 |

## 具体修改步骤

### 1. 修改 PPTist App.vue

```typescript
// 添加嵌入模式检测
const isEmbedMode = window.self !== window.top; // 判断是否在 iframe 中

onMounted(async () => {
  // 先注册消息监听器
  window.addEventListener('message', handleMessage);
  
  if (isAudienceMode) {
    slidesStore.setSlides([{
      id: nanoid(10),
      elements: [],
    }])
    screenStore.setScreening(true)
  } else if (isEmbedMode) {
    // 嵌入模式：等待外部数据
    await waitForSlidesData();
  } else {
    // 独立模式：加载 mock 数据
    const slides = await api.getMockData('slides');
    slidesStore.setSlides(slides);
    await deleteDiscardedDB();
    snapshotStore.initSnapshotDatabase();
  }
});

async function waitForSlidesData() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      // 超时回退到 mock 数据
      console.log('[PPTist] Timeout waiting for external data, using mock');
      loadMockData();
      resolve(null);
    }, 5000);

    function handleMessage(event) {
      if (event.data && event.data.type === 'SYNC_SLIDES_TO_PPTIST') {
        clearTimeout(timeout);
        window.removeEventListener('message', handleMessage);
        
        if (event.data.slides && Array.isArray(event.data.slides)) {
          slidesStore.setSlides(event.data.slides);
          if (event.data.slideIndex !== undefined) {
            slidesStore.slideIndex = event.data.slideIndex;
          }
        }
        
        deleteDiscardedDB();
        snapshotStore.initSnapshotDatabase();
        resolve(event.data);
      }
    }
    
    window.addEventListener('message', handleMessage);
  });
}

async function loadMockData() {
  const slides = await api.getMockData('slides');
  slidesStore.setSlides(slides);
  await deleteDiscardedDB();
  snapshotStore.initSnapshotDatabase();
}
```

### 2. 修改 full_editor_iframe/main.js

确保在 iframe 完全加载后再发送数据：

```javascript
syncDataToPPTist() {
    console.log('[PPTistIFrameEditor] Syncing data to PPTist...');

    // 即使没有 slides 数据也要发送消息，确保 PPTist 知道这是嵌入模式
    const message = {
        type: 'SYNC_SLIDES_TO_PPTIST',
        slides: this.slidesData,
        slideIndex: 0,
        projectId: this.projectId
    };

    this.sendMessage(message);
}
```

## 验证步骤

1. 修改 PPTist App.vue
2. 重新构建 PPTist（或手动复制修改后的文件）
3. 重启 WiseDeck 服务器
4. 打开项目编辑页面
5. 点击"完整编辑"按钮
6. 验证是否加载了项目的实际幻灯片数据

## 风险评估

| 风险 | 影响 | 缓解措施 |
|-----|-----|---------|
| 消息超时 | PPTist 回退到 mock 数据 | 设置合理超时时间（5秒） |
| 数据格式不兼容 | 同步失败 | 在 PPTist 中添加数据格式验证 |
| 跨域问题 | postMessage 失败 | 使用 `*` 作为 targetOrigin |
