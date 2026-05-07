"""Merge project design_spec with global master template style_config."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional, TYPE_CHECKING

logger = logging.getLogger(__name__)

_STATIC_URL_PREFIX = "/static/"

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession
    from ..database.models import GlobalMasterTemplate, Project


def _static_root_dir() -> Path:
    # src/wisedeck/services/ -> src/wisedeck/ -> web/static/
    return (Path(__file__).resolve().parents[1] / "web" / "static").resolve()


def _safe_static_file_from_url(url: str) -> Optional[Path]:
    """Map /static/... URL to a file path under wisedeck/web/static safely."""
    if not isinstance(url, str) or not url.strip():
        return None
    u = url.strip()
    if not u.startswith(_STATIC_URL_PREFIX):
        return None
    rel = u[len(_STATIC_URL_PREFIX) :].lstrip("/").replace("\\", "/")
    if not rel:
        return None
    root = _static_root_dir()
    target = (root / rel).resolve()
    try:
        if not target.is_relative_to(root):
            return None
    except Exception:
        # Python <3.9 fallback not needed here, but keep safe behavior.
        if str(root) not in str(target):
            return None
    return target


def load_custom_style_overlay_from_template_style_config(style_config: Dict[str, Any]) -> Dict[str, Any]:
    """
    If template.style_config references a generated style pack (custom_style_url), load it from disk and return a
    design_spec overlay dict.
    """
    if not isinstance(style_config, dict):
        return {}
    url = style_config.get("custom_style_url")
    if not isinstance(url, str) or not url.strip():
        return {}

    p = _safe_static_file_from_url(url)
    if p is None or not p.is_file():
        return {}
    try:
        raw = p.read_text(encoding="utf-8", errors="replace")
        custom_style = json.loads(raw)
    except Exception as e:
        logger.warning("Failed to load custom_style from %s: %s", url, e)
        return {}
    if not isinstance(custom_style, dict):
        return {}

    return custom_style_to_design_spec_overlay(custom_style=custom_style, custom_style_url=url)


def custom_style_to_design_spec_overlay(*, custom_style: Dict[str, Any], custom_style_url: str) -> Dict[str, Any]:
    """
    Map LandPPT custom_style.json into a design_spec-shaped overlay.

    design_spec schema is intentionally permissive; we keep both:
    - promoted, commonly-consumed keys (palette/typography/background/primaryColor/...)
    - full structured blocks (global/components/layouts/rules/assets/safeTextRegion)
    """
    if not isinstance(custom_style, dict):
        return {}
    if not isinstance(custom_style_url, str) or not custom_style_url.strip():
        return {}

    tokens = custom_style.get("tokens") if isinstance(custom_style.get("tokens"), dict) else {}
    global_block = custom_style.get("global") if isinstance(custom_style.get("global"), dict) else {}

    overlay: Dict[str, Any] = {
        "custom_style_url": custom_style_url,
        # Keep full style object for renderer/prompt; allow forward-compatible keys.
        "custom_style": custom_style,
    }

    # Promote common fields into design_spec-known buckets for prompt summary / older consumers.
    if isinstance(tokens, dict) and tokens:
        if "paletteTop5" in tokens:
            overlay["palette"] = tokens.get("paletteTop5")
        if "fontPair" in tokens:
            # Ensure typography is an object (not a list).
            fp = tokens.get("fontPair")
            if isinstance(fp, dict):
                overlay["typography"] = fp

    if global_block:
        overlay["global"] = global_block
        if isinstance(global_block.get("background"), (str, dict, list)):
            overlay["background"] = global_block.get("background")
        if isinstance(global_block.get("primaryColor"), str):
            overlay["primaryColor"] = global_block.get("primaryColor")
        if isinstance(global_block.get("fontFamily"), str):
            overlay.setdefault("typography", {})
            if isinstance(overlay.get("typography"), dict):
                overlay["typography"].setdefault("fontFamily", global_block.get("fontFamily"))

    # Structured blocks used by runtime renderer injection.
    for k in ("components", "layouts", "rules", "assets", "safeTextRegion"):
        v = custom_style.get(k)
        if isinstance(v, dict):
            overlay[k] = v

    return overlay


async def load_template_style_config(
    session: AsyncSession,
    *,
    project: Any,
    user_id: Optional[int],
) -> Dict[str, Any]:
    # Lazy import to allow running light unit tests without SQLAlchemy installed.
    from sqlalchemy import select
    from ..database.models import GlobalMasterTemplate

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
    project: Any,
    user_id: Optional[int],
) -> Dict[str, Any]:
    """Template defaults first, then project.design_spec overrides."""
    from .design_spec_schema import deep_merge_design_spec

    base = await load_template_style_config(session, project=project, user_id=user_id)
    overlay = load_custom_style_overlay_from_template_style_config(base)
    if overlay:
        base = deep_merge_design_spec(base, overlay)
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
