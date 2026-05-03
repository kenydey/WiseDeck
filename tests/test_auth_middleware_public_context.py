"""Tests for wisedeck.auth.middleware helpers.

Global ``AuthMiddleware`` was removed; authentication is per-route via
``Depends(get_current_user_*)`` (see main.py). These tests cover the shared
request.state helpers still used by routes.
"""

import pytest
from fastapi import HTTPException
from starlette.requests import Request

from wisedeck.auth.middleware import get_current_user, is_authenticated, require_auth


def _build_request(path: str, cookie: str = "") -> Request:
    headers = []
    if cookie:
        headers.append((b"cookie", cookie.encode("utf-8")))

    scope = {
        "type": "http",
        "http_version": "1.1",
        "method": "GET",
        "scheme": "http",
        "path": path,
        "raw_path": path.encode("utf-8"),
        "query_string": b"",
        "headers": headers,
        "client": ("127.0.0.1", 12345),
        "server": ("testserver", 80),
    }
    return Request(scope)


class _FakeUser:
    def __init__(self, user_id: int = 1, is_admin: bool = False):
        self.id = user_id
        self.is_admin = is_admin


def test_get_current_user_none_without_state_user():
    request = _build_request("/sponsors")
    assert get_current_user(request) is None
    assert is_authenticated(request) is False


def test_get_current_user_returns_attached_user():
    request = _build_request("/sponsors")
    request.state.user = _FakeUser(user_id=7)
    u = get_current_user(request)
    assert u is not None
    assert u.id == 7
    assert is_authenticated(request) is True


def test_require_auth_raises_401_when_unauthenticated():
    request = _build_request("/dashboard")
    with pytest.raises(HTTPException) as exc_info:
        require_auth(request)
    assert exc_info.value.status_code == 401


def test_require_auth_returns_user_when_present():
    request = _build_request("/dashboard")
    request.state.user = _FakeUser(user_id=3)
    assert require_auth(request).id == 3
