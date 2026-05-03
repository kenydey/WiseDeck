from wisedeck.services.export_catalog import FIDELITY_RANKING, export_modes_catalog


def test_export_catalog_schema_and_modes():
    data = export_modes_catalog()
    assert data["schema_version"] == 1
    assert "fidelity_ranking" in data
    assert isinstance(data["modes"], list)
    assert any(m["id"] == "client_dom_merge_charts" for m in data["modes"])
    mat = data.get("editability_matrix")
    assert isinstance(mat, list)
    assert any(row.get("mode_id") == "pptx_images_raster" for row in mat)
    mode_ids = {m["id"] for m in data["modes"]}
    matrix_ids = {row.get("mode_id") for row in mat}
    assert set(FIDELITY_RANKING).issubset(mode_ids), (
        "fidelity_ranking 中的每项须在 modes 中有对应 id，便于客户端解析"
    )
    assert matrix_ids == mode_ids
