# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

WiseDeck is an AI-powered PPT generation platform built with Python/FastAPI. It uses SQLite + memory cache by default for local dev (no external services needed).

### Running the Application

```bash
export PATH="$HOME/.local/bin:$PATH"
uv run python run.py
```

The app starts on `http://localhost:8000`. Key endpoints:
- Web UI: `/dashboard`
- Health check: `/health`
- API docs (Swagger): `/docs`
- OpenAPI spec: `/openapi.json`

`PYTHONPATH` must include `src/` — `run.py` handles this automatically.

### Environment Configuration

Copy `.env.example` to `.env` before starting. Minimum required:
- `SECRET_KEY` (any string for dev)
- At least one AI provider key (e.g. `OPENAI_API_KEY`) for AI features — app starts without it but AI generation won't work

Set `WISEDECK_BOOTSTRAP_ADMIN_ENABLED=true` with `WISEDECK_BOOTSTRAP_ADMIN_USERNAME`/`WISEDECK_BOOTSTRAP_ADMIN_PASSWORD` to create an initial admin on first startup.

For API-key-based automation (no login needed): set `WISEDECK_API_KEY=<your-key>` and use `Authorization: Bearer <key>` header.

### Testing

```bash
uv run pytest tests/ -q
```

Some tests may take a long time if they import heavy modules. For quick validation, run a subset:
```bash
uv run pytest tests/test_creative_guidance_defaults.py tests/test_api_docs_config.py tests/test_cache_service_fallback.py -q
```

Note: `tests/test_admin_bootstrap.py` may fail due to import issues with `auth_service` — this is a pre-existing issue in the repo.

### Linting

```bash
uv run flake8 src/wisedeck --max-line-length=120
uv run black --check src/wisedeck
uv run isort --check-only src/wisedeck
```

The codebase has pre-existing lint violations (not introduced by agents).

### Key Gotchas

- The app uses `uv` with Python 3.11 (pinned in `pyproject.toml` as `requires-python = ">=3.11"`). `uv sync` will download the correct Python automatically.
- Playwright Chromium is needed for PDF/PPTX export: `uv run playwright install chromium`
- Hot reload is controlled by `RELOAD=true/false` in `.env`. Default in `.env.example` is `false`; set to `true` for dev.
- SQLite DB file (`wisedeck.db`) is auto-created on first startup with auto-migrations.
- The app does NOT have separate frontend build steps — the UI is served via Jinja2 templates + static files.
- `ffmpeg` is needed only for narration video export features.
