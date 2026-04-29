# Presenton 能力迁入 WiseDeck（结构化导出）— 范围说明

本文档对应一次性整合：不跟踪 Presenton 上游；仅记录迁入/排除清单。

## 排除（不迁入）

- `servers/fastapi/api/v1/ppt/**` 中 LLM、演示 CRUD、OpenAI 兼容等与「渲染 + PPTX 落盘」无关的业务路由
- `servers/fastapi/services/database.py`、Alembic、MCP、webhook 等运行时
- Electron 打包目录 `electron/`

## 已迁入 / 需维护的 Python（`src/wisedeck/services/structured_export/_presenton/`）

| 来源 (Presenton) | 用途 |
|------------------|------|
| `models/pptx_models.py` | Pydantic 中间模型（含 `PptxChartBoxModel`） |
| `services/pptx_presentation_creator.py` | python-pptx 生成（含 `add_chart` 可编辑图） |
| `services/html_to_text_runs_service.py` | HTML 片段 → 文本 run |
| `utils/asset_directory_utils.py` | 图片路径解析（适配 `WISEDECK_APP_DATA_DIRECTORY`） |
| `utils/download_helpers.py` | 网络图片下载 |
| `utils/image_utils.py` | 图片裁剪/圆角等 |
| `utils/get_env.py` | 精简为 `app_data_env.py` 读取应用数据目录 |

## Presenton Node（render-service）状态

内置 **`render-service/`（Next.js subtree）已从主线移除**。结构化导出不再调用外部的 ``presentation_to_pptx_model`` / ``pdf-maker`` 会话；DOM→PPTX 的高保真路径由 FastAPI 侧 **Playwright** 打开应用托管的 **slides-html** 完成（``mode=homomorphic`` / ``homomorphic_editable`` / 默认 ``auto``）。

## WiseDeck 新增契约

- `src/wisedeck/services/structured_export/schemas.py`：`StructuredSlideDeckModel`（Pydantic）；`chart_config` 映射见 `chart_mapper.py` 与 `presentation_payload.py`。
- `chart_config_normalizer.py`：outline 中 **Chart.js 风格**（`data.labels` / `data.datasets`）与 **旧式** `{ categories, series, title }` 在读入时统一为 Chart.js 风格；在 **大纲标准化**、**summeryfile 标准化**、**结构化导出入口** 落盘/校验前应用。

## 编辑器预览 vs pdf-maker（数据源说明）

| 来源 | 内容 | 用途 |
|------|------|------|
| `project.slides_data[]` | 每页含 `html_content`、标题、`content_points` 等（幻灯片编辑器 iframe 预览） | 与大纲按**索引对齐**合并后，优先用其 **标题 / 要点 / slide_type** 参与结构化 deck；`chart_config` 仍以 **大纲** 为准。 |
| `project.outline.slides[]` | `chart_config`、大纲阶段文案 | 图表数据与结构化导出的图表页必需字段来源。 |
| Presenton `presentation` JSON | `layout_group`、`layout`、`content` | 由 [`presentation_payload.py`](src/wisedeck/services/structured_export/presentation_payload.py) 从 `StructuredSlideDeckModel` 生成（用于校验、dual-write 快照；不再发往外部 Next 服务）。 |

幻灯片编辑器预览主要是 **HTML**，与 Presenton TSX 模板 **并非同一渲染栈**。在未配置每页 Presenton 布局时，导出仍使用默认启发式（图表页 `neo-general:title-metrics-with-chart`，要点页 `swift:simple-bullet-points-layout`）。要对齐 pdf-maker 与某一 Presenton 模板，可在对应 `slides_data` 行写入可选字段（见下节）。

### slides_data 可选字段（Presenton 模板对齐）

可为某一页写入下列键之一（供 [`slides_data_presenton.py`](src/wisedeck/services/structured_export/slides_data_presenton.py) 读取）：

