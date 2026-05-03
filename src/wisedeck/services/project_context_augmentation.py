"""
Assemble reference-file excerpts and design_spec for LLM prompts (outline + slide generation).
"""

from __future__ import annotations

import json
import logging
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import Project, ProjectReferenceFile, ReferenceChunk
from .design_spec_merge_service import effective_design_spec, human_summary_line
from .reference_chunk_service import select_chunks_for_query

logger = logging.getLogger(__name__)

MAX_AUGMENT_CHARS = 20000
MAX_REFERENCE_SECTION = 16000
MAX_SPEC_SECTION = 4000


async def estimate_augmentation_size(
    project_id: str,
    *,
    query_hint: Optional[str] = None,
    session: AsyncSession | None = None,
    user_id: Optional[int] = None,
) -> dict:
    """Rough char counts for UI preview."""
    text = await build_project_prompt_augmentation(
        project_id,
        query_hint=query_hint,
        session=session,
        user_id=user_id,
    )
    return {
        "approx_chars": len(text),
        "approx_tokens_est": max(1, len(text) // 2),
        "query_hint": query_hint or "",
    }


async def build_project_prompt_augmentation(
    project_id: str,
    *,
    include_reference: bool = True,
    include_design_spec: bool = True,
    query_hint: Optional[str] = None,
    session: AsyncSession | None = None,
    user_id: Optional[int] = None,
) -> str:
    """Return a single string block to prepend/append to prompts (Chinese UI labels)."""
    own_session = session is None
    if own_session:
        from ..database.database import AsyncSessionLocal

        session = AsyncSessionLocal()

    try:
        parts: List[str] = []
        res_proj = await session.execute(select(Project).where(Project.project_id == project_id).limit(1))
        proj = res_proj.scalar_one_or_none()
        if not proj:
            return ""

        effective_uid = user_id if user_id is not None else getattr(proj, "user_id", None)

        meta = proj.project_metadata if isinstance(proj.project_metadata, dict) else {}
        ref_enabled = bool(meta.get("reference_context_enabled", True))
        # include_reference=False means caller skips reference for this call (e.g. skip_reference=1), even if ref_enabled.
        if include_reference:
            include_reference = ref_enabled

        if include_design_spec:
            try:
                eff = await effective_design_spec(session, project=proj, user_id=effective_uid)
            except Exception as e:
                logger.warning("effective_design_spec failed: %s", e)
                eff = proj.design_spec if isinstance(proj.design_spec, dict) else {}
            if eff:
                try:
                    spec_text = json.dumps(eff, ensure_ascii=False, indent=2)
                except Exception:
                    spec_text = str(eff)
                spec_text = spec_text[:MAX_SPEC_SECTION]
                summary = human_summary_line(eff)
                parts.append(
                    f"## 设计规格锁定（design_spec v{getattr(proj, 'design_spec_version', 1)}）\n"
                    f"摘要：{summary}\n{spec_text}"
                )

        if include_reference:
            q = await session.execute(
                select(ProjectReferenceFile)
                .where(
                    ProjectReferenceFile.project_id == project_id,
                    ProjectReferenceFile.parse_status == "ready",
                    ProjectReferenceFile.include_in_prompt == True,  # noqa: E712
                )
                .order_by(ProjectReferenceFile.sort_order.asc(), ProjectReferenceFile.created_at.asc())
            )
            rows = list(q.scalars().all())
            file_order = [r.file_id for r in rows]

            use_chunks = False
            if query_hint and (query_hint.strip()):
                chk = await session.execute(
                    select(ReferenceChunk.id).where(ReferenceChunk.project_id == project_id).limit(1)
                )
                use_chunks = chk.scalar_one_or_none() is not None

            if use_chunks:
                scored = await select_chunks_for_query(
                    session,
                    project_id=project_id,
                    query_hint=query_hint.strip(),
                    max_chars=MAX_REFERENCE_SECTION,
                    file_ids_in_order=file_order,
                )
                if scored:
                    chunks = []
                    for fid, body in scored:
                        fname = next((r.original_filename for r in rows if r.file_id == fid), fid)
                        chunks.append(f"### {fname}\n{body}")
                    ref_text = "\n\n".join(chunks)
                    parts.insert(0, f"## 用户上传的参考文档摘录（与当前主题相关片段）\n{ref_text}")
            else:
                chunks: List[str] = []
                used = 0
                for row in rows:
                    body = (row.parsed_text or "").strip()
                    if not body:
                        continue
                    header = f"### {row.original_filename}\n"
                    piece = header + body
                    if used + len(piece) > MAX_REFERENCE_SECTION:
                        remain = MAX_REFERENCE_SECTION - used - len(header)
                        if remain > 200:
                            piece = header + body[:remain] + "\n…(已截断)"
                        else:
                            break
                    chunks.append(piece)
                    used += len(piece)
                    if used >= MAX_REFERENCE_SECTION:
                        break
                if chunks:
                    ref_text = "\n\n".join(chunks)
                    parts.insert(0, f"## 用户上传的参考文档摘录\n{ref_text}")

        out = "\n\n".join(parts).strip()
        if len(out) > MAX_AUGMENT_CHARS:
            out = out[: MAX_AUGMENT_CHARS - 20] + "\n…(上下文已截断)"
        return out
    finally:
        if own_session and session is not None:
            await session.close()


def export_job_task_types() -> frozenset[str]:
    return frozenset({"pdf_generation", "pdf_to_pptx_conversion", "html_to_pptx_screenshot"})
