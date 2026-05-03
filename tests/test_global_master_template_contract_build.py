from wisedeck.services.template.template_contract_build import (
    build_template_contract_from_manifest,
    slim_python_pptx_manifest,
)


def test_build_template_contract_from_manifest_carries_manifest_slices():
    manifest = {
        "pptx_readable": {"slides": []},
        "pptx_readable_summary": {"markers": ["x"]},
        "layout_package": {"layouts": []},
        "pptx_layout": {"slides": []},
        "python_pptx": {"slide_count": 3, "slide_layouts": ["a"]},
    }
    c = build_template_contract_from_manifest(
        manifest, slide_count=2, source_filename="deck.pptx"
    )
    assert c["slide_count"] == 2
    assert c["source_filename"] == "deck.pptx"
    assert c["pptx_readable"] is manifest["pptx_readable"]
    assert c["pptx_readable_summary"] is manifest["pptx_readable_summary"]
    assert c["layout_package"] is manifest["layout_package"]
    assert c["pptx_layout"] is manifest["pptx_layout"]
    assert c["python_pptx_meta"]["slide_count"] == 3


def test_slim_python_pptx_manifest_truncates_error():
    long_err = "e" * 500
    slim = slim_python_pptx_manifest({"error": long_err})
    assert slim == {"error": long_err[:400]}


def test_slim_python_pptx_manifest_non_dict_returns_none():
    assert slim_python_pptx_manifest(None) is None
    assert slim_python_pptx_manifest([]) is None
