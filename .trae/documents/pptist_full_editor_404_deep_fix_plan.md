# PPTist 完整编辑器 404 错误深层修复计划

## 问题分析

从用户截图可以看到：
- URL: `http://127.0.0.1:8000/project/c4a3a767-df34-40a1-9cff-631a271bafe3/full-editor`（单数 project）
- 错误: `{"detail": "Not Found"}`

### 根本原因

虽然之前修改了路由和前端 JS，但问题仍然存在，原因是：

1. **浏览器缓存问题** - 浏览器可能缓存了旧的 JS 文件
2. **模板文件中存在重复定义** - 在多个模板中定义了 `openFullEditor()` 函数

### 发现的问题点

| 文件 | 问题 | 状态 |
|-----|------|------|
| `project_workspace_routes.py` | 路由已改为 `/projects/`（复数） | ✅ 已修复 |
| `projectSlidesEditor.fullEditor.js` | URL 已改为 `/projects/`（复数） | ✅ 已修复 |
| `todo_board_with_editor.html` | 定义了 `openFullEditor()`，但指向 `/edit` | ⚠️ 不同路径 |
| `script_1.html` | 定义了 `openFullEditor()`，但指向 `/edit` | ⚠️ 不同路径 |

### JS 文件版本问题

在 `project_slides_editor.html` 中引用的 JS 文件带有版本号：
```html
<script src="/static/js/pages/project/slides_editor/projectSlidesEditor.fullEditor.js?v=20260508"></script>
```

如果版本号没有更新，浏览器可能仍然使用缓存的旧文件。

## 修复方案

### 步骤 1: 更新路由路径（已完成）

**文件**: `project_workspace_routes.py`
```python
@router.get("/projects/{project_id}/full-editor", response_class=HTMLResponse)
```

### 步骤 2: 更新前端 JS 文件

**文件**: `projectSlidesEditor.fullEditor.js`
```javascript
const fullEditorUrl = `/projects/${projectId}/full-editor`;
```

### 步骤 3: 更新 JS 文件版本号

**文件**: `project_slides_editor.html`
```html
<script src="/static/js/pages/project/slides_editor/projectSlidesEditor.fullEditor.js?v=20260509"></script>
```

### 步骤 4: 更新 full_editor_iframe/main.js 中的 URL

**文件**: `full_editor_iframe/main.js`（第 205 行）
```javascript
// 修改前
window.location.href = '/project/' + this.projectId + '/edit';

// 修改后
window.location.href = '/projects/' + this.projectId + '/edit';
```

**文件**: `full_editor_iframe/main.js`（第 55 行）
```javascript
// 修改前
const match = path.match(/\/project\/([^\/]+)\/full-editor-iframe/);

// 修改后
const match = path.match(/\/projects\/([^\/]+)\/full-editor/);
```

### 步骤 5: 重启服务器并清除缓存

## 文件修改清单

| 文件 | 修改内容 |
|-----|---------|
| `project_workspace_routes.py` | ✅ 已修改为 `/projects/` |
| `projectSlidesEditor.fullEditor.js` | ✅ 已修改为 `/projects/` |
| `project_slides_editor.html` | 更新 JS 文件版本号 |
| `full_editor_iframe/main.js` | 第 55、205 行改为 `/projects/` |

## 验证步骤

1. 修改所有相关文件
2. 重启 WiseDeck 服务器
3. 清除浏览器缓存（Ctrl+Shift+Delete）
4. 测试完整编辑器功能

## 额外建议

为了避免类似问题，建议：
1. 统一所有路由使用复数形式 `/projects/`
2. 确保所有 URL 生成使用统一的函数
3. 在部署时增加版本号或使用内容哈希
