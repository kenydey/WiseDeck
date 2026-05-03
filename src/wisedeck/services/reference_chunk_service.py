"""Split reference parsed_text into chunks and score for query-biased selection."""

from __future__ import annotations

import logging
import re
import time
from typing import List, Tuple

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import ReferenceChunk

logger = logging.getLogger(__name__)

CHUNK_TARGET_CHARS = 2400


def split_text_into_chunks(text: str) -> List[str]:
    """Split on paragraph boundaries; cap chunk size."""
    text = (text or "").strip()
    if not text:
        return []
    paragraphs = re.split(r"\n\s*\n+", text)
    chunks: List[str] = []
    buf = ""
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        if len(buf) + len(p) + 2 <= CHUNK_TARGET_CHARS:
            buf = f"{buf}\n\n{p}" if buf else p
        else:
            if buf:
                chunks.append(buf.strip())
            if len(p) <= CHUNK_TARGET_CHARS:
                buf = p
            else:
                for i in range(0, len(p), CHUNK_TARGET_CHARS):
                    chunks.append(p[i : i + CHUNK_TARGET_CHARS])
                buf = ""
    if buf.strip():
        chunks.append(buf.strip())
    return chunks


_TOKEN_RE = re.compile(r"[\w\u4e00-\u9fff]+", re.UNICODE)


def _tokens(text: str) -> set[str]:
    return {t.lower() for t in _TOKEN_RE.findall(text or "") if len(t) > 1}


def score_chunk_against_query(query: str, chunk_body: str) -> float:
    if not query or not chunk_body:
        return 0.0
    qt = _tokens(query)
    ct = _tokens(chunk_body)
    if not qt or not ct:
        overlap = 0
        qn = (query or "").strip()
        if len(qn) >= 2 and qn.lower() in chunk_body.lower():
            return 2.0
        return 0.0
    overlap = len(qt & ct)
    return float(overlap) / (len(qt) ** 0.5 + 1e-6)


async def replace_chunks_for_file(
    session: AsyncSession,
    *,
    file_id: str,
    project_id: str,
    parsed_text: str,
) -> int:
    await session.execute(delete(ReferenceChunk).where(ReferenceChunk.file_id == file_id))
    parts = split_text_into_chunks(parsed_text)
    now = time.time()
    for idx, body in enumerate(parts):
        session.add(
            ReferenceChunk(
                file_id=file_id,
                project_id=project_id,
                chunk_index=idx,
                body=body,
                created_at=now,
            )
        )
    await session.commit()
    return len(parts)


async def delete_chunks_for_file(session: AsyncSession, file_id: str) -> None:
    await session.execute(delete(ReferenceChunk).where(ReferenceChunk.file_id == file_id))
    await session.commit()


async def select_chunks_for_query(
    session: AsyncSession,
    *,
    project_id: str,
    query_hint: str,
    max_chars: int,
    file_ids_in_order: List[str],
) -> List[Tuple[str, str]]:
    """
    Return list of (filename_hint, body) chunks scored by query_hint, capped by max_chars.
    file_ids_in_order defines tie-break order.
    """
    result = await session.execute(
        select(ReferenceChunk).where(ReferenceChunk.project_id == project_id)
    )
    rows = list(result.scalars().all())
    if not rows:
        return []
    order_rank = {fid: i for i, fid in enumerate(file_ids_in_order)}
    scored: List[tuple[float, int, ReferenceChunk]] = []
    for r in rows:
        s = score_chunk_against_query(query_hint, r.body)
        tie = order_rank.get(r.file_id, 999)
        scored.append((s, tie, r))
    scored.sort(key=lambda x: (-x[0], x[1], x[2].chunk_index))
    out: List[Tuple[str, str]] = []
    used = 0
    best_score = scored[0][0] if scored else 0.0
    iterable: List[tuple[float, int, ReferenceChunk]] = list(scored)
    if best_score <= 0.0:
        ordered = sorted(
            rows,
            key=lambda r: (order_rank.get(r.file_id, 999), r.chunk_index),
        )
        iterable = [(0.0, 0, r) for r in ordered]
    for _s, _tie, r in iterable:
        if used + len(r.body) + 20 > max_chars:
            remain = max_chars - used - 20
            if remain > 120:
                out.append((r.file_id, r.body[:remain] + "\n…(截断)"))
            break
        out.append((r.file_id, r.body))
        used += len(r.body) + 20
        if used >= max_chars:
            break
    return out
