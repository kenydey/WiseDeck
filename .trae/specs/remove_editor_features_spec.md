# 删除 PPT 编辑器中图表骨架、参考、规格功能规格说明书

## 一、背景与目标

### 1.1 问题描述

PPT 编辑器中存在三个使用率较低的功能：
- **图表骨架**：在光标处插入 chart_config JSON 骨架
- **参考**：参考文档（注入生成上下文）
- **规格**：设计规格锁定（JSON）

这些功能用处不大，需要从前端和后端完全删除。

### 1.2 删除目标

| 功能 | 前端按钮 | 后端接口 | JS 文件 |
|------|---------|---------|---------|
| 图表骨架 | `图表骨架` 按钮 | `/api/charts/presets-catalog` | 无独立文件 |
| 参考 | `参考` 按钮 | `/api/projects/:id/reference-files` | `referenceFiles.js` |
| 规格 | `规格` 按钮 | `/api/projects/:id/design-spec` | `designSpec.js` |

---

## 二、删除范围

### 2.1 前端删除

#### HTML 模板
- `project_slides_editor.html` 第 113-116 行：`图表骨架` 按钮
- `project_slides_editor.html` 第 129-131 行：`参考` 按钮
- `project_slides_editor.html` 第 132-134 行：`规格` 按钮

#### JS 文件
- `projectSlidesEditor.designSpec.js`：完整删除
- `projectSlidesEditor.referenceFiles.js`：完整删除

#### HTML 引用
- `project_slides_editor.html` 第 848 行：`designSpec.js` 引用

### 2.2 后端删除

#### API 路由
- `/api/projects/:id/reference-files`：GET/POST/DELETE 路由
- `/api/projects/:id/reference-files/reorder`：路由
- `/api/projects/:id/reference-files/:fid`：路由
- `/api/projects/:id/design-spec`：GET/PATCH 路由
- `/api/charts/presets-catalog`：GET 路由

#### 服务文件
- 可能存在的 reference-files 相关服务代码
- 可能存在的 design-spec 相关服务代码

---

## 三、影响分析

### 3.1 受影响的功能

| 功能 | 影响说明 |
|------|---------|
| AI 生成上下文 | 参考文件功能删除后，AI 生成将不再能使用参考文档上下文 |
| 设计规格锁定 | 设计规格功能删除后，无法锁定 JSON 格式的设计规格 |
| 图表配置 | 图表骨架按钮删除后，无法快速插入 chart_config 骨架 |

### 3.2 无影响的功能

- PPT 导出功能（图表相关但独立）
- 模板导入功能
- AI 对话功能（除参考文件上下文外）

---

## 四、实施步骤

### 4.1 前端删除

1. 编辑 `project_slides_editor.html`：
   - 删除 `图表骨架` 按钮
   - 删除 `参考` 按钮
   - 删除 `规格` 按钮
   - 删除 `designSpec.js` 脚本引用

2. 删除 JS 文件：
   - 删除 `projectSlidesEditor.designSpec.js`
   - 删除 `projectSlidesEditor.referenceFiles.js`

### 4.2 后端删除

1. 检查并删除 `project_context_routes.py` 中的 reference-files 路由
2. 检查并删除 design-spec 相关路由
3. 检查并删除 charts/presets-catalog 路由
4. 清理相关服务代码（如有必要）

---

## 五、验收标准

### 5.1 前端验收

- [ ] `图表骨架` 按钮已删除
- [ ] `参考` 按钮已删除
- [ ] `规格` 按钮已删除
- [ ] `designSpec.js` 引用已删除
- [ ] `projectSlidesEditor.designSpec.js` 文件已删除
- [ ] `projectSlidesEditor.referenceFiles.js` 文件已删除
- [ ] 页面加载无错误
- [ ] 其他按钮功能正常

### 5.2 后端验收

- [ ] reference-files 相关路由已删除
- [ ] design-spec 相关路由已删除
- [ ] charts/presets-catalog 路由已删除（如果不使用）
- [ ] API 测试无 404 错误
- [ ] 服务启动无错误

---

*文档版本：1.0*
*创建日期：2026-05-07*
