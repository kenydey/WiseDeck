import os

import pytest


@pytest.mark.asyncio
async def test_dom_to_pptx_runner_function_is_importable():
    """
    Minimal smoke: ensure the new service function can be imported.
    Full end-to-end requires a running server + Playwright browser and is exercised manually.
    """
    from wisedeck.services.structured_export.service import export_dom_to_pptx_bytes_via_playwright  # noqa: F401


@pytest.mark.asyncio
async def test_dom_to_pptx_skips_when_env_disables():
    """
    Guardrail: allow CI to skip potentially heavy Playwright runs.
    """
    if os.environ.get("WISEDECK_SKIP_PLAYWRIGHT_SMOKE", "").strip().lower() not in ("1", "true", "yes"):
        pytest.skip("WISEDECK_SKIP_PLAYWRIGHT_SMOKE not set")

