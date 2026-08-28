"""Tests for slide_visual_sync (element HTML coverage + visual SSOT sync)."""

from __future__ import annotations

from wisedeck.services.slide.slide_visual_sync import (
    PPTIST_ELEMENT_HTML_COVERAGE,
    append_element_preview_html,
    enrich_slide_row_for_editor_preview,
    is_export_chrome_preview_html,
    pptist_elements_to_preview_html,
    sync_visual_ssot_on_row,
)


def test_element_coverage_matrix_has_core_types():
    assert PPTIST_ELEMENT_HTML_COVERAGE["text"] == "full"
    assert PPTIST_ELEMENT_HTML_COVERAGE["line"] == "basic"
    assert PPTIST_ELEMENT_HTML_COVERAGE["shape"] == "basic"


def test_preview_html_includes_line_and_shape():
    slide = {
        "background": {"type": "solid", "color": "#fff"},
        "elements": [
            {
                "type": "line",
                "left": 10,
                "top": 20,
                "width": 100,
                "height": 0,
                "color": "#000",
            },
            {
                "type": "shape",
                "left": 50,
                "top": 50,
                "width": 80,
                "height": 40,
                "fill": "#4472c4",
            },
        ],
    }
    html = pptist_elements_to_preview_html(slide)
    assert "<svg" in html
    assert "background:#4472c4" in html or "background:#4472C4" in html.lower()


def test_sync_visual_preserves_html_content_by_default():
    rich = "<div class='outline'>rich outline html</div>"
    row = {
        "html_content": rich,
        "pptist_aligned_preview_html": rich,
        "elements_source": "user_edit",
        "elements": [{"type": "text", "content": "<p>x</p>", "left": 0, "top": 0, "width": 10, "height": 10}],
        "background": {"type": "solid", "color": "#ffffff"},
    }
    out = sync_visual_ssot_on_row(row, sync_html_content=False)
    assert out["html_content"] == rich
    assert out["pptist_aligned_preview_html"]
    assert out["pptist_aligned_preview_html"] != rich or "[chart]" in out["pptist_aligned_preview_html"] or "<p>x</p>" in out["pptist_aligned_preview_html"]


def test_editor_chrome_preview_uses_white_body_background():
    slide = {
        "background": {"type": "solid", "color": "#fff"},
        "elements": [{"type": "text", "content": "<p>t</p>", "left": 0, "top": 0, "width": 10, "height": 10}],
    }
    html = pptist_elements_to_preview_html(slide, preview_chrome="editor")
    norm = html.replace(" ", "").lower()
    assert "background:#ffffff" in norm or "background:#fff" in norm
    assert "background:#222" not in norm


def test_export_chrome_preview_uses_dark_body_background():
    slide = {
        "background": {"type": "solid", "color": "#fff"},
        "elements": [],
    }
    html = pptist_elements_to_preview_html(slide, preview_chrome="export")
    assert "background:#222" in html.replace(" ", "").lower()


def test_is_export_chrome_preview_html_detects_letterbox():
    dark = pptist_elements_to_preview_html(
        {"background": {"type": "solid", "color": "#fff"}, "elements": []},
        preview_chrome="export",
    )
    light = pptist_elements_to_preview_html(
        {"background": {"type": "solid", "color": "#fff"}, "elements": []},
        preview_chrome="editor",
    )
    assert is_export_chrome_preview_html(dark) is True
    assert is_export_chrome_preview_html(light) is False


def test_enrich_default_does_not_attach_resolved_preview_html():
    row = {
        "html_content": "<motion.div>rich</motion.div>",
        "elements": [{"type": "text", "content": "<p>x</p>", "left": 0, "top": 0, "width": 10, "height": 10}],
        "background": {"type": "solid", "color": "#ffffff"},
    }
    out = enrich_slide_row_for_editor_preview(row)
    assert "resolved_preview_html" not in out


def test_enrich_with_attach_uses_editor_chrome():
    row = {
        "elements": [{"type": "text", "content": "<p>x</p>", "left": 0, "top": 0, "width": 10, "height": 10}],
        "background": {"type": "solid", "color": "#ffffff"},
    }
    out = enrich_slide_row_for_editor_preview(row, attach_resolved_preview_html=True)
    assert "resolved_preview_html" in out
    assert not is_export_chrome_preview_html(out["resolved_preview_html"])
