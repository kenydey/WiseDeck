"""
幻灯片局部区域重绘 — POC / local_blur_poc 可本地执行；其余供应商占位扩展。
"""

from __future__ import annotations

import copy
import os
import time
from typing import Any, Dict, Tuple


def configured_inpaint_providers() -> Dict[str, Any]:
    primary = (os.getenv("WISEDECK_INPAINT_PROVIDER") or "").strip().lower()
    return {
        "primary": primary or None,
        "notes_zh": (
            "local_blur_poc：上传幻灯片截图 base64 + bbox，服务端模糊该区域（无需外网）。"
            "其它：gemini_flash_image / openai_image_edit 等待适配。"
        ),
    }


def bbox_normalized_guard(box: Dict[str, Any]) -> Tuple[bool, str | None]:
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


def inject_overlay_before_body_close(html: str, data_url: str) -> str:
    snippet = (
        '<div class="wd-inpaint-overlay" style="position:absolute;left:0;top:0;width:100%;height:100%;'
        'pointer-events:none;z-index:9999;">'
        f'<img src="{data_url}" style="width:100%;height:100%;object-fit:cover;" alt="" /></div>'
    )
    lower = html.lower()
    idx = lower.rfind("</body>")
    if idx >= 0:
        return html[:idx] + snippet + html[idx:]
    return html + snippet


def build_inpaint_poc_response(
    *,
    project_id: str,
    slide_index: int,
    prompt: str,
    bbox: Dict[str, Any],
) -> Dict[str, Any]:
    ok, err = bbox_normalized_guard(bbox)
    if not ok:
        return {"status": "invalid_bbox", "detail": err}

    prov = configured_inpaint_providers()
    if not prov["primary"]:
        return {
            "status": "deferred",
            "detail_zh": (
                "局部重绘尚未启用：请设置 WISEDECK_INPAINT_PROVIDER=local_blur_poc 并提供 image_base64。"
            ),
            "project_id": project_id,
            "slide_index": slide_index,
            "prompt": prompt,
            "bbox": bbox,
            "version_hint_zh": "save=true 时会先写入项目版本快照再合并 overlay。",
            "providers": prov,
        }

    return {
        "status": "not_implemented",
        "detail_zh": f"已声明供应商 {prov['primary']}，但未提供 image_base64 或非 local_blur_poc。",
        "project_id": project_id,
        "slide_index": slide_index,
        "prompt": prompt,
        "bbox": bbox,
        "providers": prov,
    }


async def maybe_save_inpaint_overlay(
    *,
    project_id: str,
    slide_index: int,
    png_b64: str,
    user_id: int,
) -> Tuple[bool, str | None]:
    """版本快照 + 写回 slides_data / slides_html。"""
    from wisedeck.services.db_project_manager import DatabaseProjectManager
    from wisedeck.services.service_instances import get_ppt_service_for_user

    from wisedeck.services.slide.inpaint_local_adapter import png_data_url_from_base64

    db_manager = DatabaseProjectManager()
    project = await db_manager.get_project(project_id, user_id=user_id)
    if not project or not project.slides_data:
        return False, "project_or_slides_missing"
    if slide_index < 0 or slide_index >= len(project.slides_data):
        return False, "slide_index_out_of_range"

    data_url = png_data_url_from_base64(png_b64)

    snap = {
        "slides_data": copy.deepcopy(project.slides_data),
        "slides_html": project.slides_html,
        "note": "before_inpaint_local_blur",
    }
    await db_manager.save_project_version(project_id, snap, user_id=user_id)

    slides = copy.deepcopy(project.slides_data)
    row = dict(slides[slide_index])
    html = str(row.get("html_content") or "")
    row["html_content"] = inject_overlay_before_body_close(html, data_url)
    row["is_user_edited"] = True
    slides[slide_index] = row

    user_svc = get_ppt_service_for_user(user_id)
    outline_title = project.title
    slides_html = user_svc._combine_slides_to_full_html(slides, outline_title)

    ok = await db_manager.save_single_slide(project_id, slide_index, row)
    if not ok:
        return False, "save_single_slide_failed"

    await db_manager.update_project_data(
        project_id,
        {"slides_data": slides, "slides_html": slides_html, "updated_at": time.time()},
        user_id=user_id,
    )
    return True, None
