# WiseDeck SVG/DrawingML Native Export - 接口边界草案（t0）

## 目标
在不破坏 WiseDeck 现有 `html_template -> slides-html -> dom-to-pptx`（以及结构化 export 的 `homomorphic_editable`）路线的前提下，
新增一条“SVG-first（ppt-master 风格）”的 native 可编辑 PPTX 导出路线。

本文件定义建议的模块边界与纯函数/薄封装接口，使得后续可以“白盒移植”`ppt-master` 的：
`svg_quality_checker -> finalize_svg -> svg_to_pptx` 以及必要的 placeholder 适配层。

## 总体 Pipeline（建议）
```mermaid
flowchart TD
  Fill[placeholder填充/校验] --> Quality[svg quality gate]
  Quality --> Finalize[finalize_svg 后处理]
  Finalize --> Convert[svg_to_pptx (DrawingML)]
  Convert --> PPTX[PPTX bytes]
```

## 1) 最顶层可移植入口（建议先做成纯函数）

### 1.1 入口：`render_pptx_from_svg_templates(...) -> bytes`

建议统一入口只关心“已经拿到可转换 SVG”，不耦合 WiseDeck 的 slides/editor 内部结构。

```python
def render_pptx_from_svg_templates(
    *,
    svg_xmls: list[str],
    slide_placeholders: list[dict[str, str]] | None,
    spec_lock: str | None,
    notes: dict[str, str] | None,
    canvas_format: str | None,
    native_shapes: bool = True,
    finalize_options: dict | None = None,
    quality_options: dict | None = None,
    strict_placeholder: bool = True,
) -> bytes:
    """
    输入：
      - svg_xmls：每页一份 SVG XML（或 SVG 片段，取决于你的抽包策略）
      - slide_placeholders：每页占位符映射；若为 None，则跳过填充（但仍做 strict 校验）
      - spec_lock：ppt-master 的 spec_lock.md 原文（或 None 表示不做漂移检测，仅做基础技术约束）
      - notes：可选，pptx_builder 层面的备注/元信息
    输出：
      - pptx bytes（native editable shapes）
    """
```

### 1.2 错误模型（建议）
为了让结构化 export 可以做 fallback：
- `SVGPlaceholdersError`：占位符未替换残留、命名错误、映射缺失
- `SVGQualityGateError`：质量门禁硬错误（ppt-master checker errors=0 才可过）
- `SVGFinalizeError`：finalize 阶段失败
- `SVGConversionError`：svg_to_pptx 转换失败/写出失败

建议所有异常都带：
- `page_index`（可选）
- `details`（可选，截断后的文本）

## 2) 占位符适配层（WiseDeck -> ppt-master）

WiseDeck 当前 HTML 模板占位符是：
`{{ page_title }}` / `{{ page_content }}` / `{{ current_page_number }}` / `{{ total_page_count }}`

ppt-master 的布局占位符通常是：
`{{TITLE}}` / `{{SUBTITLE}}` / `{{PAGE_TITLE}}` / `{{PAGE_CONTENT}}`（以及模板定义的其余标记）

因此需要一个“adapter”把 WiseDeck 的 placeholder 合约映射成 ppt-master 允许的 marker 集合。

### 2.1 建议接口：`adapt_wisedeck_placeholders(...)`
```python
def adapt_wisedeck_placeholders(
    wisedeck_placeholders: dict[str, str],
    *,
    target_marker_set: set[str] | None = None,
    strict: bool = True,
) -> dict[str, str]:
    """
    输出：ppt-master marker 映射表（key 使用 {{XXX}} 命名风格）
    strict=True 时：
      - 如果映射到的 marker 不在 target_marker_set 中，直接报错或 warning（由 strict 决定）
      - 如果 wisedeck_placeholders 缺少必要字段，也直接报错
    """
```

### 2.2 建议接口：strict 残留检测
```python
def assert_all_placeholders_replaced(
    *,
    svg_xml: str,
    allowed_marker_patterns: list[str],
    strict: bool = True,
) -> None:
    """
    strict=True：如果仍检测到 `{{...}}` 形态且非 allowed，则抛 SVGPlaceholdersError
    """
```

## 3) quality gate（复用 ppt-master 规则）

### 3.1 建议接口：`check_svg_quality(...) -> QualityReport`
```python
def check_svg_quality(
    *,
    svg_xml: str,
    spec_lock: str | None,
    quality_options: dict | None = None,
) -> "QualityReport":
    """
    QualityReport 建议包含：
      - errors: list[str]
      - warnings: list[str]
      - drift_summary: dict | None
    约定：
      - errors 非空 => 抛 SVGQualityGateError（或由调用方决定是否 fallback）
    """
```

## 4) finalize（复用 ppt-master finalize_svg）

