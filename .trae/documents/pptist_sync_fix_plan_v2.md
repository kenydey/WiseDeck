# PPTist 完整编辑器数据同步问题修复计划 v2

## 问题分析

### 当前状态
- ✅ 所有静态资源正常加载（200 OK / 304 Not Modified）
- ❌ PPTist 仍卡在"数据初始化中"
- 📍 根本原因：**消息传递时序问题**

### 问题根因
```
当前流程时序：
1. main.js → iframe.onload → 立即发送 SYNC_SLIDES_TO_PPTIST
2. PPTist → onMounted → 注册 message 监听器
3. 问题：消息可能在监听器注册前发送 → 消息丢失
```

---

## 修复方案

### 方案概述
使用 **localStorage** 作为数据传递媒介，PPTist 启动时主动从 localStorage 读取数据

### 具体修改

| 文件 | 修改内容 |
|-----|---------|
| `main.js` | iframe 加载后，将数据存入 localStorage |
| `App.vue` | PPTist 启动时从 localStorage 读取数据，不依赖 postMessage |

### 修改步骤

#### 步骤1：修改 main.js
```javascript
// 关键变更：
1. iframe.onload 时将数据存入 localStorage
2. 通知 PPTist 数据已就绪（通过 localStorage 事件或轮询）
```

#### 步骤2：修改 App.vue
```typescript
// 关键变更：
1. 启动时检查 localStorage 中的 slides 数据
2. 如果有数据，直接使用；否则等待
3. 不依赖 postMessage 消息传递
```

#### 步骤3：重新构建 PPTist

---

## 数据同步流程优化

```
优化后流程：
1. main.js → iframe.onload → 将数据存入 localStorage
2. PPTist 启动 → 检查 localStorage → 读取数据 → 渲染
```

---

## 验证步骤

1. 重启 WiseDeck 服务器
2. 打开浏览器开发者工具（F12）→ Console 标签
3. 打开项目编辑页面
4. 点击"完整编辑"按钮
5. 检查日志：
   - `[PPTistIFrameEditor] Loaded slides: X`
   - `[PPTist] Reading slides from localStorage...`
   - `[PPTist] Slides synced: X`

---

## 预期结果

完整编辑器应能：
- ✅ 正确加载项目的所有幻灯片（3页）
- ✅ 显示与 PPT 编辑器一致的内容
- ✅ 支持编辑和保存操作