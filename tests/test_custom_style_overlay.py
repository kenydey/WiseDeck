import json
from pathlib import Path

from wisedeck.services import design_spec_merge_service as dsm


def test_load_custom_style_overlay_from_template_style_config_reads_static(tmp_path: Path, monkeypatch) -> None:
    static_root = tmp_path / "static"
    (static_root / "assets" / "templates" / "style123").mkdir(parents=True)
    p = static_root / "assets" / "templates" / "style123" / "custom_style.json"
    p.write_text(
        json.dumps(
            {
                "themeName": "User_Uploaded_Style",
                "tokens": {"paletteTop5": ["#111111", "#222222"], "fontPair": {"title": "A", "body": "B"}},
                "components": {"decoration": {"type": "bar"}},
            },
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    monkeypatch.setattr(dsm, "_static_root_dir", lambda: static_root.resolve())

    overlay = dsm.load_custom_style_overlay_from_template_style_config(
        {"custom_style_url": "/static/assets/templates/style123/custom_style.json"}
    )

    assert overlay["custom_style_url"] == "/static/assets/templates/style123/custom_style.json"
    assert overlay["palette"] == ["#111111", "#222222"]
    assert overlay["typography"]["title"] == "A"
    assert overlay["typography"]["body"] == "B"
    assert isinstance(overlay["custom_style"], dict)
    assert overlay["custom_style"]["themeName"] == "User_Uploaded_Style"
    assert overlay["components"] == {"decoration": {"type": "bar"}}


def test_load_custom_style_overlay_rejects_non_static_urls(tmp_path: Path, monkeypatch) -> None:
    monkeypatch.setattr(dsm, "_static_root_dir", lambda: (tmp_path / "static").resolve())
    overlay = dsm.load_custom_style_overlay_from_template_style_config(
        {"custom_style_url": "file:///C:/Windows/system.ini"}
    )
    assert overlay == {}