| 键 | 说明 |
|----|------|
| `structured_export_layout` | 完整布局 id，如 `neo-general:title-metrics-with-chart`（**必须**含 `:`） |
| `presenton_layout_full` | 与上一项同义 |
| `structured_export_layout_group` + `structured_export_layout` | 分组 + 布局 id（无 `:` 时自动拼接为 `group:layoutId`） |
| `presenton_layout_group` + `presenton_layout` | 同上别名 |

未设置时继承默认启发式。

### slides_data.presenton_slide（双写快照）

可在 `slides_data[]` 每一项上持久化 **`presenton_slide`**：形状与 Presenton slide JSON 对齐（含 `layout_group`、`layout`、`content`、`properties`、`id` 等）。实现见 [`dual_write.py`](src/wisedeck/services/structured_export/dual_write.py)。

- **导出优先级**：若大纲页数与 `slides_data` 长度对齐，且 **每一页** 都存在校验通过的 **`presenton_slide`**，则结构化导出 **优先**用组装的 presentation JSON 注册会话（响应头 **`X-WiseDeck-Presentation-Source: dual-write`**）；否则仍由 `StructuredSlideDeckModel` 即时生成（**`deck`**）。
- **回填**：设置环境变量 **`WISEDECK_DUAL_WRITE_PERSIST_ON_EXPORT=1`** 时，在非 `python` 导出成功后，会将当前由 deck 计算出的 Presenton **slides[]** 合并写入 **`slides_data[].presenton_slide`**（便于下次命中 dual-write）。

## 产品定义：「高质量布局」与同构 HTML

- **当前实现**：幻灯片编辑器工具栏「结构化导出（高质量布局）」对应 **`mode=homomorphic_editable`**：服务端 Playwright 打开 **`GET /api/projects/{id}/internal/preview/slides-html`**，注入 dom-to-pptx，再 **`POST .../pptx-merge-native-charts`** 合并原生图表（失败则回退截图版 **`homomorphic`**）。
- **兼容**：历史查询参数 **`mode=render`** / **`mode=stable`** 仍会被接受，并在服务端 **映射为 `homomorphic_editable`**（响应带弃用提示头）。
- **路线图备忘**：[`docs/structured-export-dual-write-roadmap.md`](docs/structured-export-dual-write-roadmap.md)、[`structured-export-editable-charts-pipeline.md`](docs/structured-export-editable-charts-pipeline.md)。

## Presenton Next.js（render-service）归档说明

主线已不再依赖独立的 Presenton **`render-service`** 进程；Git 历史中可查移除前的 Next subtree。占位说明见仓库根 [`render-service/README.md`](render-service/README.md)。

### slides_data.slide_contract_version（HTML 契约版本）

- **字段**：每页可选 **`slide_contract_version`**（字符串），由服务端在 [`slide_routes` 批量保存](src/wisedeck/web/route_modules/slide_routes.py) 时若缺失则写入当前常量（如 **`2026.04`**）。
- **用途**：未来「服务端打开与 iframe 同款 HTML」导出回归对比与渐进迁移。

### API 与编辑器工具栏

- **`mode=python`**（纯 Python）：HTTP 仍支持；编辑器可不展示单独入口。前端 [`projectEditorShareExport.js`](src/wisedeck/web/static/js/pages/project/slides_editor/projectEditorShareExport.js) 保留传参能力。

## 导出模式矩阵（结构化 PPTX vs PDF）

| 能力 | 入口 / mode | 说明 |
|------|-------------|------|
| 结构化 PPTX `auto` | `GET .../export/structured-pptx` 默认 | 由 `WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE` 控制（默认 **`homomorphic-editable`**）：Playwright 截图 slides-html；缺页级 HTML 时可退回 python-pptx。 |
| 结构化 PPTX `homomorphic` | `?mode=homomorphic` | 截图 slides-html → 图像幻灯片 + 合并原生图表。 |
| 结构化 PPTX `homomorphic_editable` | `?mode=homomorphic_editable` | Playwright + dom-to-pptx → 可编辑形状 + 合并原生图表（失败回退 `homomorphic`）。 |
| `render` / `stable`（兼容） | `?mode=render` / `?mode=stable` | **映射为 `homomorphic_editable`**（HTTP 弃用提示）。 |
| 结构化 PPTX `python` | `?mode=python` | 仅 python-pptx + `chart_mapper`，不经 slides-html；版式可能与编辑器预览不一致。 |
| 项目 PDF | `GET .../export/pdf` 等 | 后端 HTML→PDF 管线；与结构化 PPTX **独立**。 |

