import asyncio

import pytest


def test_dom_to_pptx_playwright_stub_raises_runtime_error():
    from wisedeck.services.structured_export.service import export_dom_to_pptx_bytes_via_playwright

    async def _run():
        await export_dom_to_pptx_bytes_via_playwright(slides_html_url="http://127.0.0.1/preview")

    with pytest.raises(RuntimeError, match="Playwright"):
        asyncio.run(_run())
