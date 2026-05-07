"""Single-record office import: slide count alignment warnings."""

from wisedeck.services.template.office_import_alignment import (
    collect_office_import_alignment_warnings,
    merge_warnings_unique,
)


def test_collect_warnings_empty_when_declared_zero():
    assert (
        collect_office_import_alignment_warnings(
            declared_slide_count=0,
            template_contract={"per_slide_layout_signatures": [{"index": 1}]},
        )
        == []
    )


def test_collect_warnings_clean_when_counts_align():
    tc = {
        "slide_count": 2,
        "per_slide_layout_signatures": [{"index": 1}, {"index": 2}],
        "pptx_readable": {"slides": [{"x": 1}, {"x": 2}]},
        "pptx_layout": {"slides": [{"index": 1}, {"index": 2}]},
    }
    assert (
        collect_office_import_alignment_warnings(
            declared_slide_count=2,
            template_contract=tc,
            html_slide_fragments=["a", "b"],
            svg_slide_xmls=["<svg/>", "<svg/>"],
        )
        == []
    )


def test_collect_warnings_on_pptx_readable_mismatch():
    tc = {
        "per_slide_layout_signatures": [{"index": 1}, {"index": 2}],
        "pptx_readable": {"slides": [{"x": 1}]},
    }
    w = collect_office_import_alignment_warnings(
        declared_slide_count=2,
        template_contract=tc,
    )
    assert len(w) == 1
    assert "pptx_readable.slides" in w[0]


def test_collect_warnings_on_svg_slides_mismatch():
    w = collect_office_import_alignment_warnings(
        declared_slide_count=3,
        template_contract=None,
        svg_slide_xmls=["<svg/>", "<svg/>"],
    )
    assert len(w) == 1
    assert "svg_slide_xmls" in w[0]


def test_merge_warnings_unique():
    base = ["a"]
    merge_warnings_unique(base, ["a", "b"])
    assert base == ["a", "b"]
