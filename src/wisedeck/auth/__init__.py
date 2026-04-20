# 保持此模块轻量，避免在最小化或测试环境中导入 request_context 等子模块时
# 提前加载可选依赖，例如 SQLAlchemy。

from __future__ import annotations

from typing import Any

__all__ = [
    "get_current_user",
    "get_current_user_optional",
    "get_current_user_required",
    "is_authenticated",
    "is_admin",
    "get_user_info",
]


def __getattr__(name: str) -> Any:  # pragma: no cover
    middleware_exports = {
        "get_current_user",
        "get_current_user_optional",
        "get_current_user_required",
        "is_authenticated",
        "is_admin",
        "get_user_info",
    }
    if name in middleware_exports:
        from .middleware import (
            get_current_user,
            get_current_user_optional,
            get_current_user_required,
            is_authenticated,
            is_admin,
            get_user_info,
        )

        value = locals()[name]
        globals()[name] = value
        return value

    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def __dir__() -> list[str]:  # pragma: no cover
    return sorted(set(globals().keys()) | set(__all__))

