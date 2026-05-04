"""pptx_readable placeholder mapping, contract stripping, layout overlay."""

from wisedeck.services.layout_package.manifest import (
    enrich_template_manifest_with_layout_package,
    overlay_layout_package_with_pptx_readable,
)
from wisedeck.services.template.pptx_readable_contract import strip_media_blobs, wrap_and_cap_pptx_readable
from wisedeck.services.template.pptx_readable_placeholders import (
    collect_markers_union,
    count_element_types,
    ooxml_placeholder_type_to_marker,
    summarize_pptx_readable_for_layout_overlay,
)


def test_ooxml_placeholder_to_marker_ctr_title():
    assert ooxml_placeholder_type_to_marker("ctrTitle") == "PAGE_TITLE"
    assert ooxml_placeholder_type_to_marker("subTitle") == "SUBTITLE"
    assert ooxml_placeholder_type_to_marker("body") == "CONTENT_AREA"
    assert ooxml_placeholder_type_to_marker("chart") == "CHART_AREA"
    assert ooxml_placeholder_type_to_marker("tbl") == "TABLE_AREA"


def test_collect_markers_union_deep_nested_group():
    data = {
        "slides": [
            {
                "elements": [
                    {
                        "type": "group",
                        "elements": [
                            {
                                "type": "group",
                                "elements": [
                                    {
                                        "type": "shape",
                                        "isPlaceholder": True,
                                        "placeholderType": "tbl",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "type": "chart",
                        "isPlaceholder": True,
                        "placeholderType": "chart",
                    },
                ],
            },
        ],
    }
    m = collect_markers_union(data)
    assert "TABLE_AREA" in m and "CHART_AREA" in m


def test_count_element_types_includes_deep_group_children():
    slides = [
        {
            "elements": [
                {
                    "type": "group",
                    "elements": [
                        {"type": "text"},
                        {"type": "group", "elements": [{"type": "chart"}]},
                    ],
                }
            ]
        }
    ]
    c = count_element_types({"slides": slides})
    assert c.get("group") == 2
    assert c.get("text") == 1
    assert c.get("chart") == 1


def test_strip_media_blobs_removes_base64_keys():
    d = strip_media_blobs({"a": 1, "base64": "x", "nested": {"blob": "y", "z": 2}})
    assert "base64" not in str(d)
    assert d["nested"]["z"] == 2


def test_collect_markers_union_nested_placeholder():
    data = {
        "slides": [
            {
                "elements": [
                    {"type": "text", "isPlaceholder": True, "placeholderType": "ctrTitle"},
                    {"type": "group", "elements": [{"isPlaceholder": True, "placeholderType": "body"}]},
                ]
            }
        ]
    }
    m = collect_markers_union(data)
    assert "PAGE_TITLE" in m and "CONTENT_AREA" in m


def test_overlay_layout_package_merges_subtitle_schema():
    manifest = {
        "pptx_readable": {
            "slides": [
                {
                    "elements": [
                        {"type": "text", "isPlaceholder": True, "placeholderType": "subTitle"},
                        {"type": "text", "isPlaceholder": True, "placeholderType": "ctrTitle"},
                    ]
                }
            ],
            "themeColors": [],
            "usedFonts": [],
            "size": {"width": 960, "height": 540},
        },
        "source_filename": "x.pptx",
    }
    m2 = enrich_template_manifest_with_layout_package(
        manifest, workspace_id="ws1", slide_count=1, source="template_import"
    )
    m3 = overlay_layout_package_with_pptx_readable(m2)
    lp = m3["layout_package"]
    props = lp["data_schema"]["properties"]
    assert "subtitle" in props
    assert "title" in props
    assert lp["provenance"].get("pptx_readable_overlay") is True


def test_summarize_overlay_returns_none_when_empty_slides():
    assert summarize_pptx_readable_for_layout_overlay({"slides": [], "themeColors": []}) is None


def test_wrap_envelope_adds_schema_metadata():
    out = wrap_and_cap_pptx_readable(
        {"slides": [], "themeColors": ["#112233"], "usedFonts": ["Calibri"], "size": {"width": 720, "height": 540}}
    )
    assert out.get("schema_version") == 1
    assert "pptxtojson" in (out.get("parser") or "")
    assert out.get("slides") == []


def test_per_slide_signatures_basic():
    from wisedeck.services.template.pptx_readable_placeholders import build_per_slide_layout_signatures

    pr = {
        "slides": [
            {
                "elements": [
                    {"type": "text", "isPlaceholder": True, "placeholderType": "ctrTitle"},
                    {"type": "text", "isPlaceholder": True, "placeholderType": "subTitle"},
                ],
                "note": "n1",
            },
            {
                "elements": [
                    {"type": "text", "isPlaceholder": True, "placeholderType": "body"},
                    {"type": "chart", "isPlaceholder": True, "placeholderType": "chart"},
                ],
            },
            {
                "elements": [
                    {
                        "type": "group",
                        "elements": [
                            {"type": "table", "isPlaceholder": True, "placeholderType": "tbl"},
                        ],
                    }
                ],
            },
        ],
        "themeColors": ["#FF0000"],
        "size": {"width": 960, "height": 540},
    }
    sigs = build_per_slide_layout_signatures(pr)
    assert len(sigs) == 3
    assert sigs[0]["placeholder_markers"] == ["PAGE_TITLE", "SUBTITLE"]
    assert sigs[0]["has_chart"] is False
    assert sigs[1]["has_chart"] is True
    assert sigs[2]["has_table"] is True


def test_per_slide_signatures_truncates_long_notes():
    from wisedeck.services.template.pptx_readable_placeholders import build_per_slide_layout_signatures

    long_note = "x" * 200
    pr = {"slides": [{"elements": [], "note": long_note}], "size": {"width": 100, "height": 100}}
    sigs = build_per_slide_layout_signatures(pr)
    assert len(sigs[0]["note_excerpt"]) <= 120


def test_summary_carries_per_slide_signatures():
    from wisedeck.services.template.pptx_readable_placeholders import build_pptx_readable_summary_for_manifest

    pr = {
        "slides": [{"elements": [{"isPlaceholder": True, "placeholderType": "ctrTitle"}], "note": "a"}],
        "themeColors": ["#00FF00"],
        "usedFonts": ["Arial"],
        "size": {"width": 960, "height": 540},
    }
    s = build_pptx_readable_summary_for_manifest(pr)
    assert s["slide_count"] == 1
    assert len(s["per_slide_layout_signatures"]) == 1
    assert s["theme_palette"] == ["#00FF00"]
    assert s["slide_notes_excerpts"] == ["a"]


def test_overlay_per_slide_data_schemas_appended():
    manifest = {
        "pptx_readable": {
            "slides": [
                {
                    "elements": [
                        {"type": "text", "isPlaceholder": True, "placeholderType": "ctrTitle"},
                    ],
                },
                {
                    "elements": [{"type": "chart"}],
                },
            ],
            "themeColors": [],
            "usedFonts": [],
            "size": {"width": 960, "height": 540},
        },
        "source_filename": "x.pptx",
    }
    m2 = enrich_template_manifest_with_layout_package(
        manifest, workspace_id="ws1", slide_count=2, source="template_import"
    )
    m3 = overlay_layout_package_with_pptx_readable(m2)
    lp = m3["layout_package"]
    assert isinstance(lp.get("per_slide_data_schemas"), list)
    assert len(lp["per_slide_data_schemas"]) == 2
    assert lp["per_slide_data_schemas"][1]["schema"]["properties"].get("chart_config")
