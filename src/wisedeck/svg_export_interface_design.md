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

