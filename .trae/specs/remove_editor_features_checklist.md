# 检查清单：删除 PPT 编辑器中图表骨架、参考、规格功能

## 阶段一：前端按钮删除验证

- [x] `图表骨架` 按钮已从 project_slides_editor.html 删除
- [x] `参考` 按钮已从 project_slides_editor.html 删除
- [x] `规格` 按钮已从 project_slides_editor.html 删除
- [x] `designSpec.js` 和 `referenceFiles.js` 脚本引用已删除

## 阶段二：前端 JS 文件删除验证

- [x] `projectSlidesEditor.designSpec.js` 文件已删除
- [x] `projectSlidesEditor.referenceFiles.js` 文件已删除
- [x] 无其他文件引用已删除的 JS 文件

## 阶段三：后端 API 路由删除验证

- [x] reference-files 相关路由已删除
- [x] design-spec 相关路由已删除
- [x] 相关服务导入已清理
- [x] context-settings 和 exports 路由已保留
- [x] Python 语法检查通过

## 阶段四：功能验证

- [x] 页面加载无 JavaScript 错误（按钮已删除）
- [x] 其他按钮功能正常（预览、编辑、分屏等）
- [x] 后端服务启动无错误

## 最终验证清单

- [x] 所有子任务检查项已完成
- [x] 前端代码无遗留引用
- [x] 后端路由已清理
- [x] 系统功能正常
