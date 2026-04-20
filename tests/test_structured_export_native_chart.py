"""Native editable-chart path for structured export (vendored python-pptx)."""

import zipfile
from io import BytesIO

import pytest

from wisedeck.services.structured_export.chart_mapper import deck_to_pptx_presentation_model
from wisedeck.services.structured_export.schemas import (
    ChartConfigModel,
    ChartDataModel,
    ChartDatasetModel,
    StructuredSlideDeckModel,
    StructuredSlideModel,
)
from wisedeck.services.structured_export.service import build_pptx_bytes_from_deck


@pytest.mark.asyncio
async def test_structured_export_contains_chart_xml():
    deck = StructuredSlideDeckModel(
        title="Test Deck",
        language="zh",
        slides=[
            StructuredSlideModel(
                page_number=1,
                title="Revenue",
                slide_type="content",
                content_points=["Q1 overview"],
                chart_config=ChartConfigModel(
                    type="bar",
                    data=ChartDataModel(
                        labels=["A", "B", "C"],
                        datasets=[
                            ChartDatasetModel(
                                label="Series1",
                                data=[1.0, 2.0, 3.0],
                            )
                        ],
                    ),
                ),
            )
        ],
    )
    model = deck_to_pptx_presentation_model(deck)
    assert len(model.slides) == 1
    assert any(
        getattr(s, "shape_type", None) == "chart" for s in model.slides[0].shapes
    )

    pptx_bytes = await build_pptx_bytes_from_deck(deck)
    buf = BytesIO(pptx_bytes)
    with zipfile.ZipFile(buf, "r") as zf:
        names = zf.namelist()
    chart_parts = [n for n in names if n.startswith("ppt/charts/chart") and n.endswith(".xml")]
    assert chart_parts, f"expected native chart xml in pptx, got sample: {names[:25]}"


@pytest.mark.asyncio
async def test_donut_chart_type_maps():
    deck = StructuredSlideDeckModel(
        title="Donut",
        slides=[
            StructuredSlideModel(
                title="D",
                chart_config=ChartConfigModel(
                    type="donut",
                    data=ChartDataModel(
                        labels=["X", "Y"],
                        datasets=[ChartDatasetModel(label="S", data=[4.0, 6.0])],
                    ),
                ),
            )
        ],
    )
    pptx_bytes = await build_pptx_bytes_from_deck(deck)
    assert pptx_bytes[:4] == b"PK\x03\x04"
