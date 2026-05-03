"""Persist export background tasks for user-visible history."""

from __future__ import annotations

import logging
import time
from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import ExportJob
from .background_tasks import BackgroundTask, TaskStatus
from .project_context_augmentation import export_job_task_types

logger = logging.getLogger(__name__)


def _artifact_hint(result: Any) -> Optional[str]:
    if not isinstance(result, dict):
        return None
    for key in ("pptx_path", "pdf_path", "video_path", "audio_path"):
        v = result.get(key)
        if isinstance(v, str) and v:
            return v
    return None


async def register_export_job(
    session: AsyncSession,
    *,
    task_id: str,
    project_id: str,
    user_id: int,
    kind: str,
    metadata: Optional[Dict[str, Any]] = None,
) -> None:
    """Insert a row when an async export task is submitted."""
    try:
        exists = await session.execute(select(ExportJob.id).where(ExportJob.task_id == task_id).limit(1))
        if exists.scalar_one_or_none() is not None:
            return
        job = ExportJob(
            task_id=task_id,
            project_id=project_id,
            user_id=user_id,
            kind=kind,
            status="running",
            progress=0.0,
            job_metadata=metadata or {},
            created_at=time.time(),
            completed_at=None,
        )
        session.add(job)
        await session.commit()
    except Exception as e:
        logger.warning("register_export_job failed: %s", e)
        await session.rollback()


async def sync_export_job_from_background_task(session: AsyncSession, task: BackgroundTask) -> None:
    """Update DB row when a tracked export task reaches a terminal state (or progress while running)."""
    if task.task_type not in export_job_task_types():
        return
    try:
        result = await session.execute(select(ExportJob).where(ExportJob.task_id == task.task_id).limit(1))
        row = result.scalar_one_or_none()
        if row is None:
            return

        row.progress = float(task.progress or 0.0)
        st = task.status
        st_val = st.value if isinstance(st, TaskStatus) else str(st).lower()

        if st == TaskStatus.COMPLETED or st_val == "completed":
            row.status = "succeeded"
            row.progress = 100.0
            row.error_message = None
            if task.result and isinstance(task.result, dict):
                row.artifact_path = _artifact_hint(task.result)
                meta = dict(row.job_metadata or {})
                if isinstance(task.result, dict) and task.result.get("error"):
                    meta["result_warning"] = str(task.result.get("error"))[:2000]
                row.job_metadata = meta
        elif st == TaskStatus.FAILED or st_val == "failed":
            row.status = "failed"
            row.progress = 100.0
            row.error_message = (task.error or "")[:8000]
        elif st == TaskStatus.CANCELLED or st_val == "cancelled":
            row.status = "cancelled"
            row.error_message = task.error or "cancelled"
        else:
            row.status = "running"
            await session.commit()
            return

        row.completed_at = time.time()
        await session.commit()
    except Exception as e:
        logger.warning("sync_export_job_from_background_task failed: %s", e)
        await session.rollback()


async def list_export_jobs_for_project(
    session: AsyncSession,
    *,
    project_id: str,
    user_id: int,
    limit: int = 50,
) -> List[Dict[str, Any]]:
    result = await session.execute(
        select(ExportJob)
        .where(ExportJob.project_id == project_id, ExportJob.user_id == user_id)
        .order_by(ExportJob.created_at.desc())
        .limit(min(limit, 200))
    )
    rows = result.scalars().all()
    out: List[Dict[str, Any]] = []
    for r in rows:
        meta = r.job_metadata if isinstance(r.job_metadata, dict) else {}
        out.append(
            {
                "task_id": r.task_id,
                "kind": r.kind,
                "status": r.status,
                "progress": r.progress,
                "error_message": r.error_message,
                "created_at": r.created_at,
                "completed_at": r.completed_at,
                "download_path_hint": bool(r.artifact_path),
                "metadata": meta,
            }
        )
    return out


async def get_export_job(
    session: AsyncSession, task_id: str, user_id: int
) -> Optional[Dict[str, Any]]:
    result = await session.execute(
        select(ExportJob).where(ExportJob.task_id == task_id, ExportJob.user_id == user_id).limit(1)
    )
    r = result.scalar_one_or_none()
    if not r:
        return None
    return {
        "task_id": r.task_id,
        "project_id": r.project_id,
        "kind": r.kind,
        "status": r.status,
        "progress": r.progress,
        "error_message": r.error_message,
        "created_at": r.created_at,
        "completed_at": r.completed_at,
        "metadata": r.job_metadata or {},
    }
