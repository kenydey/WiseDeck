import re
from pathlib import Path

from wisedeck.services.template.template_office_svg_placeholder_inject import (
    inject_pptx_placeholders_into_slide_svg,
    inject_placeholders_into_workspace_svgs,
)


def test_inject_inserts_text_markers_for_title_and_body():
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"></svg>'
    layout = {
        "shapes": [
            {
                "bbox": [0.1, 0.05, 0.8, 0.15],
                "placeholder_type": "TITLE",
                "is_placeholder": True,
                "shape_kind": "text",
            },
            {
                "bbox": [0.1, 0.25, 0.8, 0.5],
                "placeholder_type": "BODY",
                "is_placeholder": True,
                "shape_kind": "text",
            },
        ],
    }
    out = inject_pptx_placeholders_into_slide_svg(svg, slide_layout=layout)
    assert "{{PAGE_TITLE}}" in out
    assert "{{CONTENT_AREA}}" in out
    assert "</svg>" in out


def test_inject_inserts_chart_and_table_placeholder_markers():
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"></svg>'
    layout = {
        "shapes": [
            {
                "bbox": [0.05, 0.1, 0.4, 0.35],
                "placeholder_type": "CHART",
                "is_placeholder": True,
                "shape_kind": "chart",
            },
            {
                "bbox": [0.52, 0.1, 0.43, 0.35],
                "placeholder_type": "TABLE",
                "is_placeholder": True,
                "shape_kind": "other",
            },
        ],
    }
    out = inject_pptx_placeholders_into_slide_svg(svg, slide_layout=layout)
    assert "{{CHART_AREA}}" in out
    assert "{{TABLE_AREA}}" in out


def test_inject_skips_when_no_placeholders():
    svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><text>{{PAGE_TITLE}}</text></svg>"
    layout = {
        "shapes": [
            {
                "bbox": [0, 0, 1, 0.2],
                "placeholder_type": "TITLE",
                "is_placeholder": True,
                "shape_kind": "text",
            },
        ],
    }
    out = inject_pptx_placeholders_into_slide_svg(svg, slide_layout=layout)
    assert out.count("{{PAGE_TITLE}}") == 1


_BARE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"></svg>'


def test_workspace_inject_fallback_when_layout_has_error(tmp_path):
    """When pptx_layout contains an error, fallback placeholders are injected."""
    svg_dir = tmp_path / "svg"
    svg_dir.mkdir()
    (svg_dir / "slide_01.svg").write_text(_BARE_SVG, encoding="utf-8")

    layout_with_error = {"schema_version": 1, "error": "'list' object has no attribute 'rId'", "slides": []}
    inject_placeholders_into_workspace_svgs(svg_dir, layout_with_error)

    result = (svg_dir / "slide_01.svg").read_text(encoding="utf-8")
    assert "{{PAGE_TITLE}}" in result
    assert "{{CONTENT_AREA}}" in result


def test_workspace_inject_fallback_when_layout_is_none(tmp_path):
    """When pptx_layout is None, fallback placeholders are injected."""
    svg_dir = tmp_path / "svg"
    svg_dir.mkdir()
    (svg_dir / "slide_01.svg").write_text(_BARE_SVG, encoding="utf-8")

    inject_placeholders_into_workspace_svgs(svg_dir, None)

    result = (svg_dir / "slide_01.svg").read_text(encoding="utf-8")
    assert "{{PAGE_TITLE}}" in result
    assert "{{CONTENT_AREA}}" in result


def test_workspace_inject_fallback_when_slides_empty(tmp_path):
    """When pptx_layout has no slides[], fallback placeholders are injected."""
    svg_dir = tmp_path / "svg"
    svg_dir.mkdir()
    (svg_dir / "slide_01.svg").write_text(_BARE_SVG, encoding="utf-8")
    (svg_dir / "slide_02.svg").write_text(_BARE_SVG, encoding="utf-8")

    inject_placeholders_into_workspace_svgs(svg_dir, {"schema_version": 1, "slides": []})

    for i in (1, 2):
        result = (svg_dir / f"slide_{i:02d}.svg").read_text(encoding="utf-8")
        assert "{{PAGE_TITLE}}" in result
        assert "{{CONTENT_AREA}}" in result


def test_workspace_inject_uses_hints_when_available(tmp_path):
    """When pptx_layout has valid slides, uses per-slide hints (not fallback)."""
    svg_dir = tmp_path / "svg"
    svg_dir.mkdir()
    (svg_dir / "slide_01.svg").write_text(_BARE_SVG, encoding="utf-8")

    layout = {
        "schema_version": 1,
        "slides": [
            {
                "index": 1,
                "shapes": [
                    {
                        "bbox": [0.1, 0.05, 0.8, 0.15],
                        "placeholder_type": "TITLE",
                        "is_placeholder": True,
                        "shape_kind": "text",
                    },
                    {
                        "bbox": [0.1, 0.25, 0.8, 0.5],
                        "placeholder_type": "BODY",
                        "is_placeholder": True,
                        "shape_kind": "text",
                    },
                ],
            }
        ],
    }
    inject_placeholders_into_workspace_svgs(svg_dir, layout)

    result = (svg_dir / "slide_01.svg").read_text(encoding="utf-8")
    assert "{{PAGE_TITLE}}" in result
    assert "{{CONTENT_AREA}}" in result


def test_workspace_inject_fallback_when_shapes_have_no_placeholders(tmp_path):
    """When pptx_layout has slides but no shapes have is_placeholder=True,
    the fallback layout is used to inject required markers."""
    svg_dir = tmp_path / "svg"
    svg_dir.mkdir()
    (svg_dir / "slide_01.svg").write_text(_BARE_SVG, encoding="utf-8")

    layout = {
        "schema_version": 1,
        "slides": [
            {
                "index": 1,
                "shapes": [
                    {
                        "bbox": [0.1, 0.05, 0.8, 0.15],
                        "placeholder_type": None,
                        "is_placeholder": False,
                        "shape_kind": "text",
                    },
                    {
                        "bbox": [0.1, 0.25, 0.8, 0.5],
                        "placeholder_type": None,
                        "is_placeholder": False,
                        "shape_kind": "text",
                    },
                ],
            }
        ],
    }
    inject_placeholders_into_workspace_svgs(svg_dir, layout)

    result = (svg_dir / "slide_01.svg").read_text(encoding="utf-8")
    assert "{{PAGE_TITLE}}" in result, "Fallback should inject PAGE_TITLE when hint shapes lack placeholders"
    assert "{{CONTENT_AREA}}" in result, "Fallback should inject CONTENT_AREA when hint shapes lack placeholders"


def test_workspace_inject_prefers_pptx_readable_when_layout_empty(tmp_path):
    """pptx_readable geometry is used when python-pptx layout has no per-slide hints."""
    svg_dir = tmp_path / "svg"
    svg_dir.mkdir()
    (svg_dir / "slide_01.svg").write_text(_BARE_SVG, encoding="utf-8")

    layout = {"schema_version": 1, "slides": []}
    readable = {
        "slides": [
            {
                "elements": [
                    {
                        "type": "text",
                        "left": 48,
                        "top": 54,
                        "width": 864,
                        "height": 108,
                        "isPlaceholder": True,
                        "placeholderType": "ctrTitle",
                    },
                ],
            },
        ],
        "size": {"width": 960, "height": 540},
    }
    inject_placeholders_into_workspace_svgs(svg_dir, layout, pptx_readable=readable)
    result = (svg_dir / "slide_01.svg").read_text(encoding="utf-8")
    assert "{{PAGE_TITLE}}" in result
