import pytest

from wisedeck.svg_export.engine import build_slide_placeholders_from_wisedeck_contract
from wisedeck.svg_export.errors import SVGPlaceholdersError
from wisedeck.svg_export.placeholder_adapter import (
    adapt_wisedeck_placeholders,
    assert_all_placeholders_replaced,
    fill_svg_placeholders,
    scan_svg_placeholder_inner_names,
)


def test_scan_svg_placeholder_inner_names_sorted_unique():
    xml = '<svg><text>{{ PAGE_TITLE }}</text><t>{{CONTENT_AREA}}</t></svg>'
    assert scan_svg_placeholder_inner_names(xml) == ["CONTENT_AREA", "PAGE_TITLE"]


def test_build_slide_placeholders_title_subtitle_and_total():
    d = build_slide_placeholders_from_wisedeck_contract(
        page_title="T",
        page_content="C\nline",
        page_num=2,
        total_pages=5,
        deck_title="Deck",
        subtitle="Sub",
    )
    assert d["PAGE_TITLE"] == "T"
    assert d["CONTENT_AREA"] == "C\nline"
    assert d["PAGE_CONTENT"] == "C\nline"
    assert d["PAGE_NUM"] == "2"
    assert d["TOTAL_PAGE_COUNT"] == "5"
    assert d["TITLE"] == "Deck"
    assert d["SUBTITLE"] == "Sub"


def test_build_slide_placeholders_deck_title_falls_back_to_page_title():
    d = build_slide_placeholders_from_wisedeck_contract(
        page_title="Only",
        page_content="Body",
        page_num=1,
        total_pages=1,
    )
    assert d["TITLE"] == "Only"


def test_fill_svg_placeholders_strict_page_index():
    with pytest.raises(SVGPlaceholdersError) as ei:
        fill_svg_placeholders(
            "<svg xmlns='http://www.w3.org/2000/svg'>{{FOO}}</svg>",
            {"PAGE_TITLE": "x"},
            strict=True,
            page_index=7,
        )
    assert ei.value.page_index == 7


def test_assert_all_placeholders_replaced_allowed():
    assert_all_placeholders_replaced(
        svg_xml="<svg>{{A}}</svg>",
        allowed_inner_names={"A"},
        strict=True,
    )


def test_adapt_target_marker_set_filters():
    m = adapt_wisedeck_placeholders(
        {"page_title": "a", "page_content": "b"},
        strict=True,
        target_marker_set={"PAGE_TITLE", "CONTENT_AREA"},
    )
    assert set(m.keys()) == {"PAGE_TITLE", "CONTENT_AREA"}