导出前 Python 侧会校验 Presenton 形状 payload（若使用 dual-write）：每页 `layout` 含 `template:layoutId`；含 `chart` 的页 **categories / series / values** 非空（见 `presentation_payload.assert_presenton_export_payload_ready`）。

## 环境变量

| 变量 | 说明 |
|------|------|
| `WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE` | 控制 `mode=auto`：**默认 `homomorphic-editable`**（Playwright + slides-html）；可选 `homomorphic`、`python-only`、`wisedeck-html` 等。历史值 **`render-service` 已废弃**，读取时视为 `homomorphic-editable` 并记录 warning。 |
| `WISEDECK_DUAL_WRITE_PERSIST_ON_EXPORT` | 设为 `1`/`true`：非 `python` 结构化导出成功后把 deck 推导的 **`presenton_slide`** 写回 `slides_data`（默认关闭）。 |
| `WISEDECK_APP_DATA_DIRECTORY` | 应用数据目录（exports/images 等子路径） |
| `WISEDECK_HOMOMORPHIC_CHART_BOX_PT` | 可选：`left,top,width,height`（点），原生图表叠加区域 |

以下为 **已移除 / 无效** 的环境变量（若仍存在将被忽略）：`WISEDECK_RENDER_SERVICE_URL`、`WISEDECK_ALLOW_LEGACY_RENDER_SERVICE`、`WISEDECK_STRUCTURED_PPTX_ALLOW_PYTHON_ONLY`、`WISEDECK_STRUCTURED_PPTX_ALLOW_PYTHON_FALLBACK`（与旧 render-service 降级逻辑一并删除）。

### Windows 结构化导出（截图/Playwright）排障速记

- **Playwright 依赖 asyncio 子进程**：Windows 下必须使用 **`WindowsProactorEventLoopPolicy`**，否则可能报 `NotImplementedError`（`asyncio.create_subprocess_exec`）。
  - Uvicorn 的 worker 进程会直接 `import wisedeck.main:app`，因此事件循环策略需要在 `src/wisedeck/main.py` **模块顶层**尽早设置（`run.py` 里的设置不会影响 worker）。
- **浏览器安装**：若 Playwright 已安装但缺浏览器，可运行 `python -m playwright install chromium`（在你的虚拟环境/uv 环境里执行）。
- **临时绕过截图链路**：若不想依赖 Playwright，可用 `?mode=python` 或设置 `WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE=python-only`（会牺牲 DOM 测量带来的版式一致性）。

## 品牌化说明（WiseDeck）

Python 包目录仍为 `landppt`（`pyproject` `name` 未改），以降低与上游 fork 合并冲突；用户可见名称与 OpenAPI 标题已使用 **WiseDeck**。

## 依赖（Python）

- `python-pptx`、`lxml`、`pathvalidate`（见 `pyproject.toml`）

## 手动验收清单（排版与原生图）

在同一项目、同一大纲与已生成幻灯片的前提下：

1. **`mode=auto`（默认）**：导出成功；标题/要点与 **slides_data** 文案对齐（若已编辑幻灯片）。
2. **`mode=homomorphic_editable`**：形状可编辑性与图表原生合并符合预期；必要时验证向 **`homomorphic`** 的回退。
3. **`mode=python`**：仍可通过 URL 调用。
4. **回归**：仅有大纲、尚未生成 `slides_data` 时可导出（以大纲与默认模板为准）。
