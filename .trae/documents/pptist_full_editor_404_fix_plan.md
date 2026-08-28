# PPTist 完整编辑器 404 错误修复计划

## 问题分析

从用户截图可以看到：
- URL: `http://127.0.0.1:8000/project/c4a3a767-df34-40a1-9cff-631a271bafe3/full-editor`
- 错误: `{"detail": "Not Found"}` - FastAPI 标准 404 响应

### 问题原因

检查代码发现路由路径存在不一致：

**project_workspace_routes.py:**
- 第 64 行: `@router.get("/projects/{project_id}"` (复数 projects)
- 第 191 行: `@router.get("/project/{project_id}/full-editor"` (单数 project)

### 路由注册链

```
main.py → web_router → project_router → project_workspace_router
```

路由 `/project/{project_id}/full-editor` 虽然定义了，但其他项目路由都是 `/projects/{project_id}`（复数）。

## 修复方案

### 方案一：修复路由路径（推荐）

将 `/project/{project_id}/full-editor` 修改为 `/projects/{project_id}/full-editor`（复数形式），与其他路由保持一致。

### 文件修改

**文件**: `c:\dev\WiseDeck\src\wisedeck\web\route_modules\project_workspace_routes.py`

修改第 191 行的路由装饰器：
```python
# 修改前
@router.get("/project/{project_id}/full-editor", response_class=HTMLResponse)

# 修改后
@router.get("/projects/{project_id}/full-editor", response_class=HTMLResponse)
```

**文件**: `c:\dev\WiseDeck\src\wisedeck\web\static\js\pages\project\slides_editor\projectSlidesEditor.fullEditor.js`

修改第 14 行的 URL：
```javascript
// 修改前
const fullEditorUrl = `/project/${projectId}/full-editor`;

// 修改后
const fullEditorUrl = `/projects/${projectId}/full-editor`;
```

### 方案二：添加重定向（可选）

如果需要保持向后兼容，可以添加一个重定向路由：
```python
@router.get("/project/{project_id}/full-editor", response_class=HTMLResponse)
async def web_project_full_editor_redirect(request: Request, project_id: str):
    """重定向到正确的路由"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url=f"/projects/{project_id}/full-editor", status_code=301)
```

## 验证步骤

1. 修改路由路径
2. 修改前端 JS 中的 URL
3. 重启 WiseDeck 服务器
4. 测试完整编辑器功能

## 文件修改清单

| 文件 | 修改内容 |
|-----|---------|
| `route_modules/project_workspace_routes.py` | 将路由从 `/project/` 改为 `/projects/` |
| `static/js/pages/project/slides_editor/projectSlidesEditor.fullEditor.js` | 更新前端调用的 URL |
