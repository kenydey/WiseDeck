"""pptx_readable placeholder mapping, contract stripping, layout overlay."""

from wisedeck.services.layout_package.manifest import (
    enrich_template_manifest_with_layout_package,
    overlay_layout_package_with_pptx_readable,
)
from wisedeck.services.template.pptx_readable_contract import strip_media_blobs, wrap_and_cap_pptx_readable
from wisedeck.services.template.pptx_readable_placeholders import (
    collect_markers_union,
    ooxml_placeholder_type_to_marker,
    summarize_pptx_readable_for_layout_overlay,
)


def test_ooxml_placeholder_to_marker_ctr_title():
    assert ooxml_placeholder_type_to_marker("ctrTitle") == "PAGE_TITLE"
    assert ooxml_placeholder_type_to_marker("subTitle") == "SUBTITLE"
    assert ooxml_placeholder_type_to_marker("body") == "CONTENT_AREA"


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
