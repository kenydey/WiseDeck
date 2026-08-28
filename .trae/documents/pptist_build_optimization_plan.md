# PPTist 构建优化方案

## 摘要

优化 PPTist 的 Vite 构建配置，实现：
1. **代码分块优化** - 将大型第三方库拆分为独立 chunk
2. **字体外部化** - 将字体移至 public/fonts/ 目录，避免打包进 bundle

## 当前状态分析

### 构建输出（成功但体积过大）
```
✓ built in 20.40s
assets/index-Cj5fjVPG.js      3,006.71 kB │ gzip: 992.95 kB
assets/index-DNTc6-2n.css       242.40 kB │ gzip:  36.46 kB
+ 33 个字体文件（总计约 40MB+）
```

### 主要问题
1. **JS 包过大** - 3MB 单个 JS 文件，包含所有依赖
2. **字体文件打包** - 33 个 woff2 文件被打包进输出目录

## 优化方案

### 方案一：精细化代码分块

修改 `vite.config.ts`，将大型第三方库拆分：

| 库 | 预期大小 | 说明 |
|---|---------|------|
| vue | ~100KB | Vue 核心 |
| pinia | ~50KB | 状态管理 |
| echarts | ~800KB | 图表库（最大） |
| prosemirror | ~200KB | 富文本编辑器 |
| vendor (其他) | ~500KB | 其他依赖 |

### 方案二：字体外部化

将字体从 `src/assets/fonts/` 移动到 `public/fonts/`：
- Vite 会原样复制 public 目录到输出
- 不参与构建打包，减少构建体积
- 字体仍然可用，但不再产生构建警告

## 实施步骤

### 步骤 1: 更新 vite.config.ts - 精细分块

**文件**: `c:\dev\WiseDeck\src\PPTist\vite.config.ts`

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // Vue 核心
        if (id.includes('node_modules/vue')) {
          return 'vue';
        }
        // Pinia 状态管理
        if (id.includes('node_modules/pinia')) {
          return 'pinia';
        }
        // ECharts 图表库（最大）
        if (id.includes('node_modules/echarts')) {
          return 'echarts';
        }
        // ProseMirror 编辑器核心
        if (id.includes('node_modules/prosemirror')) {
          return 'prosemirror';
        }
        // 工具库
        if (id.includes('node_modules/lodash')) {
          return 'lodash';
        }
        if (id.includes('node_modules/axios')) {
          return 'axios';
        }
        if (id.includes('node_modules/tippy.js')) {
          return 'tippy';
        }
        // 其他 node_modules
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      }
    }
  }
}
```

### 步骤 2: 移动字体到 public/fonts/

**源目录**: `c:\dev\WiseDeck\src\PPTist\src\assets\fonts\`
**目标目录**: `c:\dev\WiseDeck\src\PPTist\public\fonts\`

移动所有 .woff2 字体文件（28个文件）

### 步骤 3: 更新 font.scss 字体路径

**文件**: `c:\dev\WiseDeck\src\PPTist\src\assets\styles\font.scss`

修改字体路径从相对路径改为使用 Vite 的 `/fonts/` 路径：

```scss
// 由于字体移至 public/fonts/，使用绝对路径
@each $font in $fonts {
  @font-face {
    font-display: swap;
    font-family: $font;
    src: url('/fonts/#{$font}.woff2') format('woff2');
  }
}
```

### 步骤 4: 复制字体到 WiseDeck 静态目录（可选）

如果需要在 WiseDeck 独立使用字体：
- 源: `c:\dev\WiseDeck\src\PPTist\public\fonts\`
- 目标: `c:\dev\WiseDeck\src\wisedeck\web\static\fonts\`

## 文件修改清单

| 操作 | 文件路径 | 修改内容 |
|-----|---------|---------|
| 修改 | `src/PPTist/vite.config.ts` | 优化 manualChunks 配置 |
| 移动 | `src/assets/fonts/*.woff2` → `public/fonts/` | 字体外部化 |
| 修改 | `src/assets/styles/font.scss` | 更新字体路径为 /fonts/ |

## 验证标准

1. ✅ 构建成功完成（无错误）
2. ✅ 主 JS bundle 拆分为多个小 chunk
3. ✅ 字体文件存在于 public/fonts/ 目录
4. ✅ 编辑器功能正常（需手动测试）

## 预期结果

优化后构建输出结构：
```
assets/
├── index-xxxx.js          (~100KB)  主应用代码
├── vue-xxxx.js            (~100KB)  Vue 核心
├── pinia-xxxx.js          (~50KB)   Pinia
├── echarts-xxxx.js        (~800KB)  ECharts
├── prosemirror-xxxx.js    (~200KB)  ProseMirror
├── vendor-xxxx.js         (~500KB)  其他依赖
├── index-xxxx.css         (~240KB)
└── fonts/                          字体文件（独立目录）
    ├── SourceHanSans.woff2
    ├── AlibabaPuHuiTi.woff2
    └── ...
```
