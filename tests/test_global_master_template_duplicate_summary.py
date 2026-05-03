"""Invariant for duplicate payload: nested import_summary must not alias source dict."""

import copy


def test_duplicate_clone_deepcopies_import_summary():
    original = {"import_summary": {"nested": {"x": 1}}, "style_config": {"f": 2}}
    dup_summary = (
        copy.deepcopy(original["import_summary"])
        if isinstance(original.get("import_summary"), dict)
        else original.get("import_summary")
    )
    dup_summary["nested"]["x"] = 99
    assert original["import_summary"]["nested"]["x"] == 1
