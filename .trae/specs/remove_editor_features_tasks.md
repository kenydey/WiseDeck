# 任务清单：删除 PPT 编辑器中图表骨架、参考、规格功能

## 任务 1：删除前端按钮和引用

### 任务描述
从 HTML 模板中删除三个按钮和相关 JS 引用。

### 子任务
- [x] 1.1 删除 `图表骨架` 按钮（project_slides_editor.html）
- [x] 1.2 删除 `参考` 按钮（project_slides_editor.html）
- [x] 1.3 删除 `规格` 按钮（project_slides_editor.html）
- [x] 1.4 删除 `designSpec.js` 和 `referenceFiles.js` 脚本引用

### 依赖关系
无

### 验证方式
页面加载正常，按钮已删除

---

## 任务 2：删除前端 JS 文件

### 任务描述
删除不再需要的 JS 文件。

### 子任务
- [x] 2.1 删除 `projectSlidesEditor.designSpec.js` 文件
- [x] 2.2 删除 `projectSlidesEditor.referenceFiles.js` 文件

### 依赖关系
无

### 验证方式
文件已删除，无引用报错

---

## 任务 3：删除后端 API 路由

### 任务描述
删除 reference-files 和 design-spec 相关路由。

### 子任务
- [x] 3.1 删除 `project_context_routes.py` 中的 reference-files 路由
- [x] 3.2 删除 design-spec 相关路由
- [x] 3.3 清理相关导入语句
- [x] 3.4 保留 context-settings 和 exports 相关路由

### 依赖关系
无

### 验证方式
API 路由已清理，Python 语法检查通过

---

## 任务 4：验证和测试

### 任务描述
验证删除后的系统功能正常。

### 子任务
- [x] 4.1 Python 语法检查通过
- [x] 4.2 前端按钮已删除
- [x] 4.3 JS 文件已删除
- [x] 4.4 后端路由已清理

### 依赖关系
依赖于任务 1、2、3 完成

### 验证方式
功能测试通过

---

## 执行完成状态

- 任务 1：删除前端按钮和引用 ✅
- 任务 2：删除前端 JS 文件 ✅
- 任务 3：删除后端 API 路由 ✅
- 任务 4：验证和测试 ✅
