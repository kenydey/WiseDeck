"""
Shared helpers for extracted web route modules.
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Any

from fastapi import Response
from fastapi.templating import Jinja2Templates

from ...core.config import app_config
from ...database.database import AsyncSessionLocal
from ...services.service_instances import get_ppt_service_for_user, ppt_service

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="src/wisedeck/web/templates")


def _apply_no_store_headers(response: Response) -> Response:
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


def _timestamp_to_datetime(timestamp: Any) -> str:
    try:
        if isinstance(timestamp, (int, float)):
            return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")
        return str(timestamp)
    except (ValueError, OSError):
        return "Invalid timestamp"


def _strftime_filter(timestamp: Any, format_string: str = "%Y-%m-%d %H:%M") -> str:
    try:
        if isinstance(timestamp, (int, float)):
            return datetime.fromtimestamp(timestamp).strftime(format_string)
        return str(timestamp)
    except (ValueError, OSError):
        return "Invalid timestamp"


templates.env.filters["timestamp_to_datetime"] = _timestamp_to_datetime
templates.env.filters["strftime"] = _strftime_filter
templates.env.globals["credits_enabled"] = False


async def consume_credits_for_operation(
    user_id: int,
    operation_type: str,
    quantity: int = 1,
    description: str | None = None,
    reference_id: str | None = None,
    provider_name: str | None = None,
) -> tuple[bool, str]:
    # Credits/billing removed in local anonymous mode.
    return True, "Credits system removed"


async def check_credits_for_operation(
    user_id: int,
    operation_type: str,
    quantity: int = 1,
    provider_name: str | None = None,
) -> tuple[bool, int, int]:
    # Credits/billing removed in local anonymous mode.
    return True, 0, 0

