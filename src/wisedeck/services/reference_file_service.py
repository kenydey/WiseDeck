"""CRUD for project reference files."""

from __future__ import annotations

import hashlib
import logging
import re
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import ProjectReferenceFile
from .reference_chunk_service import delete_chunks_for_file, replace_chunks_for_file
from .reference_file_text import extract_text_from_upload

logger = logging.getLogger(__name__)

_SAFE_NAME_RE = re.compile(r"[^a-zA-Z0-9._\-]+")


def _safe_filename(name: str) -> str:
    base = Path(name or "upload").name
    return _SAFE_NAME_RE.sub("_", base)[:200] or "upload"


async def _next_sort_order(session: AsyncSession, project_id: str) -> int:
    r = await session.scalar(
        select(func.coalesce(func.max(ProjectReferenceFile.sort_order), 0)).where(
            ProjectReferenceFile.project_id == project_id
        )
    )
    return int(r or 0) + 1


async def save_and_parse_reference(
    session: AsyncSession,
    *,
    project_id: str,
    user_id: int,
    filename: str,
    content: bytes,
    project_root: Path,
    parse_mode: str = "light",
) -> Dict[str, Any]:
    file_id = str(uuid.uuid4())
    safe = _safe_filename(filename)
    rel_dir = project_root / "temp" / "reference_files" / project_id
    rel_dir.mkdir(parents=True, exist_ok=True)
    disk_name = f"{file_id}_{safe}"
    storage_path = str(rel_dir / disk_name)
    with open(storage_path, "wb") as f:
        f.write(content)

    h = hashlib.sha256(content).hexdigest()
    now = time.time()
    mode = "deep" if parse_mode == "deep" else "light"
    text, used_mode = extract_text_from_upload(
        content, filename, storage_path=storage_path, parse_mode=mode  # type: ignore[arg-type]
    )
    status = "ready" if text.strip() else "failed"
    err = None if status == "ready" else "No text could be extracted from this file"
    sort_order = await _next_sort_order(session, project_id)

    row = ProjectReferenceFile(
        file_id=file_id,
        project_id=project_id,
        user_id=user_id,
        original_filename=safe,
        storage_path=storage_path,
        content_hash=h,
        file_size=len(content),
        parse_status=status,
        parsed_text=text if status == "ready" else None,
        error_message=err,
        sort_order=sort_order,
        include_in_prompt=True,
        parse_mode_used=used_mode,
        created_at=now,
        updated_at=now,
    )
    session.add(row)
    await session.commit()
    await session.refresh(row)
    if status == "ready" and text.strip():
        try:
            await replace_chunks_for_file(session, file_id=file_id, project_id=project_id, parsed_text=text)
        except Exception as e:
            logger.warning("replace_chunks_for_file failed: %s", e)
    return _row_to_dict(row)


def _row_to_dict(row: ProjectReferenceFile) -> Dict[str, Any]:
    pt = row.parsed_text or ""
    return {
        "file_id": row.file_id,
        "original_filename": row.original_filename,
        "file_size": row.file_size,
        "parse_status": row.parse_status,
        "error_message": row.error_message,
        "created_at": row.created_at,
        "updated_at": row.updated_at,
        "sort_order": getattr(row, "sort_order", 0) or 0,
        "include_in_prompt": bool(getattr(row, "include_in_prompt", True)),
        "parse_mode_used": getattr(row, "parse_mode_used", None),
        "parsed_char_count": len(pt),
    }


async def list_references(session: AsyncSession, project_id: str) -> List[Dict[str, Any]]:
    result = await session.execute(
        select(ProjectReferenceFile)
        .where(ProjectReferenceFile.project_id == project_id)
        .order_by(ProjectReferenceFile.sort_order.asc(), ProjectReferenceFile.created_at.asc())
    )
    return [_row_to_dict(r) for r in result.scalars().all()]


