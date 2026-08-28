# 图片服务 Bug 修复计划

## 问题分析

### 当前状态
- ✅ PPTist 完整编辑器已能正常加载
- ❌ 图片无法显示（`cache_entries` 未定义错误）

### 问题根因
`image_service.py` 第 806 行使用了未定义的变量 `cache_entries`

```python
# Legacy path: scan cache for matching image_id
for cache_key, cache_info in cache_entries:  # BUG: cache_entries 未定义
```

---

## 修复方案

### 具体修改

| 文件 | 修改内容 |
|-----|---------|
| `src/wisedeck/services/image/image_service.py` | 在第 806 行前添加 `cache_entries` 变量定义 |

### 修改步骤

#### 步骤1：修复 image_service.py
在第 805-806 行之间添加变量定义：
```python
# Legacy path: scan cache for matching image_id
cache_entries = list(self.cache_manager._cache_index.items())
for cache_key, cache_info in cache_entries:
```

---

## 验证步骤

1. 重启 WiseDeck 服务器
2. 打开项目编辑页面
3. 检查服务器日志，确认没有 `name 'cache_entries' is not defined` 错误
4. 测试图片是否正常显示

---

## 预期结果

图片服务应能：
- ✅ 正确获取图片信息
- ✅ 不再出现 `cache_entries` 未定义错误