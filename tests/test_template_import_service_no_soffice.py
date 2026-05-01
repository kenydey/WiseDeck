import pytest

from wisedeck.services.template import template_import_service as tis


def test_import_raises_when_soffice_missing(monkeypatch, tmp_path):
    monkeypatch.delenv("WISEDECK_SOFFICE_PATH", raising=False)
    monkeypatch.setattr(tis.shutil, "which", lambda _cmd: None)

    svc = tis.TemplateImportService(cache_root=tmp_path / "cache")

    pptx_bytes = b"dummy"
    import base64

    data_b64 = base64.b64encode(pptx_bytes).decode("ascii")

    with pytest.raises(FileNotFoundError) as exc:
        svc.import_from_upload(filename="x.pptx", data=data_b64)

    assert "LibreOffice" in str(exc.value) or "soffice" in str(exc.value)
