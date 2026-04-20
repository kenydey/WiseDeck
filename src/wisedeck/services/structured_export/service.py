"""
Structured PPTX export: native python-pptx charts + optional render-service (Next+Puppeteer).
"""

from __future__ import annotations

import logging
import os
import tempfile
import uuid
from pathlib import Path
from typing import Any, Dict

import httpx

from wisedeck.core.config import app_config
from wisedeck.services.structured_export.chart_mapper import deck_to_pptx_presentation_model
from wisedeck.services.structured_export._presenton.pptx_models import PptxPresentationModel
from wisedeck.services.structured_export._presenton.pptx_presentation_creator import (
    PptxPresentationCreator,
)
from wisedeck.services.structured_export.presentation_payload import (
    deck_to_presenton_presentation_json,
)
from wisedeck.services.structured_export.schemas import StructuredSlideDeckModel

logger = logging.getLogger(__name__)


async def build_pptx_bytes_from_deck(deck: StructuredSlideDeckModel) -> bytes:
    """Create .pptx bytes using vendored PptxPresentationCreator (editable charts)."""
    model = deck_to_pptx_presentation_model(deck)
    tmp = tempfile.mkdtemp(prefix="wd_struct_")
    try:
        creator = PptxPresentationCreator(model, tmp)
        await creator.create_ppt()
        out = Path(tmp) / f"{uuid.uuid4().hex}.pptx"
        creator.save(str(out))
        return out.read_bytes()
    finally:
        for f in Path(tmp).glob("*"):
            try:
                f.unlink()
            except OSError:
                pass
        try:
            Path(tmp).rmdir()
        except OSError:
            pass


async def fetch_pptx_model_via_render_service(session_id: str) -> Dict[str, Any]:
    base = (app_config.wisedeck_render_service_url or "").rstrip("/")
    if not base:
        raise RuntimeError("WISEDECK_RENDER_SERVICE_URL is not configured")
    url = f"{base}/api/presentation_to_pptx_model?id=wisedeck-{session_id}"
    timeout = float(os.environ.get("WISEDECK_RENDER_EXPORT_TIMEOUT", "360"))
    async with httpx.AsyncClient(timeout=timeout) as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.json()


async def post_render_session(deck: StructuredSlideDeckModel) -> str:
    """Register deck with render-service; returns session id (without prefix)."""
    base = (app_config.wisedeck_render_service_url or "").rstrip("/")
    if not base:
        raise RuntimeError("WISEDECK_RENDER_SERVICE_URL is not configured")
    sid = uuid.uuid4().hex
    payload = deck_to_presenton_presentation_json(deck)
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(
            f"{base}/api/wisedeck/session",
            json={"session_id": sid, "presentation": payload},
        )
        r.raise_for_status()
    return sid


async def export_structured_pptx_via_render_service(deck: StructuredSlideDeckModel) -> bytes:
    """Full fidelity path: Next measures DOM → JSON model → python-pptx."""
    sid = await post_render_session(deck)
    model_json = await fetch_pptx_model_via_render_service(sid)
    model = PptxPresentationModel.model_validate(model_json)
    tmp = tempfile.mkdtemp(prefix="wd_rs_")
    try:
        creator = PptxPresentationCreator(model, tmp)
        await creator.create_ppt()
        out = Path(tmp) / "out.pptx"
        creator.save(str(out))
        return out.read_bytes()
    finally:
        for f in Path(tmp).glob("*"):
            try:
                f.unlink()
            except OSError:
                pass
        try:
            Path(tmp).rmdir()
        except OSError:
            pass


async def export_structured_pptx_auto(deck: StructuredSlideDeckModel) -> bytes:
    """Use render service when URL set; otherwise pure Python native charts."""
    if app_config.wisedeck_render_service_url:
        try:
            return await export_structured_pptx_via_render_service(deck)
        except Exception as e:
            logger.warning("Render service export failed, falling back to python-only: %s", e)
    return await build_pptx_bytes_from_deck(deck)
