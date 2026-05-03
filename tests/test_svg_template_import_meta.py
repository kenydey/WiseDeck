"""Tests for template import_summary helpers (trim limits, marker union)."""

from __future__ import annotations

from wisedeck.services.template.svg_template_import_meta import (
    build_import_summary,
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
