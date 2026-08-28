"""
Generated route module extracted from the legacy web router.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import re
import secrets
import tempfile
import threading
import time
import uuid
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response, StreamingResponse
from pydantic import BaseModel

from ...ai import AIMessage, MessageRole, get_ai_provider, get_role_provider
from ...api.models import FileOutlineGenerationRequest, PPTGenerationRequest, PPTProject, TodoBoard
from ...auth.middleware import get_current_user_optional, get_current_user_required
from ...core.config import ai_config, app_config, resolve_timeout_seconds
from ...database.database import AsyncSessionLocal, get_db
from ...database.models import User
from ...services.enhanced_ppt_service import EnhancedPPTService
from ...services.pdf_to_pptx_converter import get_pdf_to_pptx_converter
from ...services.pyppeteer_pdf_converter import get_pdf_converter
from ...utils.thread_pool import run_blocking_io, to_thread
from .support import (
    _apply_no_store_headers,
    check_credits_for_operation,
    consume_credits_for_operation,
    get_ppt_service_for_user,
    logger,
    ppt_service,
    templates,
)

router = APIRouter()

# Bump when iframe HTML / merged slides_html semantics change for server-side parity work.
SLIDE_HTML_CONTRACT_VERSION = "2026.04"

# One-time PPTX bytes for iframe direct-import fetch (in-process; multi-worker deployments may miss hits).
_pptx_import_staging: Dict[str, Tuple[float, str, bytes]] = {}
_pptx_import_staging_lock = threading.Lock()
_PPTX_IMPORT_STAGING_TTL_SEC = 900
_PPTX_IMPORT_STAGING_MAX_BYTES = 80 * 1024 * 1024


def _pptx_import_staging_gc() -> None:
    now = time.time()
    with _pptx_import_staging_lock:
        dead = [k for k, (exp, _, _) in _pptx_import_staging.items() if exp < now]
        for k in dead:
            _pptx_import_staging.pop(k, None)


class NormalizePptxtojsonBody(BaseModel):
    raw: Dict[str, Any]


def _merge_pptx_bytes_into_slides_data(
    slides_data: List[Any],
    pptx_bytes: bytes,
) -> Tuple[List[Any], Dict[str, Any], int]:
    """Parse PPTX via pptxtojson and merge PPTist-shaped fields into slides_data by index."""
    from ...services.slide.pptist_background_utils import normalize_slide_background
    from ...services.slide.pptx_roundtrip_bridge import pptx_bytes_to_pptist_slides

    pptist_slides, meta = pptx_bytes_to_pptist_slides(pptx_bytes, fixed_viewport=True)
    if len(pptist_slides) != len(slides_data):
        raise ValueError(
            f"PPTX has {len(pptist_slides)} slide(s) but project has {len(slides_data)}; "
            "every slide must have exportable html_content and counts must match."
        )
    merged = list(slides_data)
    for i, slide in enumerate(pptist_slides):
        if i >= len(merged):
            break
        cur = merged[i] if isinstance(merged[i], dict) else {}
        cur["schema_version"] = 1
        cur["elements_source"] = "pptx_bridge"
        cur["elements"] = slide.get("elements", [])
        cur["background"] = normalize_slide_background(slide.get("background"))
        cur["animations"] = slide.get("animations", [])
        cur["notes"] = slide.get("notes", [])
        cur["remark"] = slide.get("remark", "")
        merged[i] = cur
    seeded_slides = len(pptist_slides)
    # Ensure every row has a list elements (embedded editor gate uses Array.isArray).
    for idx in range(len(merged)):
        row = merged[idx]
        if not isinstance(row, dict):
            merged[idx] = {
                "schema_version": 1,
                "elements": [],
                "elements_source": "pptx_bridge",
                "background": {"type": "solid", "color": "#fff"},
                "animations": [],
                "notes": [],
                "remark": "",
            }
            continue
        els = row.get("elements")
        if not isinstance(els, list):
            fixed = dict(row)
            fixed["elements"] = []
            merged[idx] = fixed
    return merged, meta, seeded_slides


def _ensure_slide_contract_version_on_rows(slides_data: List[Any]) -> List[Any]:
    """Attach slide_contract_version for future same-HTML export parity (optional field)."""
    out: List[Dict[str, Any]] = []
    for row in slides_data:
        if not isinstance(row, dict):
            out.append(row)
            continue
        r = dict(row)
        if not r.get("slide_contract_version"):
            r["slide_contract_version"] = SLIDE_HTML_CONTRACT_VERSION
        out.append(r)
    return out


def _index_existing_slides_by_position(
    slides_data: List[Any],
) -> Tuple[Dict[int, Dict[str, Any]], Dict[str, Dict[str, Any]]]:
    """Map slide index and optional id to existing DB row."""
    by_index: Dict[int, Dict[str, Any]] = {}
    by_id: Dict[str, Dict[str, Any]] = {}
    if not isinstance(slides_data, list):
        return by_index, by_id
    for i, row in enumerate(slides_data):
        if not isinstance(row, dict):
            continue
        by_index[i] = row
        sid = row.get("id")
        if sid is not None and str(sid).strip():
            by_id[str(sid)] = row
    return by_index, by_id


def _resolve_existing_slide_row(
    index: int,
    incoming: Dict[str, Any],
    by_index: Dict[int, Dict[str, Any]],
    by_id: Dict[str, Dict[str, Any]],
) -> Dict[str, Any]:
    existing = by_index.get(index)
    if existing:
        return existing
    sid = incoming.get("id")
    if sid is not None and str(sid).strip():
        return by_id.get(str(sid), {})
    return {}


def _merge_pptist_save_with_existing_visual_ssot(
    existing_row: Dict[str, Any],
    incoming: Dict[str, Any],
    index: int,
) -> Dict[str, Any]:
    """Merge PPTist vector save with existing row; preserve visual SSOT when incoming has no HTML."""
    from ...services.slide.pptist_background_utils import normalize_slide_background
    from ...services.slide.pptist_preview_html import pptist_slide_to_preview_html

    existing_row = existing_row if isinstance(existing_row, dict) else {}
    incoming = incoming if isinstance(incoming, dict) else {}

    slide_data: Dict[str, Any] = dict(existing_row)
    background = normalize_slide_background(incoming.get("background"))

    slide_data.update(
        {
            "page_number": index + 1,
            "title": incoming.get("title", existing_row.get("title", f"Slide {index + 1}")),
            "is_user_edited": True,
            "schema_version": incoming.get("schema_version", existing_row.get("schema_version", 1)),
            "elements_source": "user_edit",
            "id": incoming.get("id") or existing_row.get("id"),
            "elements": incoming.get("elements", [])
            if isinstance(incoming.get("elements"), list)
            else [],
            "notes": incoming.get("notes", existing_row.get("notes", [])),
            "remark": incoming.get("remark", existing_row.get("remark", "")),
            "animations": incoming.get("animations", existing_row.get("animations", [])),
            "turningMode": incoming.get("turningMode", existing_row.get("turningMode")),
            "sectionTag": incoming.get("sectionTag", existing_row.get("sectionTag")),
            "type": incoming.get("type", existing_row.get("type")),
            "background": background,
        }
    )

    incoming_html = incoming.get("html_content")
    has_incoming_html = isinstance(incoming_html, str) and bool(incoming_html.strip())

    if has_incoming_html:
        slide_data["html_content"] = incoming_html
        try:
            slide_data["pptist_aligned_preview_html"] = pptist_slide_to_preview_html(slide_data)
        except Exception:
            slide_data["pptist_aligned_preview_html"] = (
                existing_row.get("pptist_aligned_preview_html")
                or slide_data.get("pptist_aligned_preview_html")
                or ""
            )
    else:
        slide_data["html_content"] = (
            existing_row.get("html_content") or slide_data.get("html_content") or ""
        )
        prior_aligned = existing_row.get("pptist_aligned_preview_html") or ""
        if isinstance(prior_aligned, str) and prior_aligned.strip():
            slide_data["pptist_aligned_preview_html"] = prior_aligned
        else:
            try:
                slide_data["pptist_aligned_preview_html"] = pptist_slide_to_preview_html(slide_data)
            except Exception:
                slide_data["pptist_aligned_preview_html"] = ""
        if not (slide_data.get("html_content") or "").strip():
            aligned = slide_data.get("pptist_aligned_preview_html") or ""
            if aligned:
                slide_data["html_content"] = aligned

    from ...services.slide.slide_visual_sync import touch_slide_document_from_elements

    return touch_slide_document_from_elements(slide_data)


class SlideBatchRegenerateRequest(BaseModel):
    """Batch slide regeneration request (0-based indices)."""
    slide_indices: Optional[List[int]] = None
    regenerate_all: bool = False
    scenario: Optional[str] = None
    topic: Optional[str] = None
    requirements: Optional[str] = None
    language: str = "zh"


@router.post("/api/projects/{project_id}/slides/{slide_number}/regenerate/async")
async def regenerate_slide_async(
    project_id: str,
    slide_number: int,
    user: User = Depends(get_current_user_required),
    skip_reference: bool = Query(False),
):
    """Regenerate a specific slide in background to avoid reverse-proxy timeouts.

    Returns immediately with task_id. Poll /api/wisedeck/tasks/{task_id} for progress/result.

    Query ``skip_reference=true`` skips reference-document injection for this run (see ``batch_regenerate_slides``).
    """
    from ...services.background_tasks import get_task_manager, TaskStatus

    task_manager = get_task_manager()

    metadata_filter = {
        "project_id": project_id,
        "slide_number": slide_number,
        "user_id": user.id,
    }

    existing_task = await task_manager.find_active_task_async(
        task_type="slide_regeneration",
        metadata_filter=metadata_filter,
    )
    if existing_task:
        return JSONResponse(
            status_code=409,
            content={
                "status": "already_processing",
                "task_id": existing_task.task_id,
                "message": "当前页已有重新生成任务正在执行",
                "polling_endpoint": f"/api/wisedeck/tasks/{existing_task.task_id}",
            },
        )

    # Check credits before scheduling background AI work (only billable for WiseDeck provider).
    try:
        user_ppt_service = get_ppt_service_for_user(user.id)
        _, slide_role_settings = await user_ppt_service.get_role_provider_async("slide_generation")
        slide_provider_name = slide_role_settings.get("provider")
        has_credits, required, balance = await check_credits_for_operation(
            user.id, "slide_generation", 1, provider_name=slide_provider_name
        )
        if not has_credits:
            return JSONResponse(
                status_code=402,
                content={
                    "status": "insufficient_credits",
                    "message": f"积分不足，幻灯片重新生成需要 {required} 积分，当前余额 {balance} 积分",
                    "required": required,
                    "balance": balance,
                },
            )
    except Exception as e:
        logger.error(f"Credits pre-check failed for regenerate_slide_async: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"积分校验失败: {str(e)}"},
        )

    async def slide_regeneration_task():
        # Provide a tiny progress bump immediately after scheduling.
        try:
            task_manager.update_task_status(task_id, TaskStatus.RUNNING, progress=1.0)
        except Exception:
            pass

        target_index = max(0, int(slide_number) - 1)
        batch_payload = SlideBatchRegenerateRequest(slide_indices=[target_index])
        batch_result = await _batch_regenerate_slides_core(
            project_id, batch_payload, user, skip_reference=skip_reference
        )
        if not isinstance(batch_result, dict) or not batch_result.get("success"):
            raise RuntimeError((batch_result or {}).get("error") or "Slide regeneration failed")

        results = batch_result.get("results") or []
        successful = next((item for item in results if item.get("success") and item.get("slide_data")), None)
        if not successful:
            raise RuntimeError("Slide regeneration produced no slide payload")

        return {
            "success": True,
            "slide_index": target_index,
            "slide_number": target_index + 1,
            "slide_data": successful["slide_data"],
        }

    task_id = task_manager.submit_task(
        task_type="slide_regeneration",
        func=slide_regeneration_task,
        metadata={
            "project_id": project_id,
            "slide_number": slide_number,
            "user_id": user.id,
        },
    )

    return JSONResponse(
        {
            "status": "processing",
            "task_id": task_id,
            "message": f"第 {slide_number} 页已开始后台重新生成",
            "polling_endpoint": f"/api/wisedeck/tasks/{task_id}",
        }
    )


@router.post("/api/projects/{project_id}/slides/batch-regenerate")
async def batch_regenerate_slides(
    project_id: str,
    payload: SlideBatchRegenerateRequest,
    user: User = Depends(get_current_user_required),
    skip_reference: bool = Query(False),
):
    """Regenerate multiple slides (or all slides) in one request.

    Query ``skip_reference=true`` omits uploaded reference documents from the prompt for this
    request only (non-template generation path). Global master template path does not inject
    reference today; this flag has no effect there.
    """
    return await _batch_regenerate_slides_core(project_id, payload, user, skip_reference=skip_reference)


async def _batch_regenerate_slides_core(
    project_id: str,
    payload: SlideBatchRegenerateRequest,
    user: User,
    skip_reference: bool = False,
):
    """Internal batch regeneration (also used by background tasks); ``skip_reference`` is a plain bool."""
    try:
        user_ppt_service = get_ppt_service_for_user(user.id)
        project = await user_ppt_service.project_manager.get_project(project_id, user_id=user.id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        if not project.outline:
            raise HTTPException(status_code=400, detail="Project outline not found")

        if not project.confirmed_requirements:
            raise HTTPException(status_code=400, detail="Project requirements not confirmed")

        if isinstance(project.outline, dict):
            outline_slides = project.outline.get("slides", [])
            outline_title = project.outline.get("title", project.title)
        else:
            outline_slides = project.outline.slides if hasattr(project.outline, "slides") else []
            outline_title = project.outline.title if hasattr(project.outline, "title") else project.title

        total_slides = len(outline_slides)
        if total_slides <= 0:
            raise HTTPException(status_code=400, detail="No slides found in outline")

        # 关键修复：当 slides_data 缺页时，按 outline/page_number 归一化，避免批量重新生成错页写入。
        try:
            if project.slides_data is None:
                project.slides_data = []

            normalized = [None] * total_slides
            unplaced = []

            for s in (project.slides_data or []):
                if not isinstance(s, dict):
                    continue
                pn = s.get("page_number", None)
                if isinstance(pn, str):
                    try:
                        pn = int(pn)
                    except Exception:
                        pn = None
                if isinstance(pn, int) and 1 <= pn <= total_slides and normalized[pn - 1] is None:
                    normalized[pn - 1] = s
                else:
                    unplaced.append(s)

            for s in unplaced:
                try:
                    idx = normalized.index(None)
                except ValueError:
                    break
                normalized[idx] = s

            for i in range(total_slides):
                if normalized[i] is None:
                    oslide = outline_slides[i] if i < len(outline_slides) else {}
                    title = oslide.get("title") if isinstance(oslide, dict) else None
                    slide_type = (oslide.get("slide_type") or oslide.get("type")) if isinstance(oslide, dict) else None
                    content_points = oslide.get("content_points") if isinstance(oslide, dict) else None
                    normalized[i] = {
                        "page_number": i + 1,
                        "title": title or f"Slide {i + 1}",
                        "html_content": "<div>Pending</div>",
                        "slide_type": slide_type or "content",
                        "content_points": content_points if isinstance(content_points, list) else [],
                        "is_user_edited": False
                    }
                else:
                    normalized[i]["page_number"] = i + 1

            project.slides_data = normalized
        except Exception as normalize_err:
            logger.warning(f"Slides normalization skipped for batch_regenerate {project_id}: {normalize_err}")

        # Determine target indices (0-based).
        if payload.regenerate_all or not payload.slide_indices:
            target_indices = list(range(total_slides))
        else:
            target_indices = sorted(set(payload.slide_indices))

        invalid_indices = [i for i in target_indices if i < 0 or i >= total_slides]
        if invalid_indices:
            raise HTTPException(status_code=400, detail=f"Invalid slide indices: {invalid_indices}")

        # Check credits before any AI calls (only billable for WiseDeck provider).
        _, slide_role_settings = await user_ppt_service.get_role_provider_async("slide_generation")
        slide_provider_name = slide_role_settings.get("provider")
        has_credits, required, balance = await check_credits_for_operation(
            user.id, "slide_generation", len(target_indices), provider_name=slide_provider_name
        )
        if not has_credits:
            return {
                "success": False,
                "error": f"积分不足，批量幻灯片重新生成需要 {required} 积分，当前余额 {balance} 积分",
            }

        # Prepare generation context once.
        system_prompt = user_ppt_service._load_prompts_md_system_prompt()
        selected_template = await user_ppt_service._ensure_global_master_template_selected(project_id)

        if project.slides_data is None:
            project.slides_data = []

        # Ensure slides_data has enough entries for all slides.
        while len(project.slides_data) < total_slides:
            page_number = len(project.slides_data) + 1
            project.slides_data.append({
                "page_number": page_number,
                "title": f"Slide {page_number}",
                "html_content": "<div>Pending</div>",
                "slide_type": "content",
                "content_points": [],
                "is_user_edited": False,
                "slide_contract_version": SLIDE_HTML_CONTRACT_VERSION,
            })

        results: List[Dict[str, Any]] = []

        for slide_index in target_indices:
            slide_number = slide_index + 1  # 1-based for prompts/templates
            slide_outline = outline_slides[slide_index]
            try:
                if selected_template:
                    new_html_content = await user_ppt_service._generate_slide_with_template(
                        slide_outline,
                        selected_template,
                        slide_number,
                        total_slides,
                        project.confirmed_requirements
                    )
                else:
                    new_html_content = await user_ppt_service._generate_single_slide_html_with_prompts(
                        slide_outline,
                        project.confirmed_requirements,
                        system_prompt,
                        slide_number,
                        total_slides,
                        outline_slides,
                        project.slides_data,
                        project_id=project_id,
                        include_reference=not skip_reference,
                    )

                existing_slide = project.slides_data[slide_index] if slide_index < len(project.slides_data) else {}
                updated_slide = {
                    "page_number": slide_number,
                    "title": slide_outline.get("title", existing_slide.get("title", f"Slide {slide_number}")),
                    "html_content": new_html_content,
                    "slide_type": slide_outline.get("slide_type", existing_slide.get("slide_type", "content")),
                    "content_points": slide_outline.get("content_points", existing_slide.get("content_points", [])),
                    "is_user_edited": existing_slide.get("is_user_edited", False),
                    **{k: v for k, v in (existing_slide or {}).items() if k not in ["page_number", "title", "html_content", "slide_type", "content_points", "is_user_edited"]}
                }

                project.slides_data[slide_index] = updated_slide

                results.append({
                    "slide_index": slide_index,
                    "slide_number": slide_number,
                    "success": True,
                    "slide_data": updated_slide
                })
            except Exception as e:
                logger.error(f"Batch regenerate failed for project {project_id} slide {slide_number}: {e}")
                results.append({
                    "slide_index": slide_index,
                    "slide_number": slide_number,
                    "success": False,
                    "error": str(e)
                })

        # Rebuild combined HTML once.
        project.slides_html = user_ppt_service._combine_slides_to_full_html(project.slides_data, outline_title)
        project.updated_at = time.time()

        updated_count = len([r for r in results if r.get("success")])

        # Persist: save regenerated slides and update project HTML.
        try:
            from ...services.db_project_manager import DatabaseProjectManager
            db_manager = DatabaseProjectManager()

            for r in results:
                if not r.get("success") or not r.get("slide_data"):
                    continue
                await db_manager.save_single_slide(project_id, int(r["slide_index"]), r["slide_data"])

            await db_manager.update_project_data(project_id, {
                "slides_html": project.slides_html,
                "updated_at": project.updated_at
            })
        except Exception as save_error:
            logger.error(f"Batch regenerate DB save failed for project {project_id}: {save_error}")

        if updated_count > 0:
            await consume_credits_for_operation(
                user.id,
                "slide_generation",
                updated_count,
                description=f"批量幻灯片重新生成: {updated_count}页",
                reference_id=project_id,
                provider_name=slide_provider_name,
            )

        return {
            "success": updated_count > 0,
            "updated_count": updated_count,
            "total_requested": len(target_indices),
            "results": results
        }

    except HTTPException:
        raise
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/api/projects/{project_id}/slides/batch-regenerate/async")
async def batch_regenerate_slides_async(
    project_id: str,
    payload: SlideBatchRegenerateRequest,
    user: User = Depends(get_current_user_required),
    skip_reference: bool = Query(False),
):
    """Batch regenerate slides in background to avoid reverse-proxy timeouts.

    Returns immediately with task_id. Poll /api/wisedeck/tasks/{task_id} for progress/result.

    Query ``skip_reference=true`` matches the synchronous batch endpoint behavior.
    """
    from ...services.background_tasks import get_task_manager, TaskStatus

    task_manager = get_task_manager()

    metadata_filter = {
        "project_id": project_id,
        "user_id": user.id,
    }

    existing_task = await task_manager.find_active_task_async(
        task_type="slides_batch_regeneration",
        metadata_filter=metadata_filter,
    )
    if existing_task:
        return JSONResponse(
            status_code=409,
            content={
                "status": "already_processing",
                "task_id": existing_task.task_id,
                "message": "当前项目已有批量重新生成任务正在执行",
                "polling_endpoint": f"/api/wisedeck/tasks/{existing_task.task_id}",
            },
        )

    # Check credits before scheduling background AI work (only billable for WiseDeck provider).
    try:
        user_ppt_service = get_ppt_service_for_user(user.id)
        quantity = len(payload.slide_indices or [])
        if payload.regenerate_all or not payload.slide_indices:
            project = await user_ppt_service.project_manager.get_project(project_id, user_id=user.id)
            if project and project.outline:
                if isinstance(project.outline, dict):
                    quantity = len(project.outline.get("slides", []) or [])
                else:
                    quantity = len(getattr(project.outline, "slides", []) or [])
        _, slide_role_settings = await user_ppt_service.get_role_provider_async("slide_generation")
        slide_provider_name = slide_role_settings.get("provider")
        has_credits, required, balance = await check_credits_for_operation(
            user.id, "slide_generation", max(1, int(quantity)), provider_name=slide_provider_name
        )
        if not has_credits:
            return JSONResponse(
                status_code=402,
                content={
                    "status": "insufficient_credits",
                    "message": f"积分不足，批量幻灯片重新生成需要 {required} 积分，当前余额 {balance} 积分",
                    "required": required,
                    "balance": balance,
                },
            )
    except Exception as e:
        logger.error(f"Credits pre-check failed for batch_regenerate_slides_async: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"积分校验失败: {str(e)}"},
        )

    async def slides_batch_regeneration_task():
        try:
            task_manager.update_task_status(task_id, TaskStatus.RUNNING, progress=1.0)
        except Exception:
            pass

        result = await _batch_regenerate_slides_core(
            project_id, payload, user, skip_reference=skip_reference
        )
        if not isinstance(result, dict) or not result.get("success"):
            raise RuntimeError((result or {}).get("error") or "Batch slide regeneration failed")
        return result

    task_id = task_manager.submit_task(
        task_type="slides_batch_regeneration",
        func=slides_batch_regeneration_task,
        metadata={
            "project_id": project_id,
            "user_id": user.id,
            "regenerate_all": bool(payload.regenerate_all),
            "slide_indices": payload.slide_indices,
            "skip_reference": bool(skip_reference),
        },
    )

    return JSONResponse(
        {
            "status": "processing",
            "task_id": task_id,
            "message": "批量重新生成任务已开始执行",
            "polling_endpoint": f"/api/wisedeck/tasks/{task_id}",
        }
    )


@router.post("/api/projects/{project_id}/slides/{slide_index}/save")
async def save_single_slide_content(
    project_id: str,
    slide_index: int,
    request: Request,
    user: User = Depends(get_current_user_required)
):
    """保存单个幻灯片内容到数据库
    
    重要：此函数只保存被编辑的单个幻灯片，不会触碰其他幻灯片数据，
    以避免与正在进行的PPT生成过程产生冲突。
    """
    try:
        logger.info(f"🔄 开始保存项目 {project_id} 的第 {slide_index + 1} 页 (索引: {slide_index})")

        data = await request.json()
        html_content = data.get('html_content', '')
        requested_is_user_edited = data.get('is_user_edited', True)
        is_user_edited = bool(requested_is_user_edited)

        logger.info(f"📄 接收到HTML内容，长度: {len(html_content)} 字符")

        if not html_content:
            logger.error("❌ HTML内容为空")
            raise HTTPException(status_code=400, detail="HTML content is required")

        if slide_index < 0:
            logger.error(f"❌ 幻灯片索引不能为负数: {slide_index}")
            raise HTTPException(status_code=400, detail=f"Slide index cannot be negative: {slide_index}")

        # 直接从数据库获取该幻灯片的当前数据
        from ...services.db_project_manager import DatabaseProjectManager
        db_manager = DatabaseProjectManager()
        
        # 获取项目基本信息确认项目存在
        project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
        if not project:
            logger.error(f"❌ 项目 {project_id} 不存在")
            raise HTTPException(status_code=404, detail="Project not found")

        # 获取当前幻灯片数据（如果存在）
        existing_slide = await db_manager.get_single_slide(project_id, slide_index)
        
        # 构建要保存的幻灯片数据
        # 保留现有数据的其他字段，只更新html_content和is_user_edited
        if existing_slide:
            slide_data = existing_slide.copy()
            slide_data['html_content'] = html_content
            slide_data['is_user_edited'] = is_user_edited
        else:
            # 如果幻灯片不存在（理论上不应该发生，但做防御处理）
            slide_data = {
                "page_number": slide_index + 1,
                "title": f"Slide {slide_index + 1}",
                "html_content": html_content,
                "is_user_edited": is_user_edited
            }

        logger.debug(f"📝 更新第 {slide_index + 1} 页的内容")
        logger.debug(f"📊 幻灯片数据: 标题='{slide_data.get('title', '无标题')}', 用户编辑={is_user_edited}, 索引={slide_index}")

        # 只保存这一个幻灯片到数据库，不影响其他幻灯片
        save_success = await db_manager.save_single_slide(project_id, slide_index, slide_data)

        if save_success:
            logger.debug(f"✅ 第 {slide_index + 1} 页已成功保存到数据库")

            return {
                "success": True,
                "message": f"Slide {slide_index + 1} saved successfully to database",
                "slide_data": slide_data,
                "database_saved": True
            }
        else:
            logger.error(f"❌ 保存第 {slide_index + 1} 页到数据库失败")
            return {
                "success": False,
                "error": "Failed to save slide to database",
                "database_saved": False
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ 保存单个幻灯片时发生错误: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "database_saved": False
        }


@router.get("/api/projects/{project_id}/slides/stream")
async def stream_slides_generation(
    project_id: str,
    user: User = Depends(get_current_user_required)
):
    """Stream slides generation process"""
    try:
        user_ppt_service = get_ppt_service_for_user(user.id)
        
        # Guard: free-template must be confirmed before starting generation
        try:
            project = await user_ppt_service.project_manager.get_project(project_id, user_id=user.id)
            if project and project.project_metadata:
                metadata = project.project_metadata or {}
                if metadata.get("template_mode") == "free" and not metadata.get("free_template_confirmed"):
                    async def blocked_stream():
                        yield f"data: {json.dumps({'type': 'error', 'message': '自由模板尚未确认，请先在预览中确认/保存模板后再开始生成PPT。'})}\n\n"
                    return StreamingResponse(
                        blocked_stream(),
                        media_type="text/event-stream",
                        headers={
                            "Cache-Control": "no-cache",
                            "Connection": "keep-alive",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Cache-Control"
                        }
                    )
        except Exception:
            # If guard fails, do not block generation
            pass

        async def generate_slides_stream():
            async for chunk in user_ppt_service.generate_slides_streaming(project_id):
                yield chunk

        return StreamingResponse(
            generate_slides_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Cache-Control"
            }
        )

    except Exception as e:
        return {"error": str(e)}


@router.post("/api/projects/{project_id}/slides/cancel")
async def cancel_slides_generation(
    project_id: str,
    user: User = Depends(get_current_user_required)
):
    """Request slide generation cancellation (best-effort)."""
    try:
        user_ppt_service = get_ppt_service_for_user(user.id)
        await user_ppt_service.request_cancel_slides_generation(project_id)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/api/projects/{project_id}/slides/clear-cancel")
async def clear_slides_cancel_flag(
    project_id: str,
    user: User = Depends(get_current_user_required)
):
    """Clear the cancellation flag so a paused generation can resume."""
    try:
        user_ppt_service = get_ppt_service_for_user(user.id)
        await user_ppt_service.clear_cancel_slides_generation(project_id)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/api/projects/{project_id}/slides/cleanup")
async def cleanup_excess_slides(
    project_id: str,
    request: Request,
    user: User = Depends(get_current_user_required)
):
    """清理项目中多余的幻灯片"""
    try:
        logger.info(f"🧹 开始清理项目 {project_id} 的多余幻灯片")

        data = await request.json()
        current_slide_count = data.get('current_slide_count', 0)

        if current_slide_count <= 0:
            logger.error("❌ 无效的幻灯片数量")
            raise HTTPException(status_code=400, detail="Invalid slide count")

        project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
        if not project:
            logger.error(f"❌ 项目 {project_id} 不存在")
            raise HTTPException(status_code=404, detail="Project not found")

        # 清理数据库中多余的幻灯片
        from ...services.db_project_manager import DatabaseProjectManager
        db_manager = DatabaseProjectManager()
        deleted_count = await db_manager.cleanup_excess_slides(
            project_id,
            current_slide_count,
            user_id=user.id,
        )

        logger.info(f"✅ 项目 {project_id} 清理完成，删除了 {deleted_count} 张多余的幻灯片")

        return {
            "success": True,
            "message": f"Successfully cleaned up {deleted_count} excess slides",
            "deleted_count": deleted_count
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ 清理幻灯片失败: {e}")
        return {"success": False, "error": str(e)}


@router.put("/api/projects/{project_id}/slides")
async def save_all_slides(
    project_id: str,
    request: Request,
    user: User = Depends(get_current_user_required)
):
    """批量保存所有幻灯片数据（完整编辑器专用）。

    SSOT: prefer PPTist Slide JSON (`elements/background/animations/...`) as source of truth.
    """
    try:
        logger.info(f"🔄 开始批量保存项目 {project_id} 的所有幻灯片")

        data = await request.json()
        slides = data.get("slides")
        if slides is None:
            slides = data.get("slides_data", [])
        sync_visual = bool(data.get("sync_visual_from_elements"))
        if not isinstance(slides, list):
            logger.error("❌ 幻灯片数据格式错误")
            raise HTTPException(status_code=400, detail="Slides must be a list")

        project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
        if not project:
            logger.error(f"❌ 项目 {project_id} 不存在")
            raise HTTPException(status_code=404, detail="Project not found")

        from ...services.db_project_manager import DatabaseProjectManager

        db_manager = DatabaseProjectManager()

        existing_rows = project.slides_data if isinstance(project.slides_data, list) else []
        by_index, by_id = _index_existing_slides_by_position(existing_rows)

        normalized_slides: List[Dict[str, Any]] = []
        for index, slide in enumerate(slides):
            slide = slide if isinstance(slide, dict) else {}
            existing_row = _resolve_existing_slide_row(index, slide, by_index, by_id)
            slide_data = _merge_pptist_save_with_existing_visual_ssot(existing_row, slide, index)
            normalized_slides.append(slide_data)

        if sync_visual:
            from ...services.slide.slide_visual_sync import sync_visual_ssot_on_slides

            normalized_slides, n_synced = sync_visual_ssot_on_slides(
                normalized_slides,
                sync_html_content=False,
                only_user_edit=True,
            )
            if n_synced:
                logger.info("save_all_slides: synced aligned preview for %s slide(s)", n_synced)

        try:
            from ...services.slide.seed_image_src_inline import inline_wisedeck_api_image_urls_in_slides_data

            n_inlined = await inline_wisedeck_api_image_urls_in_slides_data(normalized_slides)
            if n_inlined:
                logger.info("save_all_slides: inlined %s image element(s)", n_inlined)
        except Exception as exc:
            logger.warning("save_all_slides image URL inline skipped: %s", exc)

        prior_count = len(project.slides_data) if isinstance(project.slides_data, list) else 0
        slides_html = getattr(project, "slides_html", None) or ""

        ok = await db_manager.save_project_slides(project_id, slides_html, normalized_slides)
        if not ok:
            logger.error("❌ save_project_slides failed for project %s", project_id)
            raise HTTPException(status_code=500, detail="Failed to persist slides")

        new_count = len(normalized_slides)
        if prior_count > new_count:
            await db_manager.cleanup_excess_slides(project_id, new_count, user_id=user.id)

        logger.info("✅ 批量保存完成，写入 projects.slides_data：%s 页", new_count)

        from ...services.slide.slide_visual_sync import enrich_slides_data_for_editor

        response_slides = enrich_slides_data_for_editor(
            normalized_slides,
            attach_resolved_preview_html=sync_visual,
        )

        return {
            "success": True,
            "message": f"Successfully saved {new_count} slides",
            "saved_count": new_count,
            "total_slides": new_count,
            "slides_data": response_slides,
            "sync_visual_from_elements": sync_visual,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ 批量保存幻灯片失败: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}


@router.post("/api/projects/{project_id}/slides/sync-visual-from-elements")
async def sync_slides_visual_from_elements(
    project_id: str,
    request: Request,
    user: User = Depends(get_current_user_required),
):
    """Regenerate pptist_aligned_preview_html from elements (optional html_content overwrite)."""
    project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    body: Dict[str, Any] = {}
    try:
        body = await request.json()
    except Exception:
        body = {}

    sync_html = bool(body.get("sync_html_content"))
    only_user_edit = body.get("only_user_edit", True) is not False

    from ...services.db_project_manager import DatabaseProjectManager
    from ...services.slide.slide_visual_sync import enrich_slides_data_for_editor, sync_visual_ssot_on_slides

    rows = project.slides_data if isinstance(project.slides_data, list) else []
    synced, n = sync_visual_ssot_on_slides(
        rows,
        sync_html_content=sync_html,
        only_user_edit=only_user_edit,
    )

    db = DatabaseProjectManager()
    slides_html = getattr(project, "slides_html", None) or ""
    ok = await db.save_project_slides(project_id, slides_html, synced)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to persist slides")

    enriched = enrich_slides_data_for_editor(synced, attach_resolved_preview_html=True)
    return {
        "success": True,
        "synced_slides": n,
        "slides_data": enriched,
        "sync_html_content": sync_html,
    }


@router.post("/api/projects/{project_id}/ssot/normalize-pptxtojson-body")
async def normalize_pptxtojson_body(
    project_id: str,
    body: NormalizePptxtojsonBody,
    user: User = Depends(get_current_user_required),
):
    """Normalize browser ``pptxtojson.parse`` JSON to PPTist slide rows (no DB write)."""
    project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    from ...services.slide.pptx_roundtrip_bridge import pptxtojson_raw_dict_to_pptist_slides
    from ...services.slide.seed_image_src_inline import inline_wisedeck_api_image_urls_in_slides_data

    try:
        slides, meta = pptxtojson_raw_dict_to_pptist_slides(body.raw, fixed_viewport=True)
    except Exception as exc:
        logger.warning("normalize-pptxtojson-body failed: %s", exc)
        raise HTTPException(status_code=400, detail=f"normalize failed: {exc}") from exc

    try:
        await inline_wisedeck_api_image_urls_in_slides_data(slides)
    except Exception as exc:
        logger.warning("normalize-pptxtojson-body image inline skipped: %s", exc)

    return JSONResponse({"success": True, "slides": slides, "meta": meta})


@router.post("/api/projects/{project_id}/full-editor/pptx-import-staging")
async def stage_pptx_import_blob(
    project_id: str,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user_required),
):
    """Stage merged PPTX for iframe fetch (large files; token one-time use)."""
    project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    raw = await file.read()
    if not raw or len(raw) < 64:
        raise HTTPException(status_code=400, detail="Empty or invalid PPTX upload")
    if len(raw) > _PPTX_IMPORT_STAGING_MAX_BYTES:
        raise HTTPException(status_code=400, detail="PPTX file too large")

    token = secrets.token_urlsafe(32)
    expires = time.time() + _PPTX_IMPORT_STAGING_TTL_SEC
    _pptx_import_staging_gc()
    with _pptx_import_staging_lock:
        _pptx_import_staging[token] = (expires, project_id, raw)

    return JSONResponse(
        {
            "success": True,
            "token": token,
            "expires_in": _PPTX_IMPORT_STAGING_TTL_SEC,
        }
    )


@router.get("/api/projects/{project_id}/full-editor/pptx-import-staging/{token}")
async def get_staged_pptx_import_blob(
    project_id: str,
    token: str,
    user: User = Depends(get_current_user_required),
):
    _pptx_import_staging_gc()
    with _pptx_import_staging_lock:
        entry = _pptx_import_staging.pop(token, None)
    if not entry:
        raise HTTPException(status_code=404, detail="Staging token invalid or expired")
    expires, staged_pid, raw = entry
    if time.time() > expires or staged_pid != project_id:
        raise HTTPException(status_code=404, detail="Staging token invalid or expired")

    project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return Response(
        content=raw,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
    )


@router.post("/api/projects/{project_id}/ssot/seed-from-client-pptx")
async def seed_ssot_from_client_pptx(
    project_id: str,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user_required),
):
    """
    Seed PPTist elements from a client-generated PPTX (recommended: dom-to-pptx + merge-native-charts).

    Parses uploaded bytes via pptxtojson and merges vector fields into slides_data by slide index.
    """
    project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not project.slides_data:
        raise HTTPException(status_code=400, detail="Project has no slides_data")

    raw = await file.read()
    if not raw or len(raw) < 64:
        raise HTTPException(status_code=400, detail="Empty or invalid PPTX upload")
    max_bytes = 80 * 1024 * 1024
    if len(raw) > max_bytes:
        raise HTTPException(status_code=400, detail="PPTX file too large")

    from ...services.db_project_manager import DatabaseProjectManager

    try:
        merged, meta, seeded = _merge_pptx_bytes_into_slides_data(project.slides_data, raw)
    except Exception as exc:
        logger.warning("seed-from-client-pptx parse failed: %s", exc)
        raise HTTPException(status_code=400, detail=f"PPTX parse failed: {exc}") from exc

    try:
        from ...services.slide.seed_image_src_inline import inline_wisedeck_api_image_urls_in_slides_data

        n_inlined = await inline_wisedeck_api_image_urls_in_slides_data(merged)
        if n_inlined:
            logger.info("seed-from-client-pptx: inlined %s image element(s)", n_inlined)
    except Exception as exc:
        logger.warning("seed-from-client-pptx image URL inline skipped: %s", exc)

    project.slides_data = merged
    project.updated_at = time.time()
    await DatabaseProjectManager().save_project(project)

    return JSONResponse(
        {
            "success": True,
            "total_slides": len(merged),
            "seeded_slides": seeded,
            "meta": meta,
        }
    )


class SlideInpaintRegionRequest(BaseModel):
    """幻灯片局部重绘 POC：bbox 为相对坐标 (x,y,w,h) ∈ [0,1]。"""

    bbox: Dict[str, Any]
    prompt: str = ""
    image_base64: Optional[str] = None
    save: bool = False


@router.post("/api/projects/{project_id}/slides/{slide_index}/inpaint-region")
async def slide_inpaint_region_poc(
    project_id: str,
    slide_index: int,
    body: SlideInpaintRegionRequest,
    user: User = Depends(get_current_user_required),
):
    """局部 inpainting：WISEDECK_INPAINT_PROVIDER=local_blur_poc 时可本地模糊 bbox。"""
    project = await ppt_service.project_manager.get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    from ...services.slide.inpaint_local_adapter import blur_bbox_region
    from ...services.slide.slide_region_inpaint_service import (
        build_inpaint_poc_response,
        configured_inpaint_providers,
        maybe_save_inpaint_overlay,
    )

    bbox = body.bbox if isinstance(body.bbox, dict) else {}
    prov = (configured_inpaint_providers().get("primary") or "").strip().lower()

    if prov == "local_blur_poc" and body.image_base64:
        ok_blur, err_blur, out_b64 = blur_bbox_region(
            image_base64=body.image_base64,
            bbox=bbox,
        )
        if not ok_blur or not out_b64:
            return JSONResponse(
                {"status": "inpaint_failed", "detail": err_blur or "unknown"},
                status_code=400,
            )
        payload: Dict[str, Any] = {
            "status": "ok",
            "provider": prov,
            "image_base64_png": out_b64,
            "project_id": project_id,
            "slide_index": slide_index,
        }
        if body.save:
            saved, serr = await maybe_save_inpaint_overlay(
                project_id=project_id,
                slide_index=slide_index,
                png_b64=out_b64,
                user_id=int(user.id),
            )
            payload["saved"] = saved
            payload["save_error"] = serr
        return JSONResponse(payload)

    payload = build_inpaint_poc_response(
        project_id=project_id,
        slide_index=slide_index,
        prompt=(body.prompt or "").strip(),
        bbox=bbox,
    )
    return JSONResponse(payload)
