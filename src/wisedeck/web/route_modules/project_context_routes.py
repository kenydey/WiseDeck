"""
Reference files, design_spec, and export job history for projects.
"""

from __future__ import annotations

import logging
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from pydantic import BaseModel, Field

from ...auth.middleware import get_current_user_required
from ...database.database import AsyncSessionLocal
from ...database.models import User
from ...database.service import DatabaseService
from ...services.design_spec_schema import deep_merge_design_spec, validate_design_spec_dict
from ...services.export_job_service import get_export_job, list_export_jobs_for_project
from ...services.project_context_augmentation import estimate_augmentation_size
from ...services.reference_file_service import (
    delete_reference,
    list_references,
    reorder_reference_files,
    reindex_reference,
    save_and_parse_reference,
    update_reference_file_fields,
)
from ...services.db_project_manager import DatabaseProjectManager

logger = logging.getLogger(__name__)

router = APIRouter()


def _project_root() -> Path:
    # src/wisedeck/web/route_modules/this_file -> repo root is parents[4]
    return Path(__file__).resolve().parents[4]


class DesignSpecPayload(BaseModel):
    design_spec: Dict[str, Any] = Field(default_factory=dict)


class DesignSpecPatch(BaseModel):
    design_spec: Optional[Dict[str, Any]] = None
    design_spec_locked: Optional[bool] = None


class ReferenceReorderPayload(BaseModel):
    file_ids: List[str] = Field(default_factory=list)


class ReferenceFilePatchPayload(BaseModel):
    include_in_prompt: Optional[bool] = None
    sort_order: Optional[int] = None


class ProjectContextSettingsPayload(BaseModel):
    reference_context_enabled: Optional[bool] = None


@router.post("/api/projects/{project_id}/reference-files")
async def upload_reference_file(
    project_id: str,
    file: UploadFile = File(...),
    parse_mode: str = Form("light"),
    user: User = Depends(get_current_user_required),
):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(content) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 25MB)")

    mode = "deep" if (parse_mode or "").strip().lower() == "deep" else "light"
    async with AsyncSessionLocal() as session:
        payload = await save_and_parse_reference(
            session,
            project_id=project_id,
            user_id=user.id,
            filename=file.filename or "upload",
            content=content,
            project_root=_project_root(),
            parse_mode=mode,
        )
    return {"status": "ok", "file": payload}


@router.get("/api/projects/{project_id}/reference-files")
async def list_reference_files(project_id: str, user: User = Depends(get_current_user_required)):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    async with AsyncSessionLocal() as session:
        files = await list_references(session, project_id)
    return {"status": "ok", "files": files}


@router.post("/api/projects/{project_id}/reference-files/reorder")
async def reorder_reference_files_route(
    project_id: str,
    body: ReferenceReorderPayload,
    user: User = Depends(get_current_user_required),
):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    async with AsyncSessionLocal() as session:
        await reorder_reference_files(session, project_id, user.id, body.file_ids)
    async with AsyncSessionLocal() as session:
        files = await list_references(session, project_id)
    return {"status": "ok", "files": files}


@router.patch("/api/projects/{project_id}/reference-files/{file_id}")
async def patch_reference_file(
    project_id: str,
    file_id: str,
    body: ReferenceFilePatchPayload,
    user: User = Depends(get_current_user_required),
):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    async with AsyncSessionLocal() as session:
        payload = await update_reference_file_fields(
            session,
            project_id,
            file_id,
            user.id,
            include_in_prompt=body.include_in_prompt,
            sort_order=body.sort_order,
        )
    if not payload:
        raise HTTPException(status_code=404, detail="File not found")
    return {"status": "ok", "file": payload}


@router.delete("/api/projects/{project_id}/reference-files/{file_id}")
async def delete_reference_file(
    project_id: str, file_id: str, user: User = Depends(get_current_user_required)
):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    async with AsyncSessionLocal() as session:
        ok = await delete_reference(session, project_id, file_id, user.id)
    if not ok:
        raise HTTPException(status_code=404, detail="File not found")
    return {"status": "ok"}


@router.post("/api/projects/{project_id}/reference-files/{file_id}/reindex")
async def reindex_reference_file(
    project_id: str,
    file_id: str,
    parse_mode: str = Query("light"),
    user: User = Depends(get_current_user_required),
):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    mode = "deep" if (parse_mode or "").strip().lower() == "deep" else "light"
    async with AsyncSessionLocal() as session:
        payload = await reindex_reference(
            session, project_id, file_id, user.id, _project_root(), parse_mode=mode
        )
    if not payload:
        raise HTTPException(status_code=404, detail="File not found")
    return {"status": "ok", "file": payload}


@router.get("/api/projects/{project_id}/prompt-context-estimate")
async def get_prompt_context_estimate(
    project_id: str,
    query_hint: str = "",
    user: User = Depends(get_current_user_required),
):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    async with AsyncSessionLocal() as session:
        est = await estimate_augmentation_size(
            project_id,
            query_hint=(query_hint or "").strip() or None,
            session=session,
            user_id=user.id,
        )
    return {"status": "ok", **est}


