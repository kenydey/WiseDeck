"""
WiseDeck PPTX 导出能力说明与策略排序（对标 PPT Master 原生 DrawingML / Presenton 结构化管线）。

供 REST `/api/export/catalog`、MCP 工具与前端文案统一引用；非业务路径硬编码。
"""

from __future__ import annotations

from typing import Any, Dict, List

# 建议的「优先可编辑、最后栅格兜底」顺序（序号越小越优先尝试）。
FIDELITY_RANKING: List[str] = [
    "client_dom_merge_charts",
    "structured_homomorphic_editable",
    "structured_python_native",
    "structured_auto",
    "pptx_images_raster",
    "standard_apryse_if_enabled",
]

# 与开源参考实现的粗略对照（帮助产品与集成文档对齐预期）。
REFERENCE_PARAPHRASE_ZH = (
    "PPT Master 强调 SVG→DrawingML 全矢量可编辑；WiseDeck 以 HTML/SVG 幻灯片为主轴，"
    "通过 Presenton 系 python-pptx 模型合并原生图表，必要时使用 dom-to-pptx / 栅格页兜底。"
)


def editability_matrix() -> List[Dict[str, Any]]:
    """
    可编辑粒度矩阵（产品/集成对照），与 modes[].id 对齐。
    取值：full | high | partial | low | none | unknown | mixed
    """
    return [
        {
            "mode_id": "client_dom_merge_charts",
            "body_text_in_powerpoint": "partial",
            "vector_shapes": "partial",
            "native_charts": "full",
            "per_slide_raster_baseline": "mixed",
            "notes_zh": "dom-to-pptx 文本多为占位形状；图表由合并链路写入原生序列。",
        },
        {
            "mode_id": "structured_homomorphic_editable",
            "body_text_in_powerpoint": "high",
            "vector_shapes": "high",
            "native_charts": "full",
            "per_slide_raster_baseline": "mixed",
            "notes_zh": "服务端同构路径优先保留形状层级；失败时可能降级栅格。",
        },
        {
            "mode_id": "structured_python_native",
            "body_text_in_powerpoint": "high",
            "vector_shapes": "low",
            "native_charts": "full",
            "per_slide_raster_baseline": "none",
            "notes_zh": "拼装简单矩形文本框为主，视觉贴近模板能力弱于同构路径。",
        },
        {
            "mode_id": "structured_auto",
            "body_text_in_powerpoint": "mixed",
            "vector_shapes": "mixed",
            "native_charts": "mixed",
            "per_slide_raster_baseline": "mixed",
            "notes_zh": (
                "对应 GET …/export/structured-pptx 省略 mode 或 mode=auto：由 "
                "WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE 等在截图同构与 python-pptx 等分支间选择；"
                "可编辑粒度随实际分支而定。"
            ),
        },
        {
            "mode_id": "pptx_images_raster",
            "body_text_in_powerpoint": "none",
            "vector_shapes": "none",
            "native_charts": "none",
            "per_slide_raster_baseline": "full",
            "notes_zh": "整页图片为主，PowerPoint 内不适配逐段改字。",
        },
        {
            "mode_id": "standard_apryse_if_enabled",
            "body_text_in_powerpoint": "unknown",
            "vector_shapes": "unknown",
            "native_charts": "none",
            "per_slide_raster_baseline": "unknown",
            "notes_zh": "取决于 Apryse 转换策略与 HTML 复杂度；需部署实测矩阵。",
        },
    ]


def export_modes_catalog() -> Dict[str, Any]:
    """返回结构化导出目录（中英字段主要为 zh UI）。"""
    modes: List[Dict[str, Any]] = [
        {
            "id": "client_dom_merge_charts",
            "label_zh": "客户端导出（推荐）",
            "summary_zh": (
                "浏览器 dom-to-pptx 生成基准 PPTX，上传后服务端按大纲 chart_config "
                "合并 python-pptx 原生可编辑图表；合并失败则回退基准文件。"
            ),
            "editable_text_shapes": "partial",
            "editable_vector": "partial",
            "editable_native_charts": True,
            "api_hint": "编辑器默认入口；等价 POST …/export/pptx-merge-native-charts",
            "risk_zh": "依赖浏览器字体与渲染；Windows 下服务端结构化路径失败时已优先走此链路。",
        },
        {
            "id": "structured_homomorphic_editable",
            "label_zh": "结构化导出（高质量布局）",
            "summary_zh": (
                "历史上依赖服务端 Chromium 的同构 HTML 导出；Playwright 已移除，调用将失败或路由到其他结构化 mode。"
            ),
            "editable_text_shapes": "high",
            "editable_vector": "high",
            "editable_native_charts": True,
            "api_hint": "GET …/export/structured-pptx?mode=homomorphic_editable（多数环境下不可用）",
            "risk_zh": "已无服务端截图管线；请使用客户端 dom-to-pptx / merge-native-charts 或 python-only structured export。",
        },
        {
            "id": "structured_python_native",
            "label_zh": "结构化导出（python-pptx 纯拼装）",
            "summary_zh": "跳过 Playwright，仅用大纲数据拼装文本框与原生图表（版式简单）。",
            "editable_text_shapes": "high",
            "editable_vector": "low",
            "editable_native_charts": True,
            "api_hint": "GET …/export/structured-pptx?mode=python",
            "risk_zh": "视觉模板贴合度低于同构/HTML 路径。",
        },
        {
            "id": "structured_auto",
            "label_zh": "结构化导出（自动策略）",
            "summary_zh": (
                "服务端按站点配置在结构化导出链路间自动选择： "
                "默认参考 WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE（如 homomorphic-editable），"
                "可在截图同构、python-pptx 拼装等之间切换；明细取决于环境与输入。"
            ),
            "editable_text_shapes": "mixed",
            "editable_vector": "mixed",
            "editable_native_charts": True,
            "api_hint": "GET …/export/structured-pptx 或 GET …/export/structured-pptx?mode=auto",
            "risk_zh": "实际可编辑性与落走路径随配置与降级逻辑变化；集成时请查阅日志或显式指定 mode。",
        },
        {
            "id": "pptx_images_raster",
            "label_zh": "以图片形式导出",
            "summary_zh": "每页栅格化为图片写入 PPTX，保真度高但在 PowerPoint 中不可逐字编辑正文。",
            "editable_text_shapes": False,
            "editable_vector": False,
            "editable_native_charts": False,
            "api_hint": "POST …/export/pptx-images",
            "risk_zh": "适合极其复杂的 CSS；不适合「会后改字」场景。",
        },
        {
            "id": "standard_apryse_if_enabled",
            "label_zh": "标准导出（Apryse）",
            "summary_zh": "若部署启用：经过 Apryse 的常规 PPTX 转换路径（与站点配置相关）。",
            "editable_text_shapes": "unknown",
            "editable_vector": "unknown",
            "editable_native_charts": False,
            "api_hint": "GET …/export/pptx（异步任务）",
            "risk_zh": "取决于许可证与转换器版本；不一定优于结构化路径。",
        },
    ]
    matrix = editability_matrix()
    return {
        "schema_version": 1,
        "fidelity_ranking": FIDELITY_RANKING,
        "fidelity_summary_zh": (
            "优先顺序：客户端合并图表 → 同构高质量结构化 → python-pptx 拼装 → "
            "自动策略 → 图片型兜底 →（可选）标准 Apryse。"
        ),
        "reference_comparison_zh": REFERENCE_PARAPHRASE_ZH,
        "editability_matrix": matrix,
        "modes": modes,
    }
