"""
通过 Authorization: Bearer <key> 或 X-WiseDeck-API-Key 解析 env 配置的站点 API Key，
并将匹配到的用户写入 request.state.user（供 Depends(get_current_user_required) 使用）。

配置：WISEDECK_API_KEY + WISEDECK_API_KEY_USER，或 WISEDECK_API_KEYS（参见 app_config.get_api_key_bindings）。
"""

from __future__ import annotations

import logging
import secrets

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger(__name__)


def _extract_token(request: Request) -> str | None:
    auth = (request.headers.get("authorization") or "").strip()
    if auth.lower().startswith("bearer "):
        return auth[7:].strip() or None
    hdr = (request.headers.get("x-wisedeck-api-key") or "").strip()
    return hdr or None


class AppApiKeyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        existing = getattr(request.state, "user", None)
        if existing is not None:
            return await call_next(request)

        token = _extract_token(request)
        if not token:
            return await call_next(request)

        from ..core.config import app_config
        from ..database.database import SessionLocal
        from ..database.models import User

        bindings = app_config.get_api_key_bindings()
        username: str | None = None
        for user_name, key in bindings:
            if not key:
                continue
            try:
                if secrets.compare_digest(token.encode("utf-8"), key.encode("utf-8")):
                    username = user_name
                    break
            except Exception:
                if token == key:
                    username = user_name
                    break

        if not username:
            return await call_next(request)

        db = SessionLocal()
        try:
            user = db.query(User).filter(User.username == username).first()
            if user:
                request.state.user = user
            else:
                logger.warning("WISEDECK API key matched user %r but no User row exists", username)
        finally:
            db.close()

        return await call_next(request)
