"""Alembic environment for WiseDeck.

URL resolution order:
1. sqlalchemy.url set programmatically on the Config (app startup path)
2. WISEDECK_MIGRATION_DATABASE_URL env var
3. DATABASE_URL env var (normalized: postgres:// -> postgresql://)
4. value from alembic.ini (local sqlite default)
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# Make the src-layout package importable when running the CLI from a checkout.
_REPO_SRC = str(Path(__file__).resolve().parents[1] / "src")
if _REPO_SRC not in sys.path:
    sys.path.insert(0, _REPO_SRC)

from wisedeck.database.models import Base  # noqa: E402

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _normalize_url(url: str) -> str:
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


def _resolve_url() -> str:
    # 1) Explicit programmatic override from alembic_runner
    #    (uses the app's resolved DATABASE_URL incl. SQLite fallback).
    programmatic = config.attributes.get("wisedeck_database_url")
    if programmatic:
        return _normalize_url(str(programmatic))

    # 2) Environment overrides for manual CLI runs.
    for env_name in ("WISEDECK_MIGRATION_DATABASE_URL", "DATABASE_URL"):
        value = os.getenv(env_name)
        if value:
            return _normalize_url(value.strip())

    # 3) Value from alembic.ini as last resort.
    configured = config.get_main_option("sqlalchemy.url")
    if configured and not configured.startswith("driver://"):
        return _normalize_url(configured)
    return configured or "sqlite:///./wisedeck.db"


def run_migrations_offline() -> None:
    """Emit SQL to stdout without a live DB connection."""
    context.configure(
        url=_resolve_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    section = config.get_section(config.config_ini_section) or {}
    section["sqlalchemy.url"] = _resolve_url()

    connectable = engine_from_config(
        section,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,  # SQLite-friendly ALTERs
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
