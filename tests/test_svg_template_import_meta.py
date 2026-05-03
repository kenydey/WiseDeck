"""Tests for template import_summary helpers (trim limits, marker union)."""

from __future__ import annotations

from wisedeck.services.template.svg_template_import_meta import (
    build_import_summary,
    infer_markers_from_html_placeholders,
    merge_import_summary_with_template_contract,
    placeholder_markers_from_template_contract,
    trim_svg_slide_xmls_for_persistence,
)


def test_trim_svg_slide_xmls_page_limit(monkeypatch):
    monkeypatch.setenv("WISEDECK_TEMPLATE_IMPORT_SVG_SLIDES_MAX_PAGES", "2")
    out, warnings = trim_svg_slide_xmls_for_persistence(["a", "b", "c"])
    assert out is None
    assert warnings and "上限" in warnings[0]


def test_trim_svg_slide_xmls_ok():
    out, warnings = trim_svg_slide_xmls_for_persistence(["<svg/>", "<svg/>"])
    assert out == ["<svg/>", "<svg/>"]
    assert warnings == []


def test_build_import_summary_marker_union_across_slides():
    merged = "<svg>{{PAGE_TITLE}}</svg>"
    slides = ["<svg>{{CONTENT_AREA}}</svg>", "<svg>{{TABLE_AREA}}</svg>"]
    s = build_import_summary(
        svg_template=merged,
        svg_slide_xmls=slides,
        slide_count=2,
        bundle_mode="vertical_stack",
        source_filename="x",
        template_provenance="test",
    )
    mk = set(s["placeholder_markers"])
    assert {"PAGE_TITLE", "CONTENT_AREA", "TABLE_AREA"}.issubset(mk)
    assert s.get("native_export_mode") == "per_slide"
    assert s.get("svg_slide_xmls") == slides


def test_placeholder_markers_from_template_contract_summary_union():
    tc = {
        "pptx_readable_summary": {
            "placeholder_markers_union": ["page_title", "CONTENT_AREA", " PAGE_NUM "],
        }
    }
    assert placeholder_markers_from_template_contract(tc) == [
        "CONTENT_AREA",
        "PAGE_NUM",
        "PAGE_TITLE",
    ]


def test_merge_import_summary_with_template_contract_unifies_markers():
    imp = {"placeholder_markers": ["CONTENT_AREA"], "slide_count": 3}
    tc = {"pptx_readable_summary": {"placeholder_markers_union": ["PAGE_TITLE", "CONTENT_AREA"]}}
    out = merge_import_summary_with_template_contract(imp, tc)
    assert out.get("template_contract") == tc
    assert out.get("placeholder_markers") == ["CONTENT_AREA", "PAGE_TITLE"]
    assert isinstance(out.get("placeholder_hash"), str) and len(out["placeholder_hash"]) == 64


def test_infer_markers_from_html_placeholders_maps_legacy_tokens():
    html = (
        "<html><body>{{ page_title }} {{ page_content }} "
        "{{ current_page_number }} {{ total_page_count }}</body></html>"
    )
    out = infer_markers_from_html_placeholders(html)
    assert out == ["CONTENT_AREA", "PAGE_NUM", "PAGE_TITLE"]
