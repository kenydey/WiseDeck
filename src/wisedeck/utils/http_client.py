"""
Shared HTTP client infrastructure (httpx).

Replaces the previous mix of aiohttp / requests / per-call clients with
process-level httpx clients:

- `get_async_client()` — singleton `httpx.AsyncClient` for async code paths
  (image providers, research, TTS, route modules, ...).
- `get_sync_client()` — module-level `httpx.Client` for blocking contexts
  that already run in worker threads (e.g. PDF/PPTX converters driven via
  the thread pool).
- `build_timeout()` — maps a total-seconds config value to `httpx.Timeout`
  with sensible connect/read splits.

Notes:
- The shared clients never follow redirects beyond httpx defaults and do
  not raise by default; call `.raise_for_status()` explicitly where the old
  code relied on aiohttp's implicit error checks.
- Close handling: process-lifetime singletons are disposed via
  `close_http_clients()` (wired into app shutdown).
"""

from __future__ import annotations

import asyncio
import logging
import threading
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator

import httpx

logger = logging.getLogger(__name__)

DEFAULT_TOTAL_TIMEOUT_SECONDS = 60.0
DEFAULT_CONNECT_TIMEOUT_SECONDS = 10.0

_USER_AGENT = "WiseDeck/0.1 (+httpx)"

_async_client: httpx.AsyncClient | None = None
_sync_client: httpx.Client | None = None
_lock = threading.Lock()


def build_timeout(
    total_seconds: float | None = DEFAULT_TOTAL_TIMEOUT_SECONDS,
    *,
    connect_seconds: float = DEFAULT_CONNECT_TIMEOUT_SECONDS,
) -> httpx.Timeout:
    """Build an httpx.Timeout from a total-seconds value.

    Read/write/pool share the remaining budget; connect stays short so dead
    endpoints fail fast instead of eating the whole total budget.
    """
    try:
        total = float(total_seconds) if total_seconds else DEFAULT_TOTAL_TIMEOUT_SECONDS
    except (TypeError, ValueError):
        total = DEFAULT_TOTAL_TIMEOUT_SECONDS
    total = max(1.0, total)
    # httpx>=0.28: default timeout is positional; read/write/pool span the rest.
    return httpx.Timeout(
        total,
        connect=min(connect_seconds, total),
        read=total,
        write=total,
        pool=total,
    )


def get_async_client() -> httpx.AsyncClient:
    """Process-wide AsyncClient with pooled connections."""
    global _async_client
    if _async_client is None:
        with _lock:
            if _async_client is None:
                _async_client = httpx.AsyncClient(
                    timeout=build_timeout(),
                    headers={"User-Agent": _USER_AGENT},
                    trust_env=True,
                    limits=httpx.Limits(
                        max_connections=100,
                        max_keepalive_connections=20,
                        keepalive_expiry=30.0,
                    ),
                    follow_redirects=True,
                )
    return _async_client


def get_sync_client() -> httpx.Client:
    """Process-wide Client for blocking (thread-pool) code paths."""
    global _sync_client
    if _sync_client is None:
        with _lock:
            if _sync_client is None:
                _sync_client = httpx.Client(
                    timeout=build_timeout(300.0),
                    headers={"User-Agent": _USER_AGENT},
                    trust_env=True,
                    follow_redirects=True,
                )
    return _sync_client


async def close_http_clients() -> None:
    """Dispose the shared clients (called from app shutdown)."""
    global _async_client, _sync_client, _compat_client

    async_client = _async_client
    sync_client = _sync_client
    compat_client = _compat_client
    _async_client = None
    _sync_client = None
    _compat_client = None

    for client, closer in (
        (async_client, "aclose"),
        (compat_client, "aclose"),
        (sync_client, "close"),
    ):
        if client is None:
            continue
        try:
            if closer == "aclose":
                await client.aclose()  # type: ignore[union-attr]
            else:
                await asyncio.to_thread(client.close)  # type: ignore[union-attr]
        except Exception as exc:  # noqa: BLE001
            logger.debug("Failed to close shared HTTP client: %s", exc)


class CompatAsyncClient(httpx.AsyncClient):
    """httpx client whose get/post/head return async context managers that
    yield closed-after-use responses — mirroring aiohttp's
    `async with session.get(...) as response:` shape, so converted call sites
    keep their original structure."""

    def get(self, url: str, **kwargs: Any) -> "http_request":  # type: ignore[override]
        return http_get(url, **kwargs)

    def post(self, url: str, **kwargs: Any) -> "http_request":  # type: ignore[override]
        return http_post(url, **kwargs)

    def head(self, url: str, **kwargs: Any) -> "http_request":
        return http_request("HEAD", url, **kwargs)


_compat_client: CompatAsyncClient | None = None


def get_compat_async_client() -> CompatAsyncClient:
    """Compat-shaped client for code migrated from aiohttp sessions."""
    global _compat_client
    if _compat_client is None:
        with _lock:
            if _compat_client is None:
                _compat_client = CompatAsyncClient(
                    timeout=build_timeout(),
                    headers={"User-Agent": _USER_AGENT},
                    trust_env=True,
                    follow_redirects=True,
                )
    return _compat_client


@asynccontextmanager
async def compat_session() -> AsyncIterator[CompatAsyncClient]:
    """Drop-in shape for `async with aiohttp.ClientSession() as session:`,
    yielding the compat client without closing it."""
    yield get_compat_async_client()


def reset_clients_for_tests() -> None:
    """Force re-creation of the singletons (test isolation only)."""
    global _async_client, _sync_client
    _async_client = None
    _sync_client = None


@asynccontextmanager
async def http_request(method: str, url: str, **kwargs: Any) -> AsyncIterator[httpx.Response]:
    """One-shot request on the shared client, mirroring aiohttp's
    `async with session.get(...) as resp:` shape (response auto-closed).

    Accepts the same kwargs as httpx.AsyncClient.request (`params`, `json`,
    `data`, `headers`, `timeout`, ...). Responses do NOT raise automatically;
    call `.raise_for_status()` explicitly.
    """
    response = await get_async_client().request(method.upper(), url, **kwargs)
    try:
        yield response
    finally:
        await response.aclose()


def http_get(url: str, **kwargs: Any) -> "http_request":
    """`async with http_get(url) as resp:` — one-shot GET."""
    return http_request("GET", url, **kwargs)


def http_post(url: str, **kwargs: Any) -> "http_request":
    """`async with http_post(url, json=...) as resp:` — one-shot POST."""
    return http_request("POST", url, **kwargs)


@asynccontextmanager
async def http_stream(method: str, url: str, **kwargs: Any) -> AsyncIterator[httpx.Response]:
    """Streaming request on the shared client (SSE, chunked downloads).

    Body must be consumed inside the `async with` block.
    """
    async with get_async_client().stream(method.upper(), url, **kwargs) as response:
        yield response


async def download_bytes(
    url: str,
    *,
    timeout_seconds: float | None = None,
    headers: dict[str, str] | None = None,
) -> bytes:
    """Fetch a URL and return the raw body (images, audio, archives)."""
    kwargs: dict[str, Any] = {}
    if timeout_seconds:
        kwargs["timeout"] = build_timeout(timeout_seconds)
    if headers:
        kwargs["headers"] = headers
    async with http_get(url, **kwargs) as response:
        response.raise_for_status()
        return response.content
