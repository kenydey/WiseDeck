from wisedeck.services.export_infra.slides_html_hosting import build_hosted_slides_html_document


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