async def delete_reference(
    session: AsyncSession, project_id: str, file_id: str, user_id: int
) -> bool:
    result = await session.execute(
        select(ProjectReferenceFile).where(
            ProjectReferenceFile.project_id == project_id,
            ProjectReferenceFile.file_id == file_id,
            ProjectReferenceFile.user_id == user_id,
        )
    )
    row = result.scalar_one_or_none()
    if not row:
        return False
    try:
        await delete_chunks_for_file(session, file_id)
    except Exception as e:
        logger.warning("delete_chunks_for_file: %s", e)
    try:
        p = Path(row.storage_path)
        if p.is_file():
            p.unlink(missing_ok=True)
    except Exception as e:
        logger.warning("Could not delete reference file on disk: %s", e)
    await session.delete(row)
    await session.commit()
    return True


async def reindex_reference(
    session: AsyncSession, project_id: str, file_id: str, user_id: int, project_root: Path, parse_mode: str = "light"
) -> Optional[Dict[str, Any]]:
    result = await session.execute(
        select(ProjectReferenceFile).where(
            ProjectReferenceFile.project_id == project_id,
            ProjectReferenceFile.file_id == file_id,
            ProjectReferenceFile.user_id == user_id,
        )
    )
    row = result.scalar_one_or_none()
    if not row:
        return None
    path = Path(row.storage_path)
    if not path.is_file():
        row.parse_status = "failed"
        row.error_message = "Stored file missing on disk"
        row.updated_at = time.time()
        await session.commit()
        return _row_to_dict(row)
    content = path.read_bytes()
    mode = "deep" if parse_mode == "deep" else "light"
    text, used_mode = extract_text_from_upload(
        content, row.original_filename, storage_path=str(path), parse_mode=mode  # type: ignore[arg-type]
    )
    row.parsed_text = text if text.strip() else None
    row.parse_status = "ready" if text.strip() else "failed"
    row.error_message = None if row.parse_status == "ready" else "No text could be extracted"
    row.content_hash = hashlib.sha256(content).hexdigest()
    row.parse_mode_used = used_mode
    row.updated_at = time.time()
    await session.commit()
    await session.refresh(row)
    if row.parse_status == "ready" and text.strip():
        try:
            await replace_chunks_for_file(session, file_id=file_id, project_id=project_id, parsed_text=text)
        except Exception as e:
            logger.warning("replace_chunks_for_file on reindex: %s", e)
    return _row_to_dict(row)


async def update_reference_file_fields(
    session: AsyncSession,
    project_id: str,
    file_id: str,
    user_id: int,
    *,
    include_in_prompt: Optional[bool] = None,
    sort_order: Optional[int] = None,
) -> Optional[Dict[str, Any]]:
    result = await session.execute(
        select(ProjectReferenceFile).where(
            ProjectReferenceFile.project_id == project_id,
            ProjectReferenceFile.file_id == file_id,
            ProjectReferenceFile.user_id == user_id,
        )
    )
    row = result.scalar_one_or_none()
    if not row:
        return None
    if include_in_prompt is not None:
        row.include_in_prompt = bool(include_in_prompt)
    if sort_order is not None:
        row.sort_order = int(sort_order)
    row.updated_at = time.time()
    await session.commit()
    await session.refresh(row)
    return _row_to_dict(row)


async def reorder_reference_files(
    session: AsyncSession,
    project_id: str,
    user_id: int,
    ordered_file_ids: List[str],
) -> bool:
    for idx, fid in enumerate(ordered_file_ids):
        result = await session.execute(
            select(ProjectReferenceFile).where(
                ProjectReferenceFile.project_id == project_id,
                ProjectReferenceFile.file_id == fid,
                ProjectReferenceFile.user_id == user_id,
            )
        )
        row = result.scalar_one_or_none()
        if row:
            row.sort_order = idx
            row.updated_at = time.time()
    await session.commit()
    return True
