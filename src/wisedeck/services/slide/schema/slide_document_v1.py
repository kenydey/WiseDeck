"""WiseDeck slide document v1 — intermediate schema before PPTist JSON emission."""

from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

from ..canvas_constants import SLIDE_DOCUMENT_SCHEMA_VERSION


class SlideBackgroundSpec(BaseModel):
    type: Literal["solid", "image", "gradient"] = "solid"
    color: str = "#ffffff"
    image_src: Optional[str] = None
    image_size: Literal["cover", "contain", "repeat"] = "cover"
    gradient: Optional[Dict[str, Any]] = None


class SlideSlots(BaseModel):
    title: str = ""
    subtitle: str = ""
    bullets: List[str] = Field(default_factory=list)
    confidential: str = ""
    date: str = ""
    logo_src: Optional[str] = None


class SlideDocumentV1(BaseModel):
    schema_version: int = SLIDE_DOCUMENT_SCHEMA_VERSION
    layout_id: str = "content_bullets"
    slots: SlideSlots = Field(default_factory=SlideSlots)
    background: SlideBackgroundSpec = Field(default_factory=SlideBackgroundSpec)
    chart_config: Optional[Dict[str, Any]] = None
