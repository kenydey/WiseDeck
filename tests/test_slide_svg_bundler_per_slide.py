"""Per-slide bundle mode for template import (first slide as main, all pages in slide_xmls)."""

from pathlib import Path

from wisedeck.services.template.slide_svg_bundler import bundle_workspace_svgs

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


def test_bundle_workspace_per_slide_first_only_main(tmp_path: Path) -> None:
    d = tmp_path
    (d / "slide_01.svg").write_text(SVG_A, encoding="utf-8")
    (d / "slide_02.svg").write_text(SVG_B, encoding="utf-8")
    svg_main, html_main, _warnings, slide_xmls, merged = bundle_workspace_svgs(d, "per_slide")
    assert merged is None
    assert len(slide_xmls) == 2
    assert "#ff0000" in svg_main
    assert "#0000ff" not in svg_main
    assert svg_main.strip() == slide_xmls[0].strip()
    assert "<!doctype html>" in html_main.lower()
    assert "#ff0000" in html_main


def test_bundle_workspace_vertical_stack_exposes_merged(tmp_path: Path) -> None:
    d = tmp_path
    (d / "slide_01.svg").write_text(SVG_A, encoding="utf-8")
    (d / "slide_02.svg").write_text(SVG_B, encoding="utf-8")
    svg_main, _html, _w, slide_xmls, merged = bundle_workspace_svgs(d, "vertical_stack")
    assert len(slide_xmls) == 2
    assert merged is not None
    assert "#0000ff" in merged
    assert "#0000ff" not in svg_main
