from wisedeck.services.structured_export.pptx_layout_utils import (
    clamp_slide_size_inches,
    parse_simple_html_table,
    pixels_to_inches,
)


def test_pixels_to_inches_default_dpi():
    assert abs(pixels_to_inches(96) - 1.0) < 1e-6


def test_clamp_slide_size_scales_down_wide_canvas():
    w, h = clamp_slide_size_inches(100_000, 56_250, dpi=96)
    assert w <= 56.0 + 1e-6
    assert h <= 56.0 + 1e-6
    assert abs(w / h - (100_000 / 56_250)) < 0.02


def test_parse_simple_html_table():
    html = "<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>"
    rows = parse_simple_html_table(html)
    assert rows == [["A", "B"], ["1", "2"]]
