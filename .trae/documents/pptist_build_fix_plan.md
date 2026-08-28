# PPTist 打包优化计划

## 问题分析

### 打包结果
✅ PPTist 已成功打包到 `../../wisedeck/web/static/pptist_dist/` 目录

### 警告信息
⚠️ 打包警告（非错误）：
1. **中文字体文件过大** - 多个 .woff2 文件超过 1MB
2. **JavaScript 包过大** - `index-*.js` 约 3MB
3. **CSS 文件过大** - `index-*.css` 约 242KB
4. **部分 chunk 超过 500KB**

## 修复方案

### 方案一：调整警告阈值（推荐，简单快速）
直接调高 Vite 警告阈值，消除警告提示。

### 方案二：代码分块（推荐长期优化）
使用 Rollup 的 manualChunks 配置，将第三方依赖分离。

### 方案三：CDN 字体（可选，需要额外配置）
将字体文件迁移到 CDN 加载。

## 实施步骤

### 步骤 1：修改 vite.config.ts
添加以下配置：
```typescript
build: {
  chunkSizeWarningLimit: 4000,
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      }
    }
  }
}
```

## 预期效果
- 消除打包警告
- 优化加载性能（vendor 分块可并行加载）
- 不影响功能正常运行
