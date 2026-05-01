"""Tests for slide SVG vertical_stack bundling (no LibreOffice required)."""

from pathlib import Path

import pytest

from wisedeck.services.template.slide_svg_bundler import (
    bundle_slide_svgs,
    bundle_workspace_svgs,
)


SVG_A = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40">
  <rect width="100" height="40" fill="#ff0000"/>
</svg>
"""

SVG_B = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40">
  <rect width="100" height="40" fill="#0000ff"/>
</svg>
"""


def test_bundle_vertical_stack(tmp_path: Path):
    d = tmp_path
    (d / "slide_01.svg").write_text(SVG_A, encoding="utf-8")
    (d / "slide_02.svg").write_text(SVG_B, encoding="utf-8")
    paths = sorted(d.glob("slide_*.svg"))
    svg_t, html_t = bundle_slide_svgs(paths, "vertical_stack")
    assert "#ff0000" in svg_t and "#0000ff" in svg_t
    assert 'xmlns="http://www.w3.org/2000/svg"' in svg_t
    assert "<!doctype html>" in html_t.lower()
    assert "</html>" in html_t.lower()
    assert "overflow-y:auto" in html_t.replace(" ", "")


def test_bundle_first_slide_only(tmp_path: Path):
    d = tmp_path
    (d / "slide_01.svg").write_text(SVG_A, encoding="utf-8")
    (d / "slide_02.svg").write_text(SVG_B, encoding="utf-8")
    paths = sorted(d.glob("slide_*.svg"))
    svg_t, _html = bundle_slide_svgs(paths, "first_slide_only")
    assert "#ff0000" in svg_t
    assert "#0000ff" not in svg_t


def test_bundle_workspace_warns_many_slides(tmp_path: Path, monkeypatch):
    import wisedeck.services.template.slide_svg_bundler as ssb

    monkeypatch.setattr(ssb, "_SOFT_WARN_SLIDE_COUNT", 2)

    d = tmp_path
    (d / "slide_01.svg").write_text(SVG_A, encoding="utf-8")
    (d / "slide_02.svg").write_text(SVG_B, encoding="utf-8")
    _svg, _html, warnings = ssb.bundle_workspace_svgs(d, "vertical_stack")
    assert any("幻灯片数量较多" in w for w in warnings)


def test_bundle_workspace_empty_raises(tmp_path: Path):
    with pytest.raises(ValueError, match="slide"):
        bundle_workspace_svgs(tmp_path, "vertical_stack")
