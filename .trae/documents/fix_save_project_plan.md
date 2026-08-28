# 修复计划：DatabaseProjectManager 缺少 save_project 方法

## 问题分析

根据后台日志，完整编辑器页面显示错误：
```
ERROR:wisedeck.web.route_modules.support:❌ 修复elements失败: 'DatabaseProjectManager' object has no attribute 'save_project'
```

### 根本原因

在 `project_workspace_routes.py` 中，代码尝试调用 `db_manager.save_project(project)` 来保存修复后的项目数据，但 `DatabaseProjectManager` 类中并未实现此方法。

### 影响范围

1. 旧格式数据（缺少 `elements` 字段）无法转换为 PPTist 格式
2. 完整编辑器无法正确显示幻灯片内容
3. 项目数据修复流程中断

## 修复方案

### 方案一：在 DatabaseProjectManager 中添加 save_project 方法（推荐）

在 `c:\dev\WiseDeck\src\wisedeck\services\db_project_manager.py` 中添加 `save_project` 方法，该方法接收完整的项目对象并保存其数据。

### 方案二：修改调用代码使用现有方法

在 `project_workspace_routes.py` 中将 `db_manager.save_project(project)` 替换为：
```python
await db_manager.update_project(project_id, {"slides_data": project.slides_data})
```

## 实施步骤

### 步骤1：添加 save_project 方法

在 `db_project_manager.py` 中添加以下方法：

```python
async def save_project(self, project: PPTProject) -> bool:
    """Save a complete project object to database"""
    db_service = await self._get_db_service()
    try:
        # Update the project with all its data
        update_data = {
            "title": project.title,
            "slides_html": project.slides_html,
            "slides_data": project.slides_data,
            "outline": project.outline,
            "confirmed_requirements": project.confirmed_requirements,
            "project_metadata": project.project_metadata,
            "updated_at": project.updated_at,
        }
        
        success = await db_service.project_repo.update(project.project_id, update_data)
        
        if success:
            logger.info(f"Saved project {project.project_id}")
        
        return success
    finally:
        await db_service.session.close()
```

### 步骤2：验证修复

1. 重新启动后端服务
2. 打开完整编辑器页面
3. 验证幻灯片内容是否正确显示
4. 检查后台日志是否有错误

## 风险评估

- **低风险**：添加新方法不会影响现有功能
- **兼容性**：保持与现有调用代码的兼容性
- **数据完整性**：确保项目数据完整保存

## 优先级

**高优先级** - 此问题导致完整编辑器无法正常工作

## 文件修改清单

1. `c:\dev\WiseDeck\src\wisedeck\services\db_project_manager.py` - 添加 `save_project` 方法

