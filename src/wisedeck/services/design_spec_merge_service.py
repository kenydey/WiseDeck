"""Merge project design_spec with global master template style_config."""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import GlobalMasterTemplate, Project

logger = logging.getLogger(__name__)


async def load_template_style_config(
    session: AsyncSession,
    *,
    project: Project,
    user_id: Optional[int],
) -> Dict[str, Any]:
    meta = project.project_metadata or {}
    tid = meta.get("selected_global_template_id")
    if tid is None:
        return {}
    try:
        tid_int = int(tid)
    except (TypeError, ValueError):
        return {}
    stmt = select(GlobalMasterTemplate).where(GlobalMasterTemplate.id == tid_int)
    if user_id is not None:
        stmt = stmt.where(
            (GlobalMasterTemplate.user_id == user_id) | (GlobalMasterTemplate.user_id.is_(None))
        )
    result = await session.execute(stmt.limit(1))
    row = result.scalar_one_or_none()
    if not row or not row.style_config:
        return {}
    if not isinstance(row.style_config, dict):
        return {}
    return dict(row.style_config)


async def effective_design_spec(
    session: AsyncSession,
    *,
    project: Project,
    user_id: Optional[int],
) -> Dict[str, Any]:
    """Template defaults first, then project.design_spec overrides."""
    from .design_spec_schema import deep_merge_design_spec

    base = await load_template_style_config(session, project=project, user_id=user_id)
    user = project.design_spec if isinstance(project.design_spec, dict) else {}
    return deep_merge_design_spec(base, user)


def human_summary_line(spec: Dict[str, Any]) -> str:
    """One-line hint for LLM alongside JSON."""
    parts = []
    if spec.get("tone"):
        parts.append(f"语气:{spec.get('tone')}")
    if spec.get("density"):
        parts.append(f"密度:{spec.get('density')}")
    if spec.get("palette"):
        parts.append("含调色板配置")
    if spec.get("typography"):
        parts.append("含字体层级配置")
    if spec.get("forbidden_elements"):
        parts.append("含禁用元素约束")
    return "；".join(parts) if parts else "（无额外摘要字段）"
