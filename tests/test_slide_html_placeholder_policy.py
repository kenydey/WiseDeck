from wisedeck.services.slide.slide_html_placeholder_policy import (
    extract_placeholder_inners_from_html,
    is_allowed_placeholder_inner,
    required_markers_for_slide,
)


def test_extract_placeholders_basic():
    html = '<div>{{ PAGE_TITLE }}</div><p>{{CONTENT_AREA}}</p>'
    assert extract_placeholder_inners_from_html(html) == {"PAGE_TITLE", "CONTENT_AREA"}


def test_is_allowed_chart_table():
    assert is_allowed_placeholder_inner("CHART_AREA")
    assert is_allowed_placeholder_inner("TOC_ITEM_1_TITLE")
    assert not is_allowed_placeholder_inner("bad_lower")


def test_required_markers_empty_without_contract():
    assert required_markers_for_slide(None, {"title": "x"}, 1) == set()


def test_required_markers_title_and_content():
    tmpl = {
        "import_summary": {
            "template_contract": {
                "pptx_readable_summary": {
                    "placeholder_markers_union": ["PAGE_TITLE", "CONTENT_AREA"],
                },
            },
        },
    }
    r = required_markers_for_slide(tmpl, {"bullet_points": ["a"]}, 2)
    assert "PAGE_TITLE" in r and "CONTENT_AREA" in r


def test_required_chart_when_slide_hints():
    tmpl = {
        "import_summary": {
            "template_contract": {
                "pptx_readable_summary": {"placeholder_markers_union": ["CHART_AREA"]},
            },
        },
    }
    assert required_markers_for_slide(tmpl, {"slide_type": "chart_slide"}, 2) == {"CHART_AREA"}
