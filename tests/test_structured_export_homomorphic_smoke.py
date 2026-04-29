import os

import pytest


@pytest.mark.asyncio
async def test_homomorphic_export_builds_pptx_bytes_when_playwright_available():
    """
    Smoke test: homomorphic export should be able to build a PPTX (zip header PK)
    when Playwright is available. Skip in environments without a browser/runtime.
    """
    from wisedeck.services.pyppeteer_pdf_converter import get_pdf_converter

    conv = get_pdf_converter()
    if not conv.is_available():
        pytest.skip("Playwright not available")

    # Some CI/dev environments do not have browsers installed even if the python package exists.
    # Allow skipping via env.
    if os.environ.get("WISEDECK_SKIP_PLAYWRIGHT_SMOKE", "").strip().lower() in ("1", "true", "yes"):
        pytest.skip("WISEDECK_SKIP_PLAYWRIGHT_SMOKE set")

    from wisedeck.services.structured_export.schemas import (
        ChartConfigModel,
        ChartDataModel,
        ChartDatasetModel,
        StructuredSlideDeckModel,
        StructuredSlideModel,
    )
    from wisedeck.services.structured_export.service import export_structured_pptx_via_homomorphic_html

    deck = StructuredSlideDeckModel(
        title="t",
        language="zh",
        slides=[
            StructuredSlideModel(
                page_number=1,
                title="Slide 1",
                slide_type="chart",
                content_points=["a", "b"],
                chart_config=ChartConfigModel(
                    type="bar",
                    data=ChartDataModel(
                        labels=["A", "B"],
                        datasets=[ChartDatasetModel(label="S", data=[1.0, 2.0])],
                    ),
                ),
            )
        ],
    )

    slides_for_same_html = [
        {
            "html_content": "<html><body style='margin:0'><div style='width:1280px;height:720px;display:flex;align-items:center;justify-content:center;background:#fff;font-size:48px'>OK</div></body></html>"
        }
    ]
    out = await export_structured_pptx_via_homomorphic_html(
        deck,
        slides_for_same_html=slides_for_same_html,
        export_base_url="http://127.0.0.1:8000",
    )
    assert isinstance(out, (bytes, bytearray))
    assert out[:2] == b"PK"

