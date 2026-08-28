# 完整编辑器缓存问题修复计划

## 问题分析

服务器日志显示：
```
GET /static/pptist_dist/index.html?v=2026050905 HTTP/1.1" 200 OK
GET /static/pptist_dist/assets/index-B7W-84_t.js HTTP/1.1" 304 Not Modified
```

问题：
1. index.html返回200 OK（但可能被浏览器缓存）
2. JS文件返回304 Not Modified（使用缓存的旧版本）
3. 这导致PPTist使用旧代码，不会正确处理postMessage数据

## 修复方案

**在路由中传入时间戳，模板中使用动态时间戳确保iframe src每次都不同**

### 修改1: project_workspace_routes.py

在 `web_project_full_editor` 函数中传入时间戳：

```python
import time

@router.get("/projects/{project_id}/full-editor", response_class=HTMLResponse)
async def web_project_full_editor(...):
    ...
    response = templates.TemplateResponse(
        "pages/project/project_full_editor_iframe.html",
        {
            "request": request,
            "project": project,
            "cache_bust": int(time.time() * 1000),  # 毫秒时间戳
        },
    )
```

### 修改2: project_full_editor_iframe.html

使用时间戳作为iframe src的版本参数：

```html
<iframe id="pptist-iframe"
        src="/static/pptist_dist/index.html?v={{ cache_bust }}"
        class="pptist-iframe"
        allow="fullscreen"></iframe>
```

## 验证

修改后，重新访问完整编辑页面，检查：
1. 服务器日志中index.html请求应该带不同的时间戳参数
2. JS文件请求不再是304，而是200
3. 浏览器控制台应显示新的日志消息
