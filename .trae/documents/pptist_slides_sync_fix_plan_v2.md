# PPTist 完整编辑器加载项目数据修复计划 v2

## 问题分析

当前日志显示：
```
INFO:     127.0.0.1:8926 - "GET /projects/.../full-editor HTTP/1.1" 200 OK
INFO:     127.0.0.1:8926 - "GET /static/js/pages/project/full_editor_iframe/main.js HTTP/1.1" 304 Not Modified
```

页面加载成功（200），但 PPTist 可能仍然显示默认模板。

### 根本原因

1. **`waitForSlidesData()` 有 5 秒超时** - 如果消息延迟到达，PPTist 会回退到加载 mock 数据
2. **消息可能未正确发送** - 需要检查 `iframe.onload` 时机
3. **浏览器缓存** - `main.js` 返回 304，需要添加版本号强制刷新

## 修复方案

### 1. 移除 PPTist 超时机制（核心修复）

修改 `App.vue`，嵌入模式下移除超时限制：

```typescript
async function waitForSlidesData() {
  return new Promise((resolve) => {
    // 移除超时机制，无限等待外部数据
    
    function handleMessage(event) {
      if (event.data && event.data.type === 'SYNC_SLIDES_TO_PPTIST') {
        window.removeEventListener('message', handleMessage);
        
        if (event.data.slides && event.data.slides.length > 0) {
          slidesStore.setSlides(event.data.slides);
          console.log('[PPTist] Slides synced from WiseDeck:', event.data.slides.length);
        }
        if (event.data.slideIndex !== undefined) {
          slidesStore.slideIndex = event.data.slideIndex;
        }
        
        deleteDiscardedDB();
        snapshotStore.initSnapshotDatabase();
        resolve(event.data);
      }
    }
    
    window.addEventListener('message', handleMessage);
  });
}
```

### 2. 添加 iframe 就绪信号

修改 `main.js`，在 iframe 完全加载后发送就绪信号：

```javascript
const iframe = document.getElementById('pptist-iframe');
if (iframe) {
    iframe.addEventListener('load', () => {
        console.log('[PPTistIFrameEditor] IFrame loaded');
        this.iframeReady = true;
        
        // 发送就绪信号，告知 PPTist 可以接收数据了
        setTimeout(() => {
            this.syncDataToPPTist();
        }, 100);
    });
}
```

### 3. 强制刷新浏览器缓存

修改 `project_full_editor_iframe.html`，添加版本号：

```html
<script src="/static/js/pages/project/full_editor_iframe/main.js?v=2026050901"></script>
```

## 文件修改清单

| 文件 | 修改内容 |
|-----|---------|
| `src/PPTist/src/App.vue` | 移除 `waitForSlidesData()` 的超时机制 |
| `full_editor_iframe/main.js` | 添加延迟发送确保 iframe 就绪 |
| `project_full_editor_iframe.html` | 添加版本号强制刷新 |

## 验证步骤

1. 修改 App.vue - 移除超时
2. 修改 main.js - 添加延迟发送
3. 修改 HTML - 添加版本号
4. 重新构建 PPTist（或手动复制）
5. 清除浏览器缓存（Ctrl+Shift+Delete）
6. 重启 WiseDeck 服务器
7. 测试完整编辑器功能

## 关键日志检查

测试时请打开浏览器控制台，检查以下日志：
- `[PPTistIFrameEditor] IFrame loaded` - iframe 加载完成
- `[PPTistIFrameEditor] Sending message to PPTist` - 消息已发送
- `[PPTist] Running in embed mode, waiting for external data...` - PPTist 进入等待模式
- `[PPTist] Slides synced from WiseDeck:` - 数据同步成功
