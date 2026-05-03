"""Unit tests for per-slide SVG selection in svg_native structured export."""

from __future__ import annotations

from wisedeck.services.structured_export.service import (
    _coerce_stored_svg_slide_xmls,
    _svg_native_xml_for_each_slide,
)


def test_coerce_stored_svg_slide_xmls_filters_blank():
    assert _coerce_stored_svg_slide_xmls(None) is None
    assert _coerce_stored_svg_slide_xmls({"svg_slide_xmls": []}) is None
    assert _coerce_stored_svg_slide_xmls({"svg_slide_xmls": ["", "  ", "<svg/>"]}) == ["<svg/>"]


def test_svg_native_cycles_slide_pool():
    merged = "<svg merged/>"
    imp = {"svg_slide_xmls": ["<svg>a</svg>", "<svg>b</svg>"]}
    seq = _svg_native_xml_for_each_slide(
        svg_template=merged,
        import_summary=imp,
        deck_slide_count=5,
    )
    assert seq == [
        "<svg>a</svg>",
        "<svg>b</svg>",
        "<svg>a</svg>",
        "<svg>b</svg>",
        "<svg>a</svg>",
    ]


def test_svg_native_legacy_single_template():
    merged = "<svg merged/>"
    seq = _svg_native_xml_for_each_slide(
        svg_template=merged,
        import_summary=None,
        deck_slide_count=3,
    )
    assert seq == [merged, merged, merged]
