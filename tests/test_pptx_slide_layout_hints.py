from wisedeck.services.template.pptx_slide_layout_hints import extract_pptx_layout_hints


def test_extract_empty_bytes():
    r = extract_pptx_layout_hints(b"")
    assert r.get("error") or r.get("slides") == []