### 4.1 建议接口：`finalize_svg_xml(...) -> str`
```python
def finalize_svg_xml(
    *,
    svg_xml: str,
    assets: dict[str, bytes] | None,
    finalize_options: dict | None = None,
) -> str:
    """
    assets：用于 embed icons / embed images 的依赖注入
    如果 ppt-master finalize 依赖文件系统目录结构，则可以先做“最小适配层”：
      - 在临时目录写入 svg_xml 与 assets
      - 让 finalize 在临时目录跑
      - 读取 finalize 输出的 svg_xml 返回给调用方
    """
```

## 5) svg_to_pptx 转换（复用 ppt-master svg_to_pptx）

### 5.1 建议接口：`convert_svg_to_pptx_bytes(...) -> bytes`
```python
def convert_svg_to_pptx_bytes(
    *,
    svg_xmls: list[str],
    output_options: dict | None = None,
    native_shapes: bool = True,
    canvas_format: str | None = None,
) -> bytes:
    """
    复用策略：
      - 把 ppt-master 的 `create_pptx_with_native_svg(...)` 做薄封装
      - 若需要文件路径：同样采用临时目录适配层
      - 返回 pptx bytes，避免上层依赖文件系统
    """
```

## 6) 与 WiseDeck structured export 的连接方式（t5 对齐）
structured export 新 mode（示例名）：
- `mode=svg_native`

建议在 `export_structured_pptx_via_svg_native(...)` 中：
1. 基于 deck/slide models 生成每页的 `wisedeck_placeholders`
2. 通过 `adapt_wisedeck_placeholders` 得到 ppt-master marker 映射
3. 生成/拿到 `svg_xmls`（这一步在 WiseDeck 端可能来自 `svg_template` 或 AI 输出）
4. 调用 `render_pptx_from_svg_templates(...)`
5. 成功后复用现有 `merge_native_charts_into_pptx_bytes(...)`（图表覆盖层保持一致）

失败 fallback：
- catch `SVGQualityGateError` / `SVGConversionError` / `SVGFinalizeError`
- 回退到现有 `export_structured_pptx_via_homomorphic_dom_to_pptx(...)`

## 7) 二阶段实现建议（降低移植风险）
Phase 1（最小闭环）：
- 先只支持：填充后的 SVG 直接进入质量门禁与 svg_to_pptx
- placeholder adapter 只实现 WiseDeck 的 4 个字段到 ppt-master 的核心标记
- final/convert 不依赖 assets（或先禁用外部图片，避免路径复杂度）

Phase 2（增强兼容）：
- assets 注入（embed images/icons）
- 更完整 placeholder 集合（按 ppt-master layouts README/某个设计 spec_lock）
- 逐步处理表格/图表的 native 可编辑性（table 可先用 python-pptx overlay 合并）

---

## 8) 与 ppt-master 的差异清单（设计草案 ↔ 当前实现 ↔ 缺口）

下表对照本文 **§1–§6 设计**、仓库内 **`svg_export/engine.py` / `svg_export/placeholder_adapter.py` / `svg_export/errors.py`**，以及 ppt-master 工作流（`svg_quality_checker`、`finalize_svg`、`svg_to_pptx`）。

