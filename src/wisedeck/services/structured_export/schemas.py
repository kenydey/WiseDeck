"""
Pydantic contracts for WiseDeck structured export (aligned with Presenton / Zod slides).

This is the bridge payload between FastAPI and the optional Next+Puppeteer render service,
and the direct python-pptx path for native editable charts.
"""

from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class ChartDatasetModel(BaseModel):
    """Chart.js-style dataset (matches outline chart_config)."""

    label: str = ""
    data: List[float] = Field(default_factory=list)
    backgroundColor: Optional[List[str]] = None


class ChartDataModel(BaseModel):
    labels: List[str] = Field(default_factory=list)
    datasets: List[ChartDatasetModel] = Field(default_factory=list)


class ChartConfigModel(BaseModel):
    """Outline `chart_config` field (flexible keys)."""

    model_config = {"extra": "ignore"}

    type: str = "bar"
    data: Optional[ChartDataModel] = None
    options: Optional[Dict[str, Any]] = None


class StructuredSlideModel(BaseModel):
    """One slide for structured export."""

    model_config = {"extra": "ignore"}

    page_number: int = 1
    title: str = ""
    slide_type: str = "content"
    content_points: List[str] = Field(default_factory=list)
    chart_config: Optional[ChartConfigModel] = None
    # When set, bypass chart_config and use native pptx chart directly
    native_chart_only: bool = False
    # Optional Presenton template overrides (historically aligned with TSX pdf-maker layouts).
    # When unset, exporter falls back to neo-general chart vs swift bullets heuristics.
    presenton_layout_group: Optional[str] = None
    presenton_layout: Optional[str] = None


class StructuredSlideDeckModel(BaseModel):
    """Deck passed to mapper / render session."""

    title: str = "Presentation"
    language: str = "zh"
    slides: List[StructuredSlideModel] = Field(default_factory=list)
