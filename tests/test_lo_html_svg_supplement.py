"""
Tests for the LibreOffice HTML pipeline SVG supplement logic.

Verifies that _supplement_svg_from_pptx produces an svg_template with
placeholder markers injected, reusing the same SVG pipeline as svg_stack.
"""

import textwrap
from pathlib import Path
from unittest import mock

import pytest

from wisedeck.services.template.slide_svg_bundler import bundle_workspace_svgs
from wisedeck.services.template.template_office_svg_placeholder_inject import (
    inject_pptx_placeholders_into_slide_svg,
)
from wisedeck.svg_export.placeholder_adapter import scan_svg_placeholder_inner_names


MINIMAL_SVG = textwrap.dedent("""\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <rect width="1280" height="720" fill="#eee"/>
      <text x="640" y="100" text-anchor="middle">Sample Title</text>
      <text x="640" y="400" text-anchor="middle">Sample Body</text>
    </svg>""")


def test_placeholder_injection_adds_markers_to_svg():
    """inject_pptx_placeholders_into_slide_svg adds {{PAGE_TITLE}} and {{CONTENT_AREA}}
    when layout hints contain title+body placeholders."""
    layout = {
        "index": 1,
        "shapes": [
            {
                "bbox": [0.05, 0.05, 0.9, 0.12],
                "placeholder_type": "TITLE",
                "is_placeholder": True,
                "shape_kind": "text",
            },
            {
                "bbox": [0.05, 0.25, 0.9, 0.6],
                "placeholder_type": "BODY",
                "is_placeholder": True,
                "shape_kind": "text",
            },
        ],
    }
    result = inject_pptx_placeholders_into_slide_svg(MINIMAL_SVG, slide_layout=layout)
    assert "{{PAGE_TITLE}}" in result
    assert "{{CONTENT_AREA}}" in result


def test_scan_finds_injected_markers():
    """scan_svg_placeholder_inner_names correctly finds injected markers."""
    layout = {
        "shapes": [
            {"bbox": [0.05, 0.05, 0.9, 0.12], "placeholder_type": "TITLE", "is_placeholder": True, "shape_kind": "text"},
            {"bbox": [0.05, 0.25, 0.9, 0.6], "placeholder_type": "BODY", "is_placeholder": True, "shape_kind": "text"},
        ],
    }
    injected = inject_pptx_placeholders_into_slide_svg(MINIMAL_SVG, slide_layout=layout)
    names = scan_svg_placeholder_inner_names(injected)
    assert "PAGE_TITLE" in names
    assert "CONTENT_AREA" in names


def test_bundle_workspace_svgs_with_injected_placeholders(tmp_path):
    """bundle_workspace_svgs produces svg_template containing placeholder markers."""
    svg_dir = tmp_path / "svg"
    svg_dir.mkdir()
    layout = {
        "shapes": [
            {"bbox": [0.05, 0.05, 0.9, 0.12], "placeholder_type": "TITLE", "is_placeholder": True, "shape_kind": "text"},
            {"bbox": [0.05, 0.25, 0.9, 0.6], "placeholder_type": "BODY", "is_placeholder": True, "shape_kind": "text"},
        ],
    }
    injected = inject_pptx_placeholders_into_slide_svg(MINIMAL_SVG, slide_layout=layout)
    (svg_dir / "slide_01.svg").write_text(injected, encoding="utf-8")

    svg_t, html_t, warnings, slide_xmls = bundle_workspace_svgs(svg_dir, "vertical_stack")

    assert "{{PAGE_TITLE}}" in svg_t
    assert "{{CONTENT_AREA}}" in svg_t
    assert len(slide_xmls) == 1
    markers = scan_svg_placeholder_inner_names(svg_t)
    assert "PAGE_TITLE" in markers
    assert "CONTENT_AREA" in markers


def test_supplement_import_summary_fields():
    """Verify that the import_summary fields computed in the LO HTML supplement
    path contain expected keys when markers are present."""
    import hashlib
    from wisedeck.services.template.svg_template_import_meta import (
        trim_svg_slide_xmls_for_persistence,
    )

    layout = {
        "shapes": [
            {"bbox": [0.05, 0.05, 0.9, 0.12], "placeholder_type": "TITLE", "is_placeholder": True, "shape_kind": "text"},
        ],
    }
    injected = inject_pptx_placeholders_into_slide_svg(MINIMAL_SVG, slide_layout=layout)
    svg_slide_xmls = [injected]

    markers_union: set[str] = set()
    for xml in svg_slide_xmls:
        markers_union.update(scan_svg_placeholder_inner_names(xml))
    sorted_markers = sorted(markers_union)

    assert "PAGE_TITLE" in sorted_markers

    joined = "|".join(sorted_markers)
    placeholder_hash = hashlib.sha256(joined.encode("utf-8")).hexdigest()
    assert placeholder_hash  # non-empty

    trimmed, warnings = trim_svg_slide_xmls_for_persistence(svg_slide_xmls)
    assert trimmed is not None
    assert len(trimmed) == 1
    assert "{{PAGE_TITLE}}" in trimmed[0]
