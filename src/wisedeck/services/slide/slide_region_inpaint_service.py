"""
幻灯片局部区域重绘（Inpainting）POC — 对标 Banana Slides 的 bbox + mask 流程预留接口。

当前不绑定具体供应商：通过环境变量声明意向，路由返回结构化「接入指南」，
并与项目版本 API 对齐（前端可先手动保存版本后再提交重绘）。
"""

from __future__ import annotations

import os
from typing import Any, Dict, Tuple


def configured_inpaint_providers() -> Dict[str, Any]:
    """读取可选接入配置（占位）。"""
    primary = (os.getenv("WISEDECK_INPAINT_PROVIDER") or "").strip().lower()
    return {
        "primary": primary or None,
        "notes_zh": (
            "可选值示例：gemini_flash_image / openai_image_edit（取决于站点图像配置）。"
            "未设置 WISEDECK_INPAINT_PROVIDER 时接口返回 deferred。"
        ),
    }


def bbox_normalized_guard(box: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """校验相对坐标 bbox（0–1）。"""
    keys = ("x", "y", "w", "h")
    try:
        vals = {k: float(box[k]) for k in keys}
    except (KeyError, TypeError, ValueError):
        return False, "bbox 需要包含数值字段 x,y,w,h（相对幻灯片宽高，0–1）"
    for k, v in vals.items():
        if v < 0 or v > 1:
            return False, f"{k} 必须在 0–1 之间"
    if vals["w"] <= 0 or vals["h"] <= 0:
        return False, "w/h 必须大于 0"
    return True, None


def build_inpaint_poc_response(
    *,
    project_id: str,
    slide_index: int,
    prompt: str,
    bbox: Dict[str, Any],
) -> Dict[str, Any]:
    """统一的 POC 响应：尚未调用外部 inpainting API。"""
    ok, err = bbox_normalized_guard(bbox)
    if not ok:
        return {"status": "invalid_bbox", "detail": err}

    prov = configured_inpaint_providers()
    if not prov["primary"]:
        return {
            "status": "deferred",
            "detail_zh": (
                "局部重绘尚未启用：请设置环境变量 WISEDECK_INPAINT_PROVIDER，"
                "并在接入图像供应商后在此服务内实现调用。"
            ),
            "project_id": project_id,
            "slide_index": slide_index,
            "prompt": prompt,
            "bbox": bbox,
            "version_hint_zh": (
                "建议在调用前使用 POST /api/projects/{id}/versions 保存当前幻灯片快照，便于对比回滚。"
            ),
            "providers": prov,
            "reference_architecture_zh": "对标 banana-slides inpainting_service：bbox→mask→provider→写回素材层。",
        }

    return {
        "status": "not_implemented",
        "detail_zh": f"已声明供应商 {prov['primary']}，具体调用尚在接入中。",
        "project_id": project_id,
        "slide_index": slide_index,
        "prompt": prompt,
        "bbox": bbox,
        "providers": prov,
    }
