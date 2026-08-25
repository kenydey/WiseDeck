"""
Alembic integration helpers.

Bridges the legacy hand-written migration system (`database/migrations.py`,
versions 001-018, tracked in the `schema_migrations` table) with Alembic
(revisions under `alembic/versions/`, tracked in `alembic_version`).

State model used at startup:

- fresh:            no application tables and no alembic_version
                    -> `alembic upgrade head` creates the full schema
- alembic_managed:  alembic_version exists
                    -> `alembic upgrade head`
- legacy_current:   pre-alembic database whose applied legacy versions cover
                    all of 001..018 -> `init_db()` patches, then `stamp head`
- legacy_behind:    pre-alembic database missing some legacy versions
                    -> run legacy migrate_up() first, then re-evaluate

The legacy registry is frozen: new schema changes must be alembic revisions.
"""

from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass
from pathlib import Path

import sqlalchemy as sa
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)

#: Last version registered in the frozen legacy migration registry.
LATEST_LEGACY_VERSION = "018"

_REPO_ROOT = Path(__file__).resolve().parents[3]
ALEMBIC_INI_PATH = _REPO_ROOT / "alembic.ini"
ALEMBIC_SCRIPT_LOCATION = _REPO_ROOT / "alembic"

# Tables that indicate a pre-alembic WiseDeck database.
_APP_TABLE_PROBES = ("users", "projects", "slide_data")


@dataclass(frozen=True)
class DatabaseMigrationState:
    state: str  # fresh | alembic_managed | legacy_current | legacy_behind | unknown
    detail: str = ""


def get_alembic_config(database_url: str | None = None):
    """Build an alembic Config pointing at this repo's migration script."""
    from alembic.config import Config

    if not ALEMBIC_INI_PATH.exists():
        raise FileNotFoundError(
            f"alembic.ini not found at {ALEMBIC_INI_PATH}; "
            "run migrations from the repository root"
        )

    cfg = Config(str(ALEMBIC_INI_PATH))
    cfg.set_main_option("script_location", str(ALEMBIC_SCRIPT_LOCATION))
    url = database_url or _resolved_sync_url()
    # env.py checks attributes first, so the app always pins its own URL.
    cfg.attributes["wisedeck_database_url"] = url
    return cfg


def _resolved_sync_url() -> str:
    """Reuse the app's resolved sync URL (includes SQLite fallback logic)."""
    from .database import DATABASE_URL

    return DATABASE_URL


def upgrade_head(database_url: str | None = None) -> None:
    """Blocking `alembic upgrade head`. Call from a worker thread."""
    from alembic import command

    command.upgrade(get_alembic_config(database_url), "head")


def stamp_head(database_url: str | None = None, revision: str = "head") -> None:
    """Blocking `alembic stamp`. Call from a worker thread."""
    from alembic import command

    command.stamp(get_alembic_config(database_url), revision)


async def async_upgrade_head(database_url: str | None = None) -> None:
    await asyncio.to_thread(upgrade_head, database_url)


async def async_stamp_head(database_url: str | None = None, revision: str = "head") -> None:
    await asyncio.to_thread(stamp_head, database_url, revision)


def inspect_database_state(engine: Engine) -> DatabaseMigrationState:
    """Classify a database for the startup migration flow (sync, cheap)."""
    inspector = sa.inspect(engine)

    # An existing but EMPTY alembic_version table is a phantom (e.g. left by
    # a tooling run) and must not be treated as "managed", or a later
    # `upgrade head` would re-run baseline create_table ops on live tables.
    has_alembic_version = inspector.has_table("alembic_version") and _has_alembic_revision(engine)
    has_app_tables = any(inspector.has_table(name) for name in _APP_TABLE_PROBES)

    if has_alembic_version:
        return DatabaseMigrationState("alembic_managed")

    if not has_app_tables:
        return DatabaseMigrationState("fresh")

    applied_legacy = _applied_legacy_versions(engine)
    if applied_legacy is None:
        # Tables exist but no schema_migrations bookkeeping at all.
        matches = _schema_matches_models(engine)
        if matches:
            logger.info(
                "Alembic: pre-versioning database matches current models; treating as legacy_current"
            )
            return DatabaseMigrationState(
                "legacy_current", "schema_migrations absent but schema matches models"
            )
        return DatabaseMigrationState("unknown", "no version info and schema drift detected")

    pending = _pending_legacy_versions(applied_legacy)
    if pending:
        return DatabaseMigrationState(
            "legacy_behind", f"pending legacy versions: {','.join(pending)}"
        )
    return DatabaseMigrationState(
        "legacy_current", f"legacy versions applied through {LATEST_LEGACY_VERSION}"
    )


def _applied_legacy_versions(engine: Engine) -> list[str] | None:
    """Return applied versions from the legacy schema_migrations table, or None if absent."""
    if not sa.inspect(engine).has_table("schema_migrations"):
        return None
    with engine.connect() as conn:
        rows = conn.execute(
            sa.text("SELECT version FROM schema_migrations ORDER BY version")
        ).fetchall()
    return [str(row[0]) for row in rows]


def _has_alembic_revision(engine: Engine) -> bool:
    """True when alembic_version holds at least one non-empty revision id."""
    try:
        with engine.connect() as conn:
            row = conn.execute(sa.text("SELECT version_num FROM alembic_version LIMIT 1")).first()
        return bool(row and str(row[0] or "").strip())
    except Exception:
        return False


def _pending_legacy_versions(applied: list[str]) -> list[str]:
    from .migrations import migration_manager

    available = [m["version"] for m in migration_manager.migrations]
    return [v for v in available if v not in set(applied)]


def _schema_matches_models(engine: Engine) -> bool:
    """True when the live schema has no diff against current SQLAlchemy models."""
    try:
        diffs = compare_schema_to_models(engine)
    except Exception as exc:
        logger.warning("Alembic: schema comparison failed: %s", exc)
        return False
    return not diffs


def compare_schema_to_models(engine: Engine | None = None) -> list[tuple]:
    """Run alembic autogenerate comparison without touching the database."""
    from alembic.autogenerate import compare_metadata
    from alembic.runtime.migration import MigrationContext
    from sqlalchemy import create_engine as sa_create_engine

    from .models import Base

    own_engine = False
    if engine is None:
        from .database import DATABASE_URL

        engine = sa_create_engine(DATABASE_URL)
        own_engine = True

    try:
        with engine.connect() as conn:
            context = MigrationContext.configure(conn)
            return compare_metadata(context, Base.metadata)
    finally:
        if own_engine:
            engine.dispose()


def alembic_available() -> bool:
    try:
        import alembic  # noqa: F401

        return True
    except ImportError:
        return False


def default_ini_url_override() -> str | None:
    return os.getenv("WISEDECK_MIGRATION_DATABASE_URL") or None
