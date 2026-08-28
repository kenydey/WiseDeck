# 修复 WiseDeck 完整编辑器模块导入错误

## 问题分析

### 当前错误
日志显示：
```
ERROR:wisedeck.web.route_modules.support:❌ 修复elements失败: No module named 'wisedeck.web.db_project_manager'
```

### 根本原因
`project_workspace_routes.py` 中存在错误的导入路径：
- 第248行: `from ..db_project_manager import DatabaseProjectManager`
- 第370行: `from ..db_project_manager import DatabaseProjectManager`

由于该文件位于 `wisedeck/web/route_modules/`，使用 `..` 只会跳转到 `wisedeck/web/`，而 `db_project_manager` 实际位于 `wisedeck/services/`。

### 正确导入路径
应该是 `from ...services.db_project_manager import DatabaseProjectManager`（三个点）

---

## 修复方案

### 文件: `c:\dev\WiseDeck\src\wisedeck\web\route_modules\project_workspace_routes.py`

#### 修改1: 第248行
**当前代码:**
```python
from ..db_project_manager import DatabaseProjectManager
```
**修改为:**
```python
from ...services.db_project_manager import DatabaseProjectManager
```

#### 修改2: 第370行
**当前代码:**
```python
from ..db_project_manager import DatabaseProjectManager
```
**修改为:**
```python
from ...services.db_project_manager import DatabaseProjectManager
```

---

## 实施步骤

1. 修复第248行的导入路径
2. 修复第370行的导入路径
3. 重启服务验证修复效果

## 验证方法

1. 访问完整编辑器页面: `http://127.0.0.1:8000/projects/{project_id}/full-editor`
2. 检查日志中是否还有 `❌ 修复elements失败` 错误
3. 确认幻灯片数据正常加载
