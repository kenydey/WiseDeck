"""
Reference files, design_spec, and export job history for projects.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from ...auth.middleware import get_current_user_required
from ...database.database import AsyncSessionLocal
from ...database.models import User
from ...services.export_job_service import get_export_job, list_export_jobs_for_project
from ...services.db_project_manager import DatabaseProjectManager

logger = logging.getLogger(__name__)

router = APIRouter()


def _project_root() -> Path:
    # src/wisedeck/web/route_modules/this_file -> repo root is parents[4]
    return Path(__file__).resolve().parents[4]


class ProjectContextSettingsPayload(BaseModel):
    reference_context_enabled: Optional[bool] = None
    ssot_embed_preview: Optional[bool] = None
    ssot_preview_policy: Optional[str] = None


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
    if body.ssot_embed_preview is not None:
        meta["ssot_embed_preview"] = bool(body.ssot_embed_preview)
    if body.ssot_preview_policy is not None:
        meta["ssot_preview_policy"] = str(body.ssot_preview_policy).strip() or "html_default"
    ok = await mgr.update_project_metadata(project_id, meta, user_id=user.id)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to update metadata")
    return {"status": "ok", "project_metadata": meta}


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
