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

## 已迁入 / 需维护的 Node（`render-service/`，自 Presenton `servers/nextjs`）

| 区域 | 用途 |
|------|------|
| `app/api/presentation_to_pptx_model` | Puppeteer → `PptxPresentationModel` JSON |
| `app/api/export-as-pdf` | 同 DOM → PDF |
| `app/(presentation-generator)/pdf-maker` | 导出用渲染页 |
| `app/presentation-templates/**` | Zod + TSX 组件化模板 |
| `utils/pptx_models_utils.ts` | DOM 属性 → 模型（含 `chartData` → 原生图） |
| `types/pptx_models.ts`, `types/element_attibutes.ts` | 类型 |

## WiseDeck 新增契约

- `src/wisedeck/services/structured_export/schemas.py`：`StructuredSlideDeckModel`（Pydantic）；`chart_config` 映射见 `chart_mapper.py` 与 `presentation_payload.py`。

## 环境变量

| 变量 | 说明 |
|------|------|
| `WISEDECK_RENDER_SERVICE_URL` | Next 渲染服务根 URL（如 `http://127.0.0.1:5000`）。**未设置**时，`GET .../export/structured-pptx` 仍可用，走 **纯 Python python-pptx** 路径（可编辑图表）。设置后优先尝试 Puppeteer 全量版式再回落 Python。 |
| `WISEDECK_APP_DATA_DIRECTORY` | 与 Presenton `APP_DATA_DIRECTORY` 对齐：exports/images 子目录 |
| `PUPPETEER_EXECUTABLE_PATH` | Chromium（由 render-service 使用） |
| `WISEDECK_NEXTJS_INTERNAL_URL` | render-service 内 `getNextjsInternalBaseUrl`（见 Presenton `internalBaseUrl.ts`），默认 `http://127.0.0.1:5000` |

## 品牌化说明（WiseDeck）

Python 包目录仍为 `landppt`（`pyproject` `name` 未改），以降低与上游 fork 合并冲突；用户可见名称与 OpenAPI 标题已使用 **WiseDeck**。

## 依赖（Python）

- `python-pptx`、`lxml`、`pathvalidate`（见 `pyproject.toml`）
