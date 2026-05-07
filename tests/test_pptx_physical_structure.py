from __future__ import annotations


def test_extract_pptx_physical_structure_empty_bytes():
    from wisedeck.services.template.pptx_physical_structure import extract_pptx_physical_structure

    out = extract_pptx_physical_structure(b"")
    assert isinstance(out, dict)
    assert out.get("schema_version") == 1
    assert out.get("slides") == []
    assert out.get("error")


def test_build_mapping_rules_handles_missing_structure():
    from wisedeck.services.template.template_mapping_builder import (
        build_mapping_rules_from_physical_structure,
    )

    out = build_mapping_rules_from_physical_structure({"schema_version": 1, "error": "x"})
    assert isinstance(out, dict)
    assert out.get("schema_version") == 1
    assert out.get("error")

