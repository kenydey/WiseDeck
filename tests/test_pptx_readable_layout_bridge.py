from wisedeck.services.template.pptx_readable_layout_bridge import (
    slide_layout_hints_from_pptx_readable_slide,
)


def test_slide_layout_hints_from_readable_normalizes_bbox():
    pr = {
        "size": {"width": 960, "height": 540},
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
    }
    layout = slide_layout_hints_from_pptx_readable_slide(pr, 1)
    assert layout is not None
    assert layout["index"] == 1
    sh = layout["shapes"][0]
    assert sh["is_placeholder"] is True
    assert sh["placeholder_type"] == "ctrTitle"
    assert abs(sh["bbox"][0] - 0.05) < 0.01
    assert abs(sh["bbox"][2] - 0.9) < 0.01
