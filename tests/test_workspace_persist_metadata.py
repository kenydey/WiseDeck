"""build_workspace_persist_metadata merges manifest + SVG workspace."""

from __future__ import annotations

import json
from pathlib import Path

from wisedeck.services.template.global_master_template_service import GlobalMasterTemplateService


def test_build_workspace_persist_metadata_with_svgs(tmp_path: Path, monkeypatch) -> None:
    wid = "ws-test-1"
    root = tmp_path / "template_import" / wid
    root.mkdir(parents=True)
    svg_dir = root / "svg"
    svg_dir.mkdir()
    (svg_dir / "slide_01.svg").write_text(
        '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><text>{{PAGE_TITLE}}</text></svg>',
        encoding="utf-8",
    )
    manifest = {
        "workspace_id": wid,
        "source_filename": "deck.pptx",
        "slide_assets": {"page_count": 1},
        "pptx_layout": {"schema_version": 1, "slides": []},
        "pptx_readable": {"schema_version": 1},
        "layout_package": {},
        "paths": {
            "svg_dir": str(svg_dir.resolve()),
        },
    }
    (root / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")

    monkeypatch.setenv("WISEDECK_TEMPLATE_IMPORT_CACHE", str(tmp_path / "template_import"))

    svc = GlobalMasterTemplateService()
    meta = svc.build_workspace_persist_metadata(wid)
    assert meta.get("svg_template")
    imp = meta["import_summary"]
    assert imp.get("template_contract") is not None
    assert imp.get("native_export_mode") == "per_slide"
    xs = imp.get("svg_slide_xmls")
    assert isinstance(xs, list) and len(xs) == 1
    markers = set(imp.get("placeholder_markers") or [])
    assert "PAGE_TITLE" in markers
