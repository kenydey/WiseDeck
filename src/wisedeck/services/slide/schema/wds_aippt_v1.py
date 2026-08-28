"""WiseDeck structured slide payload (AIPPT-compatible v1) — validated before emit to PPTist JSON."""

from __future__ import annotations

from typing import Any, List, Literal, Optional, Union

from pydantic import BaseModel, ConfigDict, Field

WDS_AIPPT_SCHEMA_VERSION = 1


class AssemblyPrefs(BaseModel):
    """Optional per-slide or project defaults merged by assemble_generated_slide_outputs."""

    model_config = ConfigDict(extra="forbid")

    use_pptx_bridge: bool = False
    force_raster: bool = False


class AIPPTImage(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: Optional[str] = None
    src: str = ""
    width: Optional[float] = None
    height: Optional[float] = None


class CoverData(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = ""
    text: str = ""


class ContentsData(BaseModel):
    model_config = ConfigDict(extra="forbid")

    items: List[str] = Field(default_factory=list)


class TransitionData(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = ""
    text: str = ""


class ContentBulletItem(BaseModel):
    """Legacy list item (no kind) — maps to template list slots."""

    model_config = ConfigDict(extra="forbid")

    title: str = ""
    text: str = ""


class ContentTextItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    kind: Literal["text"] = "text"
    title: str = ""
    text: str = ""


class AIPPTChartSeries(BaseModel):
    model_config = ConfigDict(extra="forbid")

    label: str = ""
    data: List[float] = Field(default_factory=list)


class ContentChartItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    kind: Literal["chart"] = "chart"
    chartType: str = "bar"
    labels: List[str] = Field(default_factory=list)
    series: List[AIPPTChartSeries] = Field(default_factory=list)


class ContentImageItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    kind: Literal["image"] = "image"
    src: str = ""
    width: Optional[float] = None
    height: Optional[float] = None
    title: str = ""
    text: str = ""


ContentItem = Union[ContentBulletItem, ContentTextItem, ContentChartItem, ContentImageItem]


class ContentData(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = ""
    items: List[ContentItem] = Field(default_factory=list)


class ReferenceData(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = ""
    items: List[ContentBulletItem] = Field(default_factory=list)


class WDSlideCover(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["cover"] = "cover"
    data: CoverData = Field(default_factory=CoverData)
    images: Optional[List[AIPPTImage]] = None


class WDSlideContents(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["contents"] = "contents"
    data: ContentsData = Field(default_factory=ContentsData)
    images: Optional[List[AIPPTImage]] = None


class WDSlideTransition(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["transition"] = "transition"
    data: TransitionData = Field(default_factory=TransitionData)
    images: Optional[List[AIPPTImage]] = None


class WDSlideContent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["content"] = "content"
    data: ContentData = Field(default_factory=ContentData)
    images: Optional[List[AIPPTImage]] = None


class WDSlideEnd(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["end"] = "end"
    data: CoverData = Field(default_factory=CoverData)


class WDSlideReference(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["reference"] = "reference"
    data: ReferenceData = Field(default_factory=ReferenceData)


WDSAnySlide = Union[
    WDSlideCover,
    WDSlideContents,
    WDSlideTransition,
    WDSlideContent,
    WDSlideEnd,
    WDSlideReference,
]


def parse_content_item(obj: Any) -> ContentItem:
    """Parse a loose dict into a ContentItem union member."""
    if not isinstance(obj, dict):
        return ContentBulletItem(title="", text="")
    kind = obj.get("kind")
    if kind == "chart":
        return ContentChartItem.model_validate(obj)
    if kind == "text":
        return ContentTextItem.model_validate(obj)
    if kind == "image":
        return ContentImageItem.model_validate(obj)
    return ContentBulletItem.model_validate(obj)


def parse_wds_aippt_slide(obj: dict) -> WDSAnySlide:
    """Route dict to the correct slide model by ``type``."""
    t = (obj.get("type") or "").strip().lower()
    if t == "cover":
        return WDSlideCover.model_validate(obj)
    if t == "contents":
        return WDSlideContents.model_validate(obj)
    if t == "transition":
        return WDSlideTransition.model_validate(obj)
    if t == "content":
        raw = dict(obj)
        data = raw.get("data") or {}
        if isinstance(data, dict) and "items" in data:
            items_raw = data.get("items") or []
            data = dict(data)
            data["items"] = [parse_content_item(x) for x in items_raw]
            raw["data"] = data
        return WDSlideContent.model_validate(raw)
    if t == "end":
        return WDSlideEnd.model_validate(obj)
    if t == "reference":
        raw_ref = dict(obj)
        data = dict(raw_ref.get("data") or {})
        items_raw = data.get("items") or []
        data["items"] = [ContentBulletItem.model_validate(x) if isinstance(x, dict) else ContentBulletItem(title=str(x), text="") for x in items_raw]
        raw_ref["data"] = data
        return WDSlideReference.model_validate(raw_ref)
    raise ValueError(f"unsupported wds_aippt slide type: {t!r}")
