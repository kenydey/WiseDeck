# PPTist 完整编辑器缓存问题修复计划

## 问题分析

### 当前状态
- ✅ PPTist 构建产物包含 localStorage 代码
- ✅ main.js 已更新
- ❌ 完整编辑器仍无法正常加载

### 问题根因
**浏览器缓存了旧的 JavaScript 文件**

虽然服务器返回 304 Not Modified，但浏览器可能仍在使用内存中的旧代码。

---

## 修复方案

### 方案概述
强制浏览器加载新版本的文件，通过修改构建配置添加内容哈希

### 具体修改

| 文件 | 修改内容 |
|-----|---------|
| `vite.config.ts` | 配置构建输出使用内容哈希 |

### 修改步骤

#### 步骤1：修改 vite.config.ts
```typescript
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'assets/[name]-[hash].js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]'
    }
  }
}
```

#### 步骤2：重新构建 PPTist

#### 步骤3：更新 HTML 模板中的引用

---

## 验证步骤

1. 重启 WiseDeck 服务器
2. **硬刷新**（Ctrl+Shift+R）或清除浏览器缓存
3. 打开浏览器开发者工具（F12）→ Network 标签
4. 打开项目编辑页面
5. 点击"完整编辑"按钮
6. 检查 Network 标签，确保所有文件都是 200 OK（新文件）

---

## 预期结果

完整编辑器应能：
- ✅ 加载新版本的 PPTist 文件
- ✅ 正确读取 localStorage 数据
- ✅ 渲染幻灯片内容