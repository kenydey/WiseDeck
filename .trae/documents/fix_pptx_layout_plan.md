# 修复计划：PPTX 轻量级导入显示 0 个布局问题

## 问题分析

### 问题描述
导入 PPTX 文件后显示"轻量级导入 - 0 个布局"，无法正确提取占位符信息。

### 错误日志
```
WARNING:wisedeck.services.template.pptx_style_extractor:提取布局占位符时发生错误: shape is not a placeholder
```

### 根本原因
在 `_get_placeholder_type()` 函数中，没有先检查 `shape.is_placeholder` 属性，而是直接访问 `placeholder_format`。当形状不是占位符时，访问 `placeholder_format.type` 会抛出 `AttributeError`。

### 对比现有代码
**错误的实现** (pptx_style_extractor.py):
```python
def _get_placeholder_type(shape: Any) -> Optional[str]:
    try:
        if not hasattr(shape, "placeholder_format"):
            return None
        ph_format = shape.placeholder_format  # 非占位符形状会失败
        ...
    except (AttributeError, KeyError):
        return None
```

**正确的实现** (pptx_slide_layout_hints.py):
```python
def _ph_type_name(shape: object) -> Optional[str]:
    try:
        if not bool(getattr(shape, "is_placeholder", False)):  # 先检查
            return None
        pf = getattr(shape, "placeholder_format", None)
        ...
    except Exception:
        return None
```

---

## 修复方案

### 方案 1：修复 `_get_placeholder_type()` 函数（推荐）
在访问 `placeholder_format` 之前，先检查 `shape.is_placeholder`。

### 方案 2：增强异常处理
扩大 `try-except` 的范围，捕获所有可能的异常。

### 方案 3：遍历 `slide_layouts` 的方式
检查 `prs.slide_layouts` 的遍历方式是否正确。

---

## 实施计划

### 任务 1：修复 `_get_placeholder_type()` 函数
**文件**: `src/wisedeck/services/template/pptx_style_extractor.py`

**修改内容**:
```python
def _get_placeholder_type(shape: Any) -> Optional[str]:
    try:
        # 先检查是否为占位符
        if not getattr(shape, "is_placeholder", False):
            return None
        ph_format = shape.placeholder_format
        if ph_format is None:
            return None
        ph_type = ph_format.type
        return PLACEHOLDER_TYPE_MAP.get(ph_type)
    except (AttributeError, KeyError):
        return None
```

### 任务 2：增加调试日志
**文件**: `src/wisedeck/services/template/pptx_style_extractor.py`

**修改内容**:
- 在 `extract_layout_placeholders()` 中增加调试日志，记录每个形状的处理情况

### 任务 3：测试验证
- 使用测试 PPTX 文件验证修复效果
- 确保布局数量正确显示

### 任务 4：前端优化（可选）
- 增加布局数量为 0 时的友好提示

---

## 风险评估

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| 修复后仍无法提取 | 功能不可用 | 增加详细日志，便于排查 |
| 性能下降 | 处理时间增加 | 只在 DEBUG 模式下记录详细日志 |
| 兼容性问题 | 某些 PPTX 文件无法处理 | 保留异常处理，确保不会崩溃 |

---

## 预期结果

修复后，PPTX 导入应该能够正确提取布局数量和占位符信息，显示类似：
- "轻量级导入 - 5 个布局，纯 python-pptx 提取"

---

*计划生成时间：2026-05-07*
