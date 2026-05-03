from wisedeck.services.slide.slide_html_placeholder_enforce import (
    enforce_slide_placeholder_slots,
    normalize_placeholder_spacing,
)


def test_normalize_spacing_collapses_inner_whitespace():
    out = normalize_placeholder_spacing("<body>{{  PAGE_TITLE  }}</body>")
    assert "{{PAGE_TITLE}}" in out


def test_enforce_injects_missing_into_body():
    html = "<html><body><p>x</p></body></html>"
    out, inj = enforce_slide_placeholder_slots(html, {"PAGE_TITLE"})
    assert "{{PAGE_TITLE}}" in out
    assert inj == ["PAGE_TITLE"]
    assert "wd-slot" in out


def test_enforce_noop_when_present():
    html = "<body>{{PAGE_TITLE}}</body>"
    out, inj = enforce_slide_placeholder_slots(html, {"PAGE_TITLE"})
    assert inj == []
    assert out == html or "{{PAGE_TITLE}}" in out
