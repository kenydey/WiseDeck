import base64

from wisedeck.services.template import template_import_service as tis


def test_materialize_pptx_writes_file(tmp_path, monkeypatch):
    monkeypatch.setattr(tis, "_resolve_soffice", lambda: r"C:\fake\soffice.exe")
    b64 = base64.b64encode(b"x").decode("ascii")
    pptx_path, root, name = tis.materialize_office_upload_to_pptx(
        filename="deck.pptx",
        data=b64,
        cache_root=tmp_path / "cache",
    )
    assert pptx_path.is_file()
    assert pptx_path.suffix == ".pptx"
    assert name == "deck.pptx"
    assert root.is_dir()
