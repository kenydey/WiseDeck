from wisedeck.services.layout_package.manifest import (
    LayoutPackageManifest,
    enrich_template_manifest_with_layout_package,
    layout_package_manifest_json_schema,
    parse_layout_package_manifest,
)


def test_json_schema_contains_layout_id():
    schema = layout_package_manifest_json_schema()
    assert schema["type"] == "object"
    assert "layout_id" in schema.get("properties", {})


def test_enrich_manifest_inserts_package():
    base = {"workspace_id": "ws1", "slide_assets": {"page_count": 3}}
    out = enrich_template_manifest_with_layout_package(
        base, workspace_id="ws1", slide_count=3, source="template_import"
    )
    lp = out["layout_package"]
    assert lp["schema_version"] == 1
    assert lp["layout_id"] == "import:ws1"
    assert lp["provenance"]["slide_count"] == 3


def test_parse_invalid_layout_package():
    m, err = parse_layout_package_manifest({"schema_version": 2})
    assert m is None
    assert err is not None


def test_roundtrip_valid_manifest():
    raw = LayoutPackageManifest(
        layout_id="g:test",
        sample_data={"title": "x"},
        data_schema={"type": "object"},
    ).model_dump(mode="json")
    m, err = parse_layout_package_manifest(raw)
    assert err is None
    assert m is not None
    assert m.layout_id == "g:test"
