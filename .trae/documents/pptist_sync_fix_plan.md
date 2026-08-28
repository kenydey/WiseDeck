# PPTist 完整编辑器数据同步问题修复计划

## 问题分析

### 当前状态
- ✅ PPT 编辑器预览正常（显示3页幻灯片）
- ❌ 完整编辑器卡在"数据初始化中，请稍等..."
- 📍 根本原因：PPTist 等待接收数据但未收到 postMessage

### 问题根因
1. **消息传递时序问题**：PPTist 的 `waitForSlidesData()` 函数收到消息后立即移除监听器
2. **iframe 加载时序**：消息可能在 PPTist 监听器就绪前发送
3. **缺少重试机制**：消息发送失败后没有重试

---

## 修复方案

### 方案概述
修改 PPTist App.vue，保持监听器持久化，并增加超时重试机制

### 具体修改

| 文件 | 修改内容 |
|-----|---------|
| `src/PPTist/src/App.vue` | 移除一次性监听器，使用持久化监听器；增加超时检查；增加初始化状态标记 |
| `src/wisedeck/web/static/js/pages/project/full_editor_iframe/main.js` | 增加消息发送重试机制；增加 PPTist 请求数据的响应处理 |

### 修改步骤

#### 步骤1：修改 PPTist App.vue
```typescript
// 关键变更：
1. 添加 `initialized` ref 标记初始化状态
2. 将 `waitForSlidesData()` 改为持久化监听器 `handleExternalSlides()`
3. 添加 3 秒超时检查，主动请求数据
4. 收到数据后不再移除监听器，支持多次同步
```

#### 步骤2：修改 main.js
```javascript
// 关键变更：
1. 监听 PPTist 的 `REQUEST_SLIDES_DATA` 请求
2. 增加消息发送重试机制（最多重试3次）
3. 改进错误处理和日志记录
```

#### 步骤3：重新构建 PPTist
```bash
cd src/PPTist && npm run build
```

---

## 数据同步流程优化

```
优化前：
WiseDeck → iframe.onload → 发送消息 → PPTist（一次性监听器）

优化后：
PPTist 启动 → 注册持久化监听器 → 等待数据
    ↓ 超时3秒
PPTist → 主动请求数据（REQUEST_SLIDES_DATA）
    ↓
WiseDeck → 响应请求 → 发送 SYNC_SLIDES_TO_PPTIST
    ↓
PPTist → 接收并处理 → 保持监听器活跃
```

---

## 风险评估

| 风险 | 等级 | 应对措施 |
|-----|------|---------|
| 消息重复处理 | 低 | 使用 `initialized` 标记防止重复初始化 |
| 性能影响 | 低 | 监听器是 lightweight 操作 |
| 兼容性问题 | 低 | 使用标准 postMessage API |

---

## 验证步骤

1. 重启 WiseDeck 服务器
2. 打开项目编辑页面
3. 点击"完整编辑"按钮
4. 检查浏览器控制台日志：
   - `[PPTist] Running in embed mode, waiting for external data...`
   - `[PPTistIFrameEditor] Syncing data to PPTist...`
   - `[PPTist] Received SYNC_SLIDES_TO_PPTIST message`
   - `[PPTist] Slides synced: X`

5. 验证幻灯片内容是否正确显示

---

## 预期结果

完整编辑器应能：
- ✅ 正确加载项目的所有幻灯片（3页）
- ✅ 显示与 PPT 编辑器一致的内容
- ✅ 支持编辑和保存操作