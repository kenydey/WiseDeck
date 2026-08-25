"""Alembic integration tests.

Covers:
- Fresh database: run_startup_migrations() creates the full schema via
  `alembic upgrade head` and registers alembic_version.
- Baseline revision matches current SQLAlchemy models exactly (zero diff).
- State detection: phantom empty alembic_version is not "managed";
  stamped databases are.
"""

import os
import tempfile

import sqlalchemy as sa
from sqlalchemy import inspect as sa_inspect

import pytest


@pytest.fixture()
def patched_db_engine(monkeypatch):
    """Point the database module's engine/DATABASE_URL at a per-test sqlite file."""
    import wisedeck.database.database as dbmod

    engines = []

    def _install(target_url: str):
        engine = sa.create_engine(target_url)
        engines.append(engine)
        monkeypatch.setattr(dbmod, "engine", engine)
        monkeypatch.setattr(dbmod, "DATABASE_URL", target_url)
        return engine

    yield _install

    for engine in engines:
        engine.dispose()


@pytest.mark.asyncio
async def test_fresh_database_upgrades_to_head(tmp_path, monkeypatch, patched_db_engine):
    import wisedeck.database.startup_migrations as mod
    from wisedeck.core.config import app_config

    monkeypatch.setattr(app_config, "auto_migrate_on_startup", True)
    monkeypatch.setattr(app_config, "auto_migrate_fail_fast", True)

    engine = patched_db_engine(f"sqlite:///{(tmp_path / 'fresh.db').as_posix()}")

    result = await mod.run_startup_migrations()

    assert result is True
    inspector = sa_inspect(engine)
    assert inspector.has_table("users")
    assert inspector.has_table("projects")
    assert inspector.has_table("alembic_version")

    with engine.connect() as conn:
        version = conn.execute(sa.text("SELECT version_num FROM alembic_version")).scalar()
    assert version  # baseline revision recorded


@pytest.mark.asyncio
async def test_baseline_schema_matches_models(tmp_path, patched_db_engine):
    from wisedeck.database.alembic_runner import compare_schema_to_models, upgrade_head

    url = f"sqlite:///{(tmp_path / 'baseline.db').as_posix()}"
    engine = patched_db_engine(url)

    upgrade_head(url)

    diffs = compare_schema_to_models(engine)
    assert diffs == [], diffs


def test_empty_alembic_version_is_not_managed():
    """A phantom (empty) alembic_version table must not count as managed."""
    import os
    import tempfile

    from wisedeck.database.alembic_runner import (
        inspect_database_state,
        stamp_head,
    )

    fd, legacy_path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    legacy_url = f"sqlite:///{legacy_path.replace(os.sep, '/')}"
    engine2 = sa.create_engine(legacy_url)
    try:
        with engine2.begin() as conn:
            conn.execute(sa.text("CREATE TABLE users (id INTEGER PRIMARY KEY)"))
            conn.execute(sa.text(
                "CREATE TABLE schema_migrations (version VARCHAR(32) PRIMARY KEY,"
                " name VARCHAR(255), description TEXT, applied_at TIMESTAMP)"
            ))
            for i in range(1, 19):
                conn.execute(
                    sa.text("INSERT INTO schema_migrations (version) VALUES (:v)"),
                    {"v": f"{i:03d}"},
                )
            conn.execute(sa.text("CREATE TABLE alembic_version (version_num VARCHAR(32) NOT NULL)"))

        state = inspect_database_state(engine2)
        assert state.state == "legacy_current"

        stamp_head(legacy_url)
        assert inspect_database_state(engine2).state == "alembic_managed"
    finally:
        engine2.dispose()
        os.remove(legacy_path)


@pytest.mark.asyncio
async def test_managed_database_rerun_is_idempotent(tmp_path, monkeypatch, patched_db_engine):
    import wisedeck.database.startup_migrations as mod
    from wisedeck.core.config import app_config

    monkeypatch.setattr(app_config, "auto_migrate_on_startup", True)

    url = f"sqlite:///{(tmp_path / 'managed.db').as_posix()}"
    patched_db_engine(url)

    first = await mod.run_startup_migrations()
    second = await mod.run_startup_migrations()

    assert first is True
    assert second is True
