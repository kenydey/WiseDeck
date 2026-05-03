from wisedeck.svg_export import drawingml_poc as dm


def test_poc_disabled_by_default(monkeypatch):
    monkeypatch.delenv("WISEDECK_SVG_DRAWINGML_POC", raising=False)
    out = dm.analyze_simple_svg_rects('<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>')
    assert out.get("enabled") is False


def test_poc_parses_rect_when_enabled(monkeypatch):
    monkeypatch.setenv("WISEDECK_SVG_DRAWINGML_POC", "1")
    svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect x="5" y="6" width="10" height="20" fill="red"/></svg>'
    out = dm.analyze_simple_svg_rects(svg)
    assert out.get("enabled") is True
    assert out.get("rect_count", 0) >= 1
