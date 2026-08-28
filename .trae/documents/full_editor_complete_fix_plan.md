# 完整编辑器彻底修复计划

## 问题根源分析

### 1. 缓存问题（最可能）
- 浏览器缓存了旧的PPTist JS文件（即使有内容哈希）
- 304 Not Modified响应说明浏览器使用了缓存

### 2. 数据传递问题
- postMessage可能被浏览器安全策略阻止
- slides_data可能为空

### 3. 解决方案策略

采用**三重保障方案**：

---

## 方案一：禁用静态文件缓存（最关键）

### 修改：添加静态文件缓存控制

在后端为 `/static/pptist_dist/` 路径添加 `Cache-Control: no-cache` 响应头。

**文件**: `c:\dev\WiseDeck\src\wisedeck\web\route_modules\support.py` 或类似的静态文件服务配置

```python
# 在静态文件路由中添加缓存控制
@app.get("/static/pptist_dist/{path:path}")
async def serve_pptist_static(request: Request, path: str):
    file_path = Path("web/static/pptist_dist") / path
    if not file_path.exists():
        raise HTTPException(status_code=404)
    
    response = FileResponse(str(file_path))
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response
```

---

## 方案二：修改PPTist构建配置（强制新哈希）

### 修改：vite.config.ts

强制每次构建生成新的哈希文件名，即使内容相同：

```typescript
build: {
  outDir: '../wisedeck/web/static/pptist_dist',
  emptyOutDir: true,
  chunkSizeWarningLimit: 4000,
  rollupOptions: {
    output: {
      // 使用时间戳确保每次构建都生成新文件名
      entryFileNames: `assets/[name]-${Date.now()}-[hash].js`,
      chunkFileNames: `assets/[name]-${Date.now()}-[hash].js`,
      assetFileNames: `assets/[name]-${Date.now()}-[hash].[ext]`,
      manualChunks(id) {
        // ... 保持不变
      }
    }
  }
}
```

---

## 方案三：备用数据传递方式（URL参数）

如果postMessage失败，使用URL参数传递项目ID，让PPTist自己从API获取数据。

### 修改1: project_full_editor_iframe.html

```html
<iframe id="pptist-iframe"
        src="/static/pptist_dist/index.html?projectId={{ project.project_id }}&v={{ cache_bust }}"
        class="pptist-iframe"
        allow="fullscreen"></iframe>
```

### 修改2: App.vue

添加从URL参数获取项目ID并调用API的逻辑：

```typescript
onMounted(async () => {
  console.log('[PPTist] App mounted, isEmbedMode:', isEmbedMode);

  // 尝试从URL参数获取项目ID
  const urlParams = new URLSearchParams(window.location.search)
  const projectIdFromUrl = urlParams.get('projectId')
  
  if (isEmbedMode && projectIdFromUrl) {
    console.log('[PPTist] Found projectId in URL:', projectIdFromUrl)
    
    // 尝试从API获取数据
    try {
      const response = await fetch(`/api/projects/${projectIdFromUrl}/slides-data`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.slides_data && data.slides_data.length > 0) {
          console.log('[PPTist] Loaded slides from API:', data.slides_data.length)
          const format = detectSlideFormat(data.slides_data)
          if (format === 'wisedeck') {
            const convertedSlides = convertWiseDeckSlidesToPPTist(data.slides_data)
            slidesStore.setSlides(convertedSlides)
          } else {
            slidesStore.setSlides(data.slides_data)
          }
          initialized.value = true
          deleteDiscardedDB()
          snapshotStore.initSnapshotDatabase()
          return // 成功加载，不再监听postMessage
        }
      }
    } catch (e) {
      console.error('[PPTist] Failed to load from API:', e)
    }
  }

  // 继续使用postMessage作为备选
  window.addEventListener('message', (event: MessageEvent) => {
    // ... 现有逻辑
  })
  
  // embed模式下等待postMessage
  if (isEmbedMode) {
    console.log('[PPTist] Running in embed mode, waiting for postMessage...')
  }
})
```

---

## 方案四：添加详细调试日志

在关键位置添加日志，帮助定位问题。

### 修改: main.js

```javascript
bindEvents() {
    console.log('[PPTistIFrameEditor] Binding events...');

    const iframe = document.getElementById('pptist-iframe');
    if (iframe) {
        console.log('[PPTistIFrameEditor] iframe found:', iframe.src);
        
        iframe.addEventListener('load', async () => {
            console.log('[PPTistIFrameEditor] IFrame loaded');
            console.log('[PPTistIFrameEditor] slidesData length:', this.slidesData?.length);
            console.log('[PPTistIFrameEditor] projectId:', this.projectId);
            this.iframeReady = true;

            if (this.slidesData && this.slidesData.length > 0) {
                console.log('[PPTistIFrameEditor] Sending slides via postMessage...');
                try {
                    iframe.contentWindow.postMessage({
                        type: 'SYNC_SLIDES_TO_PPTIST',
                        slides: this.slidesData,
                        projectId: this.projectId,
                        slideIndex: 0
                    }, '*');
                    console.log('[PPTistIFrameEditor] Message sent successfully');
                } catch (e) {
                    console.error('[PPTistIFrameEditor] Failed to send message:', e);
                }
            } else {
                console.warn('[PPTistIFrameEditor] No slides data from template, trying API...');
                const fetched = await this.fetchSlidesFromAPI();
                if (fetched) {
                    console.log('[PPTistIFrameEditor] Sending fetched slides...');
                    iframe.contentWindow.postMessage({
                        type: 'SYNC_SLIDES_TO_PPTIST',
                        slides: this.slidesData,
                        projectId: this.projectId,
                        slideIndex: 0
                    }, '*');
                } else {
                    console.error('[PPTistIFrameEditor] No slides data available!');
                }
            }
        });
    } else {
        console.error('[PPTistIFrameEditor] iframe not found!');
    }
}
```

---

## 实施步骤

### 步骤1: 添加静态文件缓存控制
修改后端路由配置，为pptist_dist添加no-cache响应头

### 步骤2: 修改PPTist构建配置
修改vite.config.ts，使用时间戳强制生成新文件名

### 步骤3: 重新构建PPTist
```bash
cd c:\dev\WiseDeck\src\PPTist
npm run build
```

### 步骤4: 修改App.vue添加URL参数支持
添加从URL参数获取项目ID并调用API的逻辑

### 步骤5: 更新模板
修改project_full_editor_iframe.html传递projectId参数

### 步骤6: 重启后端服务器
确保所有更改生效

---

## 验证步骤

1. 打开浏览器控制台（F12）
2. 访问完整编辑页面
3. 检查网络请求：
   - JS文件应返回200 OK（不是304）
   - `/api/projects/{projectId}/slides-data` 应返回200 OK
4. 检查控制台日志：
   - `[PPTist] Found projectId in URL`
   - `[PPTist] Loaded slides from API: X`
   - `[PPTist] Slides synced, current slides in store: X`

---

## 预期结果

完整编辑页面打开后：
1. PPTist从URL参数获取项目ID
2. 直接调用API获取slides数据
3. 转换为PPTist格式并显示
4. 不再依赖postMessage和localStorage
