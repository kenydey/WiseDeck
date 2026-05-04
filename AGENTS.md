# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

WiseDeck is an AI-powered PPT generation platform built with FastAPI + SQLAlchemy + Jinja2. See `README.md` for full feature list and architecture.

### Environment setup

- **Python version**: The project requires Python 3.11+. `uv` will automatically download the correct Python if needed.
- **Package manager**: `uv` — run `uv sync --extra dev` to install all dependencies including dev/test tools.
- **Playwright**: Run `uv run playwright install --with-deps chromium` for export/PDF features.
- **Environment file**: Copy `.env.example` to `.env` and configure at minimum `SECRET_KEY`. Set `WISEDECK_BOOTSTRAP_ADMIN_ENABLED=true` with `WISEDECK_BOOTSTRAP_ADMIN_USERNAME` / `WISEDECK_BOOTSTRAP_ADMIN_PASSWORD` to bootstrap an admin account on first start.

### Running the dev server

```bash
uv run python run.py
```

- Default: `http://localhost:8000` (dashboard at `/dashboard`, API docs at `/docs`, health at `/health`)
- Dev mode uses SQLite (`wisedeck.db`) + in-memory cache by default — no PostgreSQL or Valkey needed.
- Set `RELOAD=true` in `.env` for hot-reload during development (default in dev).

### Running tests

```bash
uv run python -m pytest tests/ -q
```

- Some tests have pre-existing import errors (e.g. `test_admin_bootstrap.py` references a non-existent module `wisedeck.auth.auth_service`). These are not caused by environment issues.
- Some tests may hang or be slow if they involve async operations with external services. Use `timeout` or `-x` for faster feedback.
- No `pytest.ini` or `[tool.pytest]` section exists; pytest discovers `tests/conftest.py` which adds `src/` to `sys.path`.

### Running linters

```bash
uv run flake8 src/wisedeck/
uv run black --check src/wisedeck/
uv run isort --check-only src/wisedeck/
```

The existing codebase has many pre-existing style issues; linters are not enforced in CI.

### Key caveats

- The `.env` file is required even for local dev. Without it, the app will still start but with default placeholder values.
- AI features (outline/slide generation) require at least one LLM API key (e.g. `OPENAI_API_KEY`). Without one, the app runs but generation endpoints return errors.
- Database auto-migration runs on startup (controlled by `WISEDECK_AUTO_MIGRATE_ON_STARTUP`, default `true`).
- Default templates are automatically imported on first startup.
- `PYTHONPATH` must include `src/` — `run.py` handles this automatically.
