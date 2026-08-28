# PPTist 完整编辑器 404 错误根本修复计划

## 问题分析

从服务器日志可以看到：
```
INFO:     127.0.0.1:8096 - "GET /projects/c4a3a767-df34-40a1-9cff-631a271bafe3/full-editor HTTP/1.1" 200 OK
INFO:     127.0.0.1:14461 - "GET /static/js/pages/project/full_editor_iframe/main.js HTTP/1.1" 200 OK
INFO:     127.0.0.1:14461 - "GET /static/pptist_dist/index.html HTTP/1.1" 404 Not Found
```

### 根本原因

**路径不一致**：
- PPTist 构建输出目录：`c:\dev\WiseDeck\wisedeck\web\static\pptist_dist\`
- FastAPI 静态文件服务挂载目录：`c:\dev\WiseDeck\src\wisedeck\web\static\`

两个目录不同，导致 `/static/pptist_dist/` 下的文件无法被访问。

### 目录结构对比

```
c:\dev\WiseDeck\
├── src/
│   └── wisedeck/
│       └── web/
│           └── static/        ← FastAPI 挂载这里
│               ├── css/
│               ├── js/
│               └── ...
└── wisedeck/
    └── web/
        └── static/            ← PPTist 构建输出到这里
            └── pptist_dist/
                ├── index.html
                └── ...
```

## 修复方案

### 方案一：修改 vite.config.ts 输出路径（推荐）

将 PPTist 构建输出改为 `src/wisedeck/web/static/pptist_dist/`：

```typescript
build: {
  outDir: '../wisedeck/web/static/pptist_dist',  // 修改为相对路径
  emptyOutDir: true,
  ...
}
```

### 方案二：复制构建产物到正确位置

在构建后执行复制命令：
```bash
xcopy "c:\dev\WiseDeck\wisedeck\web\static\pptist_dist" "c:\dev\WiseDeck\src\wisedeck\web\static\pptist_dist" /E /H /Y
```

### 方案三：修改 main.py 静态服务配置

添加额外的静态文件挂载：
```python
pptist_dist_dir = os.path.join(os.getcwd(), "wisedeck", "web", "static", "pptist_dist")
app.mount("/static/pptist_dist", StaticFiles(directory=pptist_dist_dir), name="pptist_dist")
```

## 文件修改清单

| 文件 | 修改内容 |
|-----|---------|
| `vite.config.ts` | 修改 outDir 为正确路径 |
| `main.py` | 可选：添加额外静态挂载 |

## 验证步骤

1. 修改 vite.config.ts
2. 重新构建 PPTist
3. 重启 WiseDeck 服务器
4. 测试完整编辑器功能

## 推荐方案

选择**方案一**，直接修改构建输出路径，这样每次构建都会自动输出到正确位置，避免手动复制。
