"""projects.slides_data vector overlay onto slide_data-row payloads (GET project / slides-data)."""

from __future__ import annotations

from wisedeck.database.service import DatabaseService


def test_overlay_merges_elements_and_keeps_row_html():
    rows = [
        {
            "slide_id": "s0",
            "title": "A",
            "html_content": "<div>from_row</div>",
            "page_number": 1,
        }
    ]
    blob = [
        {
            "html_content": "<div>stale_json</div>",
            "elements": [{"id": "1", "type": "text"}],
            "elements_source": "pptx_bridge",
            "pptist_aligned_preview_html": "<p>x</p>",
        }
    ]
    out = DatabaseService._overlay_slide_data_rows_with_project_slides_json(rows, blob)
    assert len(out) == 1
    assert out[0]["html_content"] == "<div>from_row</div>"
    assert out[0]["title"] == "A"
    assert out[0]["elements_source"] == "pptx_bridge"
    assert isinstance(out[0]["elements"], list) and len(out[0]["elements"]) == 1
    assert "<p>x</p>" in (out[0].get("pptist_aligned_preview_html") or "")


def test_overlay_coerces_non_list_elements():
    rows = [{"html_content": "h", "page_number": 1}]
    blob = [{"elements": None}]
    out = DatabaseService._overlay_slide_data_rows_with_project_slides_json(rows, blob)
    assert out[0]["elements"] == []


def test_overlay_short_blob_does_not_extend():
    rows = [{"html_content": "a"}, {"html_content": "b"}]
    blob = [{"elements": []}]
    out = DatabaseService._overlay_slide_data_rows_with_project_slides_json(rows, blob)
    assert "elements" not in out[1]


def test_overlay_matches_by_page_number_when_row_order_gap():
    """slide_data rows for page 1 and 3 must not pick blob for page 2 by array index."""
    rows = [
        {"page_number": 1, "html_content": "<div>a</div>", "slide_id": "s-a"},
        {"page_number": 3, "html_content": "<div>c</div>", "slide_id": "s-c"},
    ]
    blobs = [
        {"page_number": 1, "elements": [{"type": "text", "id": "p1"}]},
        {"page_number": 2, "elements": [{"type": "text", "id": "p2-should-not-appear"}]},
        {"page_number": 3, "elements": [{"type": "text", "id": "p3"}]},
    ]
    out = DatabaseService._overlay_slide_data_rows_with_project_slides_json(rows, blobs)
    assert len(out) == 2
    assert out[0]["elements"][0]["id"] == "p1"
    assert out[1]["elements"][0]["id"] == "p3"
    assert all("p2-should-not-appear" not in (el.get("id") or "") for el in out[1]["elements"])


def test_overlay_slide_id_overrides_position():
    rows = [
        {"page_number": 99, "slide_id": "stable-1", "html_content": "x"},
    ]
    blobs = [
        {"page_number": 1, "slide_id": "other", "elements": [{"id": "wrong-pos"}]},
        {"page_number": 2, "slide_id": "stable-1", "elements": [{"id": "by-sid"}]},
    ]
    out = DatabaseService._overlay_slide_data_rows_with_project_slides_json(rows, blobs)
    assert out[0]["elements"][0]["id"] == "by-sid"
