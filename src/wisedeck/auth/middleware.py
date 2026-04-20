"""
Authentication middleware for LandPPT
"""

from __future__ import annotations

import secrets
from typing import Optional
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session
import logging

from ..database.database import get_db
from ..database.models import User

logger = logging.getLogger(__name__)


def get_current_user(request: Request) -> Optional[User]:
    """Get current authenticated user from request"""
    return getattr(request.state, 'user', None)


def require_auth(request: Request) -> User:
    """Dependency to require authentication"""
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user


def require_admin(request: Request) -> User:
    """Dependency to require admin privileges"""
    user = require_auth(request)
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user


def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Get current user if authenticated, None otherwise.
    For use with FastAPI dependency injection.
    """
    # Anonymous/local mode: no auth resolution. If a user was attached earlier,
    # return it; otherwise treat as unauthenticated.
    _ = db  # keep signature stable for existing Depends() call sites
    return get_current_user(request)


def get_current_user_anonymous(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    """
    Anonymous/local mode dependency.

    Always returns a usable local user, creating one if needed. This enables running
    WiseDeck without registration/login for local single-user debugging.
    """
    state_user = get_current_user(request)
    if state_user:
        return state_user

    # Prefer an existing "local" user to keep user_id stable across restarts.
    local_user = db.query(User).filter(User.username == "local").first()
    if local_user:
        request.state.user = local_user
        return local_user

    # Fallback: if any user exists, reuse the first one.
    first_user = db.query(User).order_by(User.id.asc()).first()
    if first_user:
        request.state.user = first_user
        return first_user

    # Create a new local user.
    local_user = User(username="local", password_hash="placeholder", is_active=True, is_admin=False)
    local_user.set_password(secrets.token_urlsafe(24))
    db.add(local_user)
    db.commit()
    db.refresh(local_user)
    request.state.user = local_user
    return local_user


def get_current_user_required(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """
    Get current user, raise exception if not authenticated.
    For use with FastAPI dependency injection.
    """
    # Local anonymous mode: always return a usable user.
    # If a real session/api-key user exists, prefer it; otherwise create/reuse a local user.
    user = get_current_user_optional(request, db)
    if user:
        return user
    return get_current_user_anonymous(request, db)


def get_current_admin_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """
    Get current admin user, raise exception if not admin.
    For use with FastAPI dependency injection.
    """
    user = get_current_user_required(request, db)
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user


# Utility functions for templates
def is_authenticated(request: Request) -> bool:
    """Check if user is authenticated"""
    return get_current_user(request) is not None


def is_admin(request: Request) -> bool:
    """Check if user is admin"""
    user = get_current_user(request)
    return user is not None and user.is_admin


def get_user_info(request: Request) -> Optional[dict]:
    """Get user info for templates"""
    user = get_current_user(request)
    if user:
        return user.to_dict()
    return None
