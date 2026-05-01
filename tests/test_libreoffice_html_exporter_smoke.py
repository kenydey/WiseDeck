"""Smoke tests for LibreOffice HTML merge helper (no soffice)."""

from pathlib import Path

from bs4 import BeautifulSoup

from wisedeck.services.template.libreoffice_html_exporter import (
    merge_and_wrap_impress_html,
)


def test_merge_and_wrap_impress_html_structure():
    html = merge_and_wrap_impress_html(['<div class="x">s1</div>', '<p>s2</p>'], "MyDeck")
    assert "<!doctype html>" in html.lower()
    assert "</html>" in html.lower()
    assert "MyDeck" in html
    assert "wd-lo-slide" in html
    soup = BeautifulSoup(html, "html.parser")
    assert soup.find_all("section", class_="wd-lo-slide")


def test_inline_small_png(tmp_path: Path):
    from wisedeck.services.template.libreoffice_html_exporter import _inline_assets_fragment

    # 1x1 PNG
    png_b64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    )
    import base64

    img_bytes = base64.standard_b64decode(png_b64)
    (tmp_path / "pix.png").write_bytes(img_bytes)
    fragment = '<div><img src="pix.png"/></div>'
    warnings: list[str] = []
    out = _inline_assets_fragment(fragment, tmp_path, warnings)
    assert "data:image/png;base64," in out
