"""SSOT hybrid preview: raster HTML wrapper + parity upgrade wiring."""

from __future__ import annotations

from wisedeck.services.slide.canvas_constants import VIEWPORT_HEIGHT, VIEWPORT_WIDTH
from wisedeck.services.slide.html_layout_to_pptist_playwright import wrap_html_for_raster_viewport


def test_wrap_html_for_raster_viewport_scales_1280_canvas():
    html = '<div style="width:1280px;height:720px;background:#f00;">x</div>'
    wrapped = wrap_html_for_raster_viewport(html)
    assert "wds-raster-slot" in wrapped
    assert "wds-raster-inner" in wrapped
    assert str(int(VIEWPORT_WIDTH)) in wrapped
    assert str(int(VIEWPORT_HEIGHT)) in wrapped
    assert "transform:scale(" in wrapped


def test_wrap_html_empty_is_document():
    w = wrap_html_for_raster_viewport("")
    assert "<!DOCTYPE html>" in w
