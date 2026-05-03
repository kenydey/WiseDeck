"""Regression: prompt size budgeting and rule-based layout CSS injection."""

from wisedeck.services.prompts import design_prompts as dp
from wisedeck.services.slide.layout_scorer import apply_rule_based_layout_fixes


def test_apply_rule_based_layout_fixes_injects_css_no_typeerror():
    html = "<!DOCTYPE html><html><head></head><body><p>x</p></body></html>"
    diagnostics = {"severity": "medium", "overflow_snippets": ["mock"]}
    out = apply_rule_based_layout_fixes(html, diagnostics)
    assert "anti-overflow-fix" in out
    assert "</head>" in out.lower()


def test_format_slide_data_for_prompt_strips_collection_and_truncates():
    huge_data = "data:image/png;base64," + "x" * 50_000
    slide = {
        "title": "T",
        "slide_type": "content",
        "images_collection": object(),
        "images_info": {
            "images": [{"absolute_url": huge_data, "purpose": "icon", "source": "local"}],
        },
        "html_content": "<div>" + "y" * 30_000 + "</div>",
        "content_points": ["a", "b"],
    }
    text = dp._format_slide_data_for_prompt(slide)
    assert "images_collection" not in text
    assert len(huge_data) > 1000
    assert huge_data not in text
    assert "[data URL 已截断" in text or "data:image/png;base64" in text
    assert "html_content 已截断" in text
    assert len(text) <= dp._MAX_SLIDE_DATA_JSON_CHARS + 200


def test_build_template_html_context_truncates():
    raw = "<html><head></head><body>" + "z" * (dp._MAX_TEMPLATE_HTML_CONTEXT_CHARS + 10_000)
    out = dp.DesignPrompts._build_template_html_context(raw)
    assert len(out) < len(raw)
    assert "模板 HTML 已截断" in out
    assert out.startswith("<html>")


def test_get_creative_template_context_uses_safe_slide_blob():
    slide_data = {
        "title": "Hi",
        "slide_type": "content",
        "html_content": "B" * 20_000,
        "images_summary": "ok",
    }
    prompt = dp.DesignPrompts.get_creative_template_context_prompt(
        slide_data=slide_data,
        template_html="<div/>",
        slide_title="Hi",
        slide_type="content",
        page_number=1,
        total_pages=2,
        context_info="",
        style_genes="genes",
    )
    assert "B" * 15_000 not in prompt
    assert "html_content 已截断" in prompt or len(slide_data["html_content"]) > dp._MAX_HTML_CONTENT_IN_SLIDE_PROMPT
