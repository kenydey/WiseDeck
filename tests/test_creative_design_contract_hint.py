"""CreativeDesignService template_contract hint (per-slide)."""

from unittest.mock import MagicMock

from wisedeck.services.slide.creative_design_service import CreativeDesignService


def test_hint_includes_per_slide_section_when_signatures_present():
    svc = CreativeDesignService(MagicMock())
    imp = {
        "structured_contract": True,
        "template_contract": {
            "pptx_readable_summary": {
                "placeholder_markers_union": ["PAGE_TITLE"],
                "theme_colors": ["#111111"],
            },
            "per_slide_layout_signatures": [
                {
                    "index": 1,
                    "placeholder_markers": ["PAGE_TITLE", "CONTENT_AREA"],
                    "element_kinds": {"text": 2},
                    "has_chart": False,
                    "has_table": False,
                    "has_diagram": False,
                    "has_math": False,
                    "note_excerpt": "讲解本页",
                }
            ],
        },
    }
    text = svc._format_template_contract_hint(imp, page_number=1, total_pages=3)
    assert "当前页结构" in text
    assert "占位符" in text
    assert "讲解本页" in text


def test_hint_truncates_note_excerpt_to_budget():
    svc = CreativeDesignService(MagicMock())
    long_note = "字" * 300
    imp = {
        "structured_contract": True,
        "template_contract": {
            "pptx_readable_summary": {},
            "per_slide_layout_signatures": [
                {
                    "index": 1,
                    "placeholder_markers": ["PAGE_TITLE"],
                    "element_kinds": {},
                    "has_chart": False,
                    "has_table": False,
                    "has_diagram": False,
                    "has_math": False,
                    "note_excerpt": long_note,
                }
            ],
        },
    }
    text = svc._format_template_contract_hint(imp, page_number=1, total_pages=1)
    assert "当前页结构" in text
    note_line = next((ln for ln in text.split("\n") if ln.startswith("原页备注摘要：")), "")
    assert note_line
    assert len(note_line) <= len("原页备注摘要：") + 120


def test_hint_omits_per_slide_section_for_legacy_summary():
    svc = CreativeDesignService(MagicMock())
    imp = {
        "structured_contract": True,
        "template_contract": {
            "pptx_readable_summary": {"placeholder_markers_union": ["PAGE_TITLE"]},
        },
    }
    text = svc._format_template_contract_hint(imp, page_number=2, total_pages=5)
    assert "当前页结构" not in text
    assert "占位语义对齐" in text