@router.get("/api/projects/{project_id}/context-settings")
async def get_project_context_settings(
    project_id: str,
    user: User = Depends(get_current_user_required),
):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    meta = project.project_metadata if isinstance(project.project_metadata, dict) else {}
    return {
        "status": "ok",
        "reference_context_enabled": bool(meta.get("reference_context_enabled", True)),
    }


@router.patch("/api/projects/{project_id}/context-settings")
async def patch_project_context_settings(
    project_id: str,
    body: ProjectContextSettingsPayload,
    user: User = Depends(get_current_user_required),
):
    mgr = DatabaseProjectManager()
    project = await mgr.get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    meta = dict(project.project_metadata or {})
    if body.reference_context_enabled is not None:
        meta["reference_context_enabled"] = bool(body.reference_context_enabled)
    ok = await mgr.update_project_metadata(project_id, meta, user_id=user.id)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to update metadata")
    return {"status": "ok", "project_metadata": meta}


@router.get("/api/projects/{project_id}/design-spec")
async def get_design_spec(project_id: str, user: User = Depends(get_current_user_required)):
    async with AsyncSessionLocal() as session:
        db = DatabaseService(session)
        proj = await db.project_repo.get_by_id(project_id, user_id=user.id)
        if not proj:
            raise HTTPException(status_code=404, detail="Project not found")
        return {
            "design_spec": proj.design_spec or {},
            "design_spec_version": int(getattr(proj, "design_spec_version", 1) or 1),
            "design_spec_locked": bool(getattr(proj, "design_spec_locked", False)),
        }


@router.put("/api/projects/{project_id}/design-spec")
async def put_design_spec(
    project_id: str,
    body: DesignSpecPayload,
    user: User = Depends(get_current_user_required),
):
    async with AsyncSessionLocal() as session:
        db = DatabaseService(session)
        proj = await db.project_repo.get_by_id(project_id, user_id=user.id)
        if not proj:
            raise HTTPException(status_code=404, detail="Project not found")
        if bool(getattr(proj, "design_spec_locked", False)):
            raise HTTPException(status_code=409, detail="设计规格已锁定，请先解除锁定后再保存")
        try:
            validate_design_spec_dict(body.design_spec)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e
        new_ver = int(getattr(proj, "design_spec_version", 1) or 1) + 1
        await db.project_repo.update(
            project_id,
            {"design_spec": body.design_spec, "design_spec_version": new_ver},
            user_id=user.id,
        )
    return {"status": "ok", "design_spec": body.design_spec, "design_spec_version": new_ver}


@router.patch("/api/projects/{project_id}/design-spec")
async def patch_design_spec(
    project_id: str,
    body: DesignSpecPatch,
    user: User = Depends(get_current_user_required),
):
    async with AsyncSessionLocal() as session:
        db = DatabaseService(session)
        proj = await db.project_repo.get_by_id(project_id, user_id=user.id)
        if not proj:
            raise HTTPException(status_code=404, detail="Project not found")
        if body.design_spec_locked is None and body.design_spec is None:
            raise HTTPException(status_code=400, detail="请提供 design_spec 或 design_spec_locked")
        if body.design_spec is not None:
            if bool(getattr(proj, "design_spec_locked", False)):
                raise HTTPException(status_code=409, detail="设计规格已锁定，请先解除锁定后再修改内容")
            merged = deep_merge_design_spec(
                proj.design_spec if isinstance(proj.design_spec, dict) else {}, body.design_spec
            )
            try:
                validate_design_spec_dict(merged)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e)) from e
            proj.design_spec = merged
            proj.design_spec_version = int(getattr(proj, "design_spec_version", 1) or 1) + 1
        if body.design_spec_locked is not None:
            proj.design_spec_locked = bool(body.design_spec_locked)
        proj.updated_at = time.time()
        await session.commit()
        await session.refresh(proj)
        return {
            "status": "ok",
            "design_spec": proj.design_spec or {},
            "design_spec_version": int(getattr(proj, "design_spec_version", 1) or 1),
            "design_spec_locked": bool(getattr(proj, "design_spec_locked", False)),
        }


@router.get("/api/projects/{project_id}/exports")
async def list_project_exports(
    project_id: str,
    limit: int = 50,
    user: User = Depends(get_current_user_required),
):
    project = await DatabaseProjectManager().get_project(project_id, user_id=user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    async with AsyncSessionLocal() as session:
        jobs = await list_export_jobs_for_project(
            session, project_id=project_id, user_id=user.id, limit=limit
        )
    return {"status": "ok", "exports": jobs}


@router.get("/api/exports/{task_id}")
async def get_export_job_detail(task_id: str, user: User = Depends(get_current_user_required)):
    async with AsyncSessionLocal() as session:
        job = await get_export_job(session, task_id, user.id)
    if not job:
        raise HTTPException(status_code=404, detail="Export job not found")
    return {"status": "ok", "job": job}
