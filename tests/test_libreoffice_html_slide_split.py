"""LibreOffice merged HTML slide fragment split / wrap."""

from __future__ import annotations

from wisedeck.services.template.libreoffice_html_exporter import (
    merge_and_wrap_impress_html,
    split_lo_merged_html_slide_fragments,
    wrap_lo_slide_fragment_html,
)


def test_split_lo_roundtrip_two_slides():
    merged = merge_and_wrap_impress_html(["<p>a</p>", "<div>b</div>"], "T")
    fr = split_lo_merged_html_slide_fragments(merged)
    assert len(fr) == 2
    assert "a" in fr[0] and "b" in fr[1]


def test_wrap_lo_slide_fragment_contains_inner():
    html = wrap_lo_slide_fragment_html('<span id="x">hi</span>', "S1")
    assert "<span id=" in html or "<span id=\"" in html
    assert "hi" in html