| 维度 | 设计草案（本文） | WiseDeck 当前实现 | 相对 ppt-master / 设计仍缺 |
|------|------------------|-------------------|---------------------------|
| **占位符合约** | `adapt_wisedeck_placeholders` + `assert_all_placeholders_replaced`；WiseDeck `{{ page_* }}` → ppt-master `{{PAGE_TITLE}}` 等 | `placeholder_adapter.py`：`adapt_wisedeck_placeholders`、`fill_svg_placeholders`（strict 下检测残留 `{{…}}`）；映射仅 **page_title / page_content / current_page_number / total_page_count** → `PAGE_TITLE`、`CONTENT_AREA`、`PAGE_NUM`；`total_page_count` 在 strict adapt 中易因「非映射键」报错 | 未系统覆盖 ppt-master 可能出现的 **`TITLE` / `SUBTITLE` / 布局自定义 marker**；`build_slide_placeholders_from_wisedeck_contract` 直接产出 ppt-master 键，与 HTML 侧 `{{ page_title }}` 命名并存——需在文档与产品上统一「单一合约」 |
| **Quality gate** | `check_svg_quality` 返回 `QualityReport`（errors/warnings/drift）；errors≠0 抛 `SVGQualityGateError` | `engine.py` 调用 ppt-master `SVGQualityChecker().check_directory(...)`，聚合 **errors** 非空即失败 | **未透传** `quality_options`；**warnings / drift_summary** 未结构化暴露给上层或日志；与设计中「由调用方决定是否 fallback」相比，当前为 **硬失败**（合理，但缺少可配置策略） |
| **Finalize** | `finalize_svg_xml` 或临时目录桥接；可选 `assets` 注入 | `finalize_project(project_dir, options=...)` 已在临时工程目录运行；`finalize_options` 可覆盖默认布尔项 | 设计中的 **`assets: dict[str, bytes]` 显式入参** 未在公共 API 层出现；依赖写入 `svg_output/` 的文件形态；**dry_run / 按页失败** 等细粒度与设计中「按页 `page_index`」未对齐 |
| **svg_to_pptx** | `convert_svg_to_pptx_bytes` | `create_pptx_with_native_svg` 读 `svg_final/*.svg` | 与设计一致；失败统一为 `SVGConversionError` |
| **错误模型** | 四类异常 + `page_index` + `details`（截断） | `SVGPlaceholdersError`、`SVGQualityGateError`、`SVGFinalizeError`、`SVGConversionError` 已存在 | **缺少** 异常上的 **`page_index` / `details` 结构化字段**（目前多为字符串消息）；不利于导出 API 按页重试或前端展示 |
| **顶层入口签名** | `notes`、`strict_placeholder`、`quality_options` 等 | `render_pptx_from_svg_templates` 已含 `svg_xmls`、`slide_placeholders`、`spec_lock`、`canvas_format`、`native_shapes`、`finalize_options`、`quiet` | **未实现**：`notes`；**strict** 在 engine 内固定为 True（占位填充）；无独立的「仅校验不填充」模式 |
| **Structured export 连接** | `mode=svg_native` + fallback | `export_structured_pptx_via_svg_native` + `export_routes` 在失败时回退 `homomorphic_editable` | 与设计一致；可补充 **fallback 原因分类**（占位 vs 质量门 vs finalize）以便观测 |
| **spec_lock** | 可选漂移检测 | 写入临时目录 `spec_lock.md` | 与 ppt-master 一致；若 deck 无 lock 文本则为 no-op |

**结论（维护用）**：流水线主干（占位填充 → quality → finalize → svg_to_pptx）已在 `engine.py` 落地；与设计文档差距主要集中在 **占位符全集与适配策略**、**quality/finalize 的可配置与可观测性**、**异常结构体** 三类。

---

## 9) 导入元数据（manifest / 外置资源）：现状与可增强范围（对照 ppt-master）

### WiseDeck 现状

- **磁盘工作区**：`TemplateImportService.import_from_upload` 生成 `TemplateReferenceWorkspace`，写入 **`manifest.json`**（`workspace_id`、`paths`、`slide_assets` 页级 SVG/PNG 路径、`python_pptx` 可选抽取结果等）。见 `services/template/template_import_service.py`。
- **合成母版条带**：`slide_svg_bundler.bundle_slide_svgs` 将多页 SVG 合并为 **`svg_template` + 配套 `html_template`**，供全局母版存储；与 ppt-master「每页独立 `svg_output/NN.svg`」在 **存储形态** 上不同（WiseDeck 常见为单文件竖拼或首帧）。
- **DB**：`GlobalMasterTemplate.svg_template` 等字段承载 **成品字符串**；**manifest 全文默认不落库**，仅上传/导入流程的缓存目录可复现。

### ppt-master / `pptx_template_import` 类思路可对齐的点

- **layouts_index / 设计规格**：在 manifest 或 DB JSON 列中增加 **`placeholder_markers`**（从导入 SVG 正则扫描 `{{…}}`）、**`canvas_format`**、**`bundle_mode`**，便于导出前校验「模板与引擎合约」一致。
- **外置大图与多资源**：若单条 `svg_template` 过大，可考虑 **对象存储路径引用 + manifest 片段**（或 `template_asset_refs` JSON），导入服务负责解析；属于 **中长期**，需权限与生命周期策略。
- **低风险增量**：在 `global_master_template_api` 保存模板时，可选写入 **`import_manifest_summary`**（只存 `slide_count`、占位符列表哈希、来源文件名），不复制整份 manifest，避免 DB 膨胀。

### 范围评估小结

| 方案 | 工作量 | 风险 | 说明 |
|------|--------|------|------|
| 仅扩展 `manifest.json` schema（磁盘） | 低 | 低 | 与现有 `TemplateImportService` 兼容；管理端若需展示需 API 暴露 workspace 或摘要 |
| DB JSON 列存摘要 + 占位符列表 | 中 | 中 | 需迁移；利于无磁盘工作区时做 strict 校验 |
| 完整 ppt-master 式文件树 per template | 高 | 高 | 与当前「单母版 + DB」模型分歧大，不建议一步到位 |

---

## 10) banana-slides `PPTXBuilder` 与「非 SVG」导出路径的可复用点

源码参考：`banana-slides-main/backend/utils/pptx_builder.py`（**许可证以该仓库为准**；借鉴思路而非直接拷贝）。

