"""HTML helpers for legacy raster viewport wrapping (Playwright raster path removed)."""

from __future__ import annotations

from .canvas_constants import VIEWPORT_HEIGHT, VIEWPORT_WIDTH

_PREVIEW_AUTHORING_WIDTH = 1280
_PREVIEW_AUTHORING_HEIGHT = 720


def wrap_html_for_raster_viewport(html_content: str) -> str:
    """
    Pack slide HTML in a 1280×720 authoring box, uniformly scaled into the PPTist logical viewport.
    Kept for tests and any future non-Playwright raster tooling.
    """
    inner = html_content or ""
    sw = float(VIEWPORT_WIDTH) / float(_PREVIEW_AUTHORING_WIDTH)
    return (
        "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/>"
        "<style>html,body{margin:0;padding:0;background:#ffffff;}"
        "#wds-raster-slot{width:"
        + str(int(VIEWPORT_WIDTH))
        + "px;height:"
        + str(int(VIEWPORT_HEIGHT))
        + "px;overflow:hidden;position:relative;background:#ffffff;}"
        "#wds-raster-inner{width:"
        + str(_PREVIEW_AUTHORING_WIDTH)
        + "px;height:"
        + str(_PREVIEW_AUTHORING_HEIGHT)
        + "px;transform:scale("
        + str(sw)
        + ");transform-origin:0 0;}"
        "</style></head><body>"
        '<div id="wds-raster-slot"><div id="wds-raster-inner">'
        + inner
        + "</div></div></body></html>"
    )
