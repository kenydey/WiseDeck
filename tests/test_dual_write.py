"""Dual-write presentation assembly for structured export."""

from wisedeck.services.structured_export.dual_write import (
    try_assemble_presentation_from_dual_write,
    upsert_presenton_snapshots_on_slides_data,
)


def test_try_assemble_returns_none_when_slides_data_short():
    outline = [{"title": "a"}, {"title": "b"}]
    sd = [{"presenton_slide": {"layout": "swift:x", "content": {}}}]
    assert try_assemble_presentation_from_dual_write(
        outline_slides=outline,
        slides_data=sd,
        title="T",
        language="zh",
    ) is None


def test_try_assemble_returns_none_when_presenton_slide_incomplete():
    outline = [{"title": "a"}]
    sd = [{"presenton_slide": {"layout": "invalid-no-colon"}}]
    assert try_assemble_presentation_from_dual_write(
        outline_slides=outline,
        slides_data=sd,
        title="T",
        language="zh",
    ) is None


def test_try_assemble_success_minimal_swift_slide():
    outline = [{"title": "a"}]
    sd = [
        {
            "presenton_slide": {
                "layout_group": "swift",
                "layout": "swift:simple-bullet-points-layout",
                "content": {
                    "title": "Hi",
                    "statement": "stmt",
                    "points": [{"title": "p", "body": "b"}],
                    "website": "w",
                },
                "properties": {},
                "id": "id1",
            }
        }
    ]
    p = try_assemble_presentation_from_dual_write(
        outline_slides=outline,
        slides_data=sd,
        title="Deck",
        language="zh",
    )
    assert p is not None
    assert p["n_slides"] == 1
    assert p["slides"][0]["index"] == 0


def test_upsert_preserves_html_content():
    slides_in = [{"html_content": "<div>x</div>", "title": "t"}]
    pres_slides = [
        {
            "layout_group": "swift",
            "layout": "swift:simple-bullet-points-layout",
            "content": {"title": "H"},
            "properties": {},
            "id": "u",
        }
    ]
    out = upsert_presenton_snapshots_on_slides_data(slides_in, 1, pres_slides)
    assert len(out) == 1
    assert "<div>x</div>" in out[0]["html_content"]
    assert out[0]["presenton_slide"]["layout"] == "swift:simple-bullet-points-layout"
