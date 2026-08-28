from wisedeck.services.export_infra.slides_html_hosting import (
    build_hosted_slides_html_document,
    effective_slide_preview_html,
)


def test_build_hosted_slides_html_document_includes_contract_meta_and_pages():
    html = build_hosted_slides_html_document(
        slides_data=[
            {"html_content": "<div>Hello</div>", "title": "T1"},
            {"html_content": "<div>World</div>", "title": "T2"},
        ],
        base_url="http://127.0.0.1:8000",
        contract_version="2026.04",
    )
    assert 'name="wisedeck-slide-contract-version"' in html
    assert 'content="2026.04"' in html
    assert 'data-page="1"' in html
    assert 'data-page="2"' in html


def test_effective_slide_preview_html_prefers_aligned_snapshot():
    raw = effective_slide_preview_html(
        {
            "html_content": "<div>raw</div>",
            "pptist_aligned_preview_html": "<p>aligned</p>",
        }
    )
    assert raw == "<p>aligned</p>"


def test_effective_slide_preview_html_whitespace_aligned_falls_back():
    raw = effective_slide_preview_html(
        {
            "html_content": "<div>raw</div>",
            "pptist_aligned_preview_html": "  \n\t ",
        }
    )
    assert raw == "<div>raw</div>"


def test_build_hosted_after_effective_preview_matches_main_strict_pixel():
    """Simulates internal_preview_slides_html row prep (without URL rewriting)."""
    row = {
        "title": "T",
        "html_content": "<span>RAW</span>",
        "pptist_aligned_preview_html": "<span>ALIGNED</span>",
    }
    prepared = dict(row)
    prepared["html_content"] = effective_slide_preview_html(prepared)
    html = build_hosted_slides_html_document(
        slides_data=[prepared],
        base_url="http://127.0.0.1:8000",
        contract_version="2026.04",
    )
    assert "ALIGNED" in html
    assert "RAW" not in html


def test_build_hosted_slides_html_document_page_filter():
    html = build_hosted_slides_html_document(
        slides_data=[
            {"html_content": "<div>A</div>", "title": "T1"},
            {"html_content": "<div>B</div>", "title": "T2"},
        ],
        base_url="http://127.0.0.1:8000",
        contract_version="2026.04",
        page=2,
    )
    assert 'data-page="1"' not in html
    assert 'data-page="2"' in html

