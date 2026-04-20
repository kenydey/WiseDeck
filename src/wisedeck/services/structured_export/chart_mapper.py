"""
Map WiseDeck outline-style chart_config to Presenton vendored Pptx* native chart models.
"""

from __future__ import annotations

from typing import List

from wisedeck.services.structured_export._presenton.pptx_models import (
    PptxChartBoxModel,
    PptxChartSeriesModel,
    PptxParagraphModel,
    PptxPositionModel,
    PptxPresentationModel,
    PptxSlideModel,
    PptxTextBoxModel,
)
from wisedeck.services.structured_export.schemas import ChartConfigModel, StructuredSlideDeckModel


def _normalize_chart_type(raw: str) -> str:
    t = (raw or "bar").lower().strip()
    mapping = {
        "柱状图": "bar",
        "条形图": "horizontalbar",
        "折线图": "line",
        "饼图": "pie",
        "环形图": "donut",
        "doughnut": "donut",
        "面积图": "area",
    }
    return mapping.get(t, t)


def chart_config_to_native_model(cfg: ChartConfigModel) -> PptxChartBoxModel:
    data = cfg.data or None
    labels: List[str] = list(data.labels) if data else []
    series_models: List[PptxChartSeriesModel] = []
    colors: List[str] = []
    if data and data.datasets:
        for ds in data.datasets:
            series_models.append(
                PptxChartSeriesModel(name=ds.label or "Series", values=list(ds.data))
            )
            if ds.backgroundColor:
                colors.extend([str(c).lstrip("#") for c in ds.backgroundColor])
    chart_type = _normalize_chart_type(cfg.type)
    return PptxChartBoxModel(
        position=PptxPositionModel(left=80, top=160, width=1120, height=420),
        chart_type=chart_type,
        categories=labels,
        series=series_models,
        showLegend=True,
        colors=colors or None,
    )


def deck_to_pptx_presentation_model(deck: StructuredSlideDeckModel) -> PptxPresentationModel:
    """Build a minimal PptxPresentationModel: title + optional native chart per slide."""
    slides_out: List[PptxSlideModel] = []
    for slide in deck.slides:
        shapes: list = []
        shapes.append(
            PptxTextBoxModel(
                position=PptxPositionModel(left=60, top=40, width=1160, height=80),
                paragraphs=[
                    PptxParagraphModel(
                        text=slide.title or f"Slide {slide.page_number}",
                        font=None,
                    )
                ],
            )
        )
        if slide.chart_config is not None:
            shapes.append(chart_config_to_native_model(slide.chart_config))
        elif slide.content_points:
            bullet_text = "\n".join(f"• {p}" for p in slide.content_points[:12])
            shapes.append(
                PptxTextBoxModel(
                    position=PptxPositionModel(left=60, top=120, width=1160, height=520),
                    paragraphs=[PptxParagraphModel(text=bullet_text)],
                )
            )
        slides_out.append(PptxSlideModel(shapes=shapes))
    if not slides_out:
        slides_out.append(
            PptxSlideModel(
                shapes=[
                    PptxTextBoxModel(
                        position=PptxPositionModel(left=60, top=200, width=1000, height=200),
                        paragraphs=[PptxParagraphModel(text=deck.title)],
                    )
                ]
            )
        )
    return PptxPresentationModel(name=deck.title, slides=slides_out)
