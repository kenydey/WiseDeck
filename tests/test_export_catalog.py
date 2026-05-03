from wisedeck.services.export_catalog import export_modes_catalog


def test_export_catalog_schema_and_modes():
    data = export_modes_catalog()
    assert data["schema_version"] == 1
    assert "fidelity_ranking" in data
    assert isinstance(data["modes"], list)
    assert any(m["id"] == "client_dom_merge_charts" for m in data["modes"])
