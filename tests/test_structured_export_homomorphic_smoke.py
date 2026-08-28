import asyncio

import pytest


def test_homomorphic_export_degrades_to_python_deck_without_playwright():
    """Server-side Playwright is removed; homomorphic export must degrade to a usable python-only PPTX."""
    from wisedeck.services.pyppeteer_pdf_converter import get_pdf_converter
    from wisedeck.services.structured_export.schemas import (
        ChartConfigModel,
        ChartDataModel,
        ChartDatasetModel,
        StructuredSlideDeckModel,
        StructuredSlideModel,
    )
    from wisedeck.services.structured_export.service import export_structured_pptx_via_homomorphic_html

    assert get_pdf_converter().is_available() is False

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
            "html_content": (
                "<html><body style='margin:0'><div style='width:1280px;height:720px;"
                "display:flex;align-items:center;justify-content:center;"
                "background:#fff;font-size:48px'>OK</div></body></html>"
            )
        }
    ]

    async def _run():
        return await export_structured_pptx_via_homomorphic_html(
            deck,
            slides_for_same_html=slides_for_same_html,
            export_base_url="http://127.0.0.1:8000",
        )

    result = asyncio.run(_run())
    assert isinstance(result, bytes)
    assert result[:4] == b"PK\x03\x04"
