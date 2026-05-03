from wisedeck.services.template.template_office_svg_placeholder_inject import (
    inject_pptx_placeholders_into_slide_svg,
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
