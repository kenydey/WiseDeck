# pptxtojson Runner（WiseDeck 模板导入）

将 `.pptx` 解析为可读 JSON（基于 [pptxtojson](https://github.com/pipipi-pikachu/pptxtojson) MIT，WiseDeck fork 增加 `placeholderType` / `isPlaceholder` 字段）。

## 依赖

- Node.js 18+（PATH 中有 `node`，或通过环境变量 `WISEDECK_NODE_BIN` 指定）
- 首次克隆后在 **本目录** 执行：`npm ci`（或 `npm install`）

## 构建捆绑包

Fork 源码位于 `forked_pptxtojson/`。修改 fork 后需重新打包：

```bash
npm run build
```

产物：`bundle/wisedeck-pptx-parse.mjs`（路径避开仓库根 `.gitignore` 的 `dist/`；提交到仓库便于部署）。

## 运行时

WiseDeck Python 调用：`scripts/pptxtojson-runner/run.mjs`，传入 pptx 绝对路径。

禁用解析（降级为仅 python-pptx / pdf 流水线）：设置环境变量 `WISEDECK_DISABLE_PPTX_READABLE_JSON=1`。
