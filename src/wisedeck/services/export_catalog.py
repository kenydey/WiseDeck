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
                "服务端 Playwright 运行 dom-to-pptx / 同构 HTML，尽量保留可编辑形状，并合并原生图表。"
            ),
            "editable_text_shapes": "high",
            "editable_vector": "high",
            "editable_native_charts": True,
            "api_hint": "GET …/export/structured-pptx?mode=homomorphic_editable",
            "risk_zh": "服务端 Chromium 与路径长度敏感；失败时可自动降级。",
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
    return {
        "schema_version": 1,
        "fidelity_ranking": FIDELITY_RANKING,
        "fidelity_summary_zh": (
            "优先顺序：客户端合并图表 → 同构高质量结构化 → python-pptx 拼装 → "
            "自动策略 → 图片型兜底 →（可选）标准 Apryse。"
        ),
        "reference_comparison_zh": REFERENCE_PARAPHRASE_ZH,
        "modes": modes,
    }
