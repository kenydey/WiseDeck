"""Regression tests for SlideDocument v1 → PPTist emitter / preview pipeline."""

import asyncio

from wisedeck.services.slide.canvas_constants import VIEWPORT_HEIGHT, VIEWPORT_WIDTH
from wisedeck.services.slide.schema.slide_document_v1 import SlideBackgroundSpec, SlideDocumentV1, SlideSlots

from wisedeck.services.slide.slide_document_builder import assemble_generated_slide_outputs, build_slide_document_v1
from wisedeck.services.slide.render.pptist_emitter import emit_pptist_slide_dict
from wisedeck.services.export.unified_export_service import UnifiedExportService


def test_viewport_matches_pptist_store_defaults():
    assert VIEWPORT_WIDTH == 1000
    assert abs(VIEWPORT_HEIGHT - 562.5) < 0.01


def test_emit_cover_has_title_and_image_background():
    doc = SlideDocumentV1(
        layout_id="cover",
        slots=SlideSlots(title="Hello", subtitle="World", confidential="", date="2024.05.09"),
        background=SlideBackgroundSpec(
            type="image",
            image_src="https://example.com/bg.jpg",
            image_size="cover",
        ),
    )
    ppt = emit_pptist_slide_dict(doc)
    assert ppt["background"]["type"] == "image"
    assert ppt["background"]["image"]["src"].startswith("http")
    titles = [e for e in ppt["elements"] if e.get("type") == "text" and "Hello" in (e.get("content") or "")]
    assert titles


def test_chart_layout_emits_flat_chart_element():
    slide = {
        "title": "Metrics",
        "content_points": ["A", "B"],
        "chart_config": {
            "type": "bar",
            "data": {
                "labels": ["Q1", "Q2"],
                "datasets": [{"label": "Rev", "data": [1, 2]}],
            },
        },
    }
    html = "<html><body><h1>Metrics</h1></body></html>"
    doc = build_slide_document_v1(slide, html, page_number=2, total_pages=5)
    assert doc.layout_id == "content_chart"
    ppt = emit_pptist_slide_dict(doc)
    charts = [e for e in ppt["elements"] if e.get("type") == "chart"]
    assert len(charts) == 1
    assert charts[0].get("chartType") == "bar"
    assert charts[0]["data"]["labels"] == ["Q1", "Q2"]


def test_assemble_pipeline_returns_three_outputs():
    slide = {"title": "T", "content_points": ["one"]}
    html = "<html><body><ul><li>one</li></ul></body></html>"
    doc, ppt, preview = asyncio.run(assemble_generated_slide_outputs(slide, html, 2, 3))
    assert doc.schema_version >= 1
    assert isinstance(ppt["elements"], list)
    assert "wds-slide-root" in preview


def test_unified_export_accepts_flat_chart():
    slides = [
        {
            "elements": [
                {
                    "type": "chart",
                    "left": 40,
                    "top": 40,
                    "width": 400,
                    "height": 200,
                    "rotate": 0,
                    "chartType": "bar",
                    "data": {"labels": ["a"], "legends": ["L"], "series": [[1.0]]},
                    "themeColors": ["#4472c4"],
                    "options": {},
                    "textColor": "#333",
                    "lineColor": "#eee",
                }
            ],
            "background": {"type": "solid", "color": "#ffffff"},
        }
    ]
    svc = UnifiedExportService()
    out = svc.export_pptist_to_pptx(slides)
    assert out[:4] == b"PK\x03\x04"
