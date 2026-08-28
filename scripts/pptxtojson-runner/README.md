# pptxtojson Runner（WiseDeck 模板导入）

将 `.pptx` 解析为可读 JSON（基于 [pptxtojson](https://github.com/pipipi-pikachu/pptxtojson) MIT，WiseDeck fork 增加 `placeholderType` / `isPlaceholder` 字段）。

WiseDeck 额外为 **`p:graphicFrame`**（图表 / 表格 / SmartArt）从 `p:nvGraphicFramePr/p:nvPr/p:ph` 写入同上占位字段，便于 `pptx_readable_summary` 与 python-pptx SVG 注入对齐。

全局模板 **`convert-office-template`** API 默认优先 **LibreOffice HTML** 导出；失败且允许降级时再走 svg_stack；结构化 `pptx_readable` / `layout_package` 在两条路径下均可写入契约（详见后端 `global_master_template_api`）。可用 **`WISEDECK_DISABLE_LIBREOFFICE_HTML_IMPORT=1`** 强制跳过 HTML 导出。

**占位符与版式语义的唯一真源（方案 A）**：`pptx_readable`（本 fork）产出 `placeholderType` / `isPlaceholder`、按页 `per_slide_layout_signatures`、`slide_notes_excerpts` 与 `layout_package.per_slide_data_schemas`；LibreOffice 产物仅作视觉参考。请求 **`import_mode=structured`** 时可不依赖 LibreOffice，仅依赖 Node + `bundle/wisedeck-pptx-parse.mjs`。

### 与上游同步（可选、手工）

若需合并上游新版本：在 `forked_pptxtojson/` 内对照上游 tag/commit，保留 `wisedeckApplyPlaceholderProps`、`wisedeckApplyGraphicFramePlaceholderProps` 与入口差异后执行 `npm run build`，并回归 WiseDeck pytest（`pptx_readable` / placeholder inject）。

## 依赖

- Node.js 18+（PATH 中有 `node`，或通过环境变量 `WISEDECK_NODE_BIN` 指定）
- 首次克隆后在 **本目录** 执行：`npm ci`（或 `npm install`）

## 构建捆绑包

Fork 源码位于 `forked_pptxtojson/`。修改 fork 后需重新打包：

```bash
npm run build
```

产物：`bundle/wisedeck-pptx-parse.mjs`（路径避开仓库根 `.gitignore` 的 `dist/`；提交到仓库便于部署）。

### 浏览器捆绑包（完整编辑 iframe）

用于 **同源 iframe** 内解析 PPTX（与 Node 版同一 fork 入口），构建：

```bash
npm run build:browser
```

产物：`bundle/wisedeck-pptx-parse.browser.mjs`。发布到 Web 静态目录时请 **复制到**  
`src/wisedeck/web/static/pptist_dist/vendor/wisedeck-pptx-parse.browser.mjs`（与  
[`wisedeck_pptist_import_bridge.js`](../../src/wisedeck/web/static/pptist_dist/wisedeck_pptist_import_bridge.js)  
中的动态 `import` 路径一致）。详见 `pptist_dist/vendor/PPTIST_BUILD.md`。

## 运行时

WiseDeck Python 调用：`scripts/pptxtojson-runner/run.mjs`，传入 pptx 绝对路径。

禁用解析（降级为仅 python-pptx / pdf 流水线）：设置环境变量 `WISEDECK_DISABLE_PPTX_READABLE_JSON=1`。