| API / 能力 | 作用 | WiseDeck 可对接方向 |
|------------|------|---------------------|
| **`HTMLTableParser.parse_html_table` + `add_table_element`** | HTML 表格字符串 → `slide.shapes.add_table`，按 bbox 英寸定位，首行加粗、单元格字号估算 | **homomorphic / python-pptx 轨**：若结构化导出从 HTML 或中间 AST 产出表格，可复用「解析 + 尺寸分配」逻辑，避免手写表格 XML |
| **`setup_presentation_size`** | 像素 + DPI → 英寸，并按 **python-pptx 1–56 英寸** 限制缩放 | 任意从 DOM/画布导出的 **自定义幻灯片尺寸** 需 clamp 时可直接参考常量与缩放公式 |
| **`calculate_font_size` + `add_text_element`** | 按 bbox 与字数估算字号；支持 **多色 runs**（`colored_segments`）、对齐、零 margin textbox | 与 MinerU/检测框类管线类似时，可借鉴 **字号与对齐**；WiseDeck 若走「bbox → pptx」而非整页 SVG，可减少文字溢出 |
| **`add_image_element` / `add_image_placeholder`** | 图片缺失时降级为占位文本框 | 非 SVG 导出中资源缺失时的 **一致降级 UX** |
| **`DEFAULT_SLIDE_*` / `MIN_*` / `MAX_*` 字号与幻灯片边界** | 防止极端非法值 | 与 `errors` 或校验层对齐，减少无效 PPTX |
| **`_set_core_properties`** | 作者、时间等 core | 产品品牌化元数据时可对照 |

**边界**：`PPTXBuilder` 假设 **像素 bbox + 固定 DPI**；WiseDeck DOM 轨需统一坐标系后再调用同类数学，不宜混用未标定的 px 与 EMU。

---

## 11) 图表：SVG 母版占位 vs 结构化导出合并（职责边界）

| 能力 | 责任方 | 说明 |
|------|--------|------|
| **可编辑 Chart 图形** | **结构化导出**（如 `merge_native_charts_into_pptx_bytes`） | 数据来自 deck / outline 的 `chart_config`，按 slide index 叠加到已生成的 PPTX 上；**不依赖** SVG 内是否存在「图表形状」。 |
| **SVG / DrawingML 整页** | **svg_native 轨** | 母版 SVG 经 ppt-master 转为原生绘图；其中的矢量/图片是**静态视觉**，一般**不应**冒充可编辑 chart。 |
| **Office 导入后的 `{{…}}` 文本** | **模板侧**（可选注入） | 仅用于 **TITLE / BODY 类文本** 与 `build_slide_placeholders_from_wisedeck_contract` 对齐；**不在此轨注入伪 chart XML**。 |
| **若需标注「此处曾有图」** | 元数据优先 | 使用 `import_summary.pptx_layout` 中 `shape_kind: chart` 记录；或轻量 SVG 文本 `{{CHART_AREA}}`（若产品明确需要且与 merge 不冲突）。 |

**原则**：**数据图表**以结构化合并为准；**母版 SVG**负责版式与标题/正文类占位符，避免双轨写入同一 bbox 导致重叠。

---

## 12) Office 导入模板：`import_summary` 与 `template_provenance`

从 PPT/PPTX 导入时，`convert-office-template` / `TemplateImportService` 会填充 **`import_summary`**（含 `placeholder_markers`、`placeholder_hash`、`pptx_layout` 等），并在 DB 列 **`import_summary`** 中持久化（前端保存时需一并提交）。

建议的 **`template_provenance`**（字符串，可扩展）：

| 值 | 含义 |
|----|------|
| `office_libreoffice_html` | 仅 LibreOffice HTML 导出路径；无 svg_stack 注入。 |
| `office_svg_stack_injected` | PDF→SVG 合并路径，且在合并前已按 `pptx_layout` 尝试向各页 SVG 注入 `{{PAGE_TITLE}}` / `{{SUBTITLE}}` / `{{CONTENT_AREA}}`。 |
| `curated` | 人工或 AI 审定后的语义母版（未来工作流写入）。 |

---

## 13) 与 ppt-master 对齐的「审定母版」工作流（方案 D）

当 **一键注入**（导入管线内）不足以满足品牌或复杂版式时：

1. **上传 PPTX** → 系统保留 `pptx_layout` + `python_pptx` 分析摘要。  
2. **编写或合并 `design_spec`**（项目或模板侧规格）。  
3. **生成或手改 `svg_template`**，保证 `{{…}}` 与 WiseDeck / ppt-master 合约一致，并通过质量门。  
4. **审定入库**，将 `template_provenance` 设为 `curated`（或等价标记）。

**与第 12 节关系**：`office_svg_stack_injected` 适合批量；`curated` 适合高要求；二者可并存于模板库，由运营/产品区分展示。

