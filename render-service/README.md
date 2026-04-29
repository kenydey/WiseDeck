# Presenton `render-service`（已移除）

本目录曾为 Presenton `servers/nextjs` 子树的拷贝，用于历史上的 **`presentation_to_pptx_model`** / **`pdf-maker`** 会话链路。

WiseDeck **已不再依赖**独立的 Next.js 渲染进程；结构化 PPTX 由 FastAPI 主进程内的 **Playwright** 打开同源 **`slides-html`** 完成（参见 [`STRUCTURED_EXPORT_VENDOR.md`](../STRUCTURED_EXPORT_VENDOR.md)、[`docs/render-service-decommission.md`](../docs/render-service-decommission.md)）。

如需对照旧实现，请在 Git 历史中检出移除本目录之前的提交。

---

若本地仍存在 **`render-service/node_modules`**（未被 Git 跟踪），可在关闭占用句柄的程序后手动删除该文件夹。
