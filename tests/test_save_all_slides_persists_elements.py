"""PUT /api/projects/{id}/slides persists vector fields via save_project_slides."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import asyncio


def test_save_all_slides_calls_save_project_slides_with_elements():
    from wisedeck.web.route_modules import slide_routes

    pptist_slide = {
        "id": "slide-1",
        "title": "T1",
        "elements": [{"id": "el1", "type": "text", "content": "<p>hi</p>", "left": 0, "top": 0, "width": 100, "height": 40}],
        "background": {"type": "solid", "color": "#ffffff"},
    }

    mock_request = MagicMock()
    mock_request.json = AsyncMock(return_value={"slides": [pptist_slide]})

    mock_project = MagicMock()
    mock_project.slides_data = [{"page_number": 1}]
    mock_project.slides_html = ""

    mock_user = MagicMock()
    mock_user.id = 1

    mock_db = MagicMock()
    mock_db.save_project_slides = AsyncMock(return_value=True)
    mock_db.cleanup_excess_slides = AsyncMock(return_value=0)

    with (
        patch.object(slide_routes.ppt_service.project_manager, "get_project", new_callable=AsyncMock) as get_proj,
        patch(
            "wisedeck.services.db_project_manager.DatabaseProjectManager",
            return_value=mock_db,
        ),
    ):
        get_proj.return_value = mock_project
        result = asyncio.run(slide_routes.save_all_slides("proj-1", mock_request, mock_user))

    assert result["success"] is True
    assert result["saved_count"] == 1
    mock_db.save_project_slides.assert_awaited_once()
    _pid, _html, saved_rows = mock_db.save_project_slides.await_args[0]
    assert _pid == "proj-1"
    assert len(saved_rows) == 1
    row = saved_rows[0]
    assert row["elements_source"] == "user_edit"
    assert isinstance(row["elements"], list) and len(row["elements"]) == 1
    assert isinstance(row.get("pptist_aligned_preview_html"), str)
    assert row["pptist_aligned_preview_html"]


def test_save_all_slides_preserves_visual_ssot_when_pptist_has_no_html():
    from wisedeck.web.route_modules import slide_routes

    rich_html = "<motion-div class='wds-slide-root'>" + ("<p>outline</p>" * 40) + "</motion-div>"
    existing = {
        "page_number": 1,
        "id": "slide-1",
        "html_content": rich_html,
        "pptist_aligned_preview_html": rich_html,
        "elements_source": "slide_document",
    }
    pptist_slide = {
        "id": "slide-1",
        "title": "T1",
        "elements": [
            {
                "id": "el1",
                "type": "text",
                "content": "<p>edited in full editor</p>",
                "left": 0,
                "top": 0,
                "width": 100,
                "height": 40,
            }
        ],
        "background": {"type": "solid", "color": "#ffffff"},
    }

    mock_request = MagicMock()
    mock_request.json = AsyncMock(return_value={"slides": [pptist_slide]})

    mock_project = MagicMock()
    mock_project.slides_data = [existing]
    mock_project.slides_html = ""

    mock_user = MagicMock()
    mock_user.id = 1

    mock_db = MagicMock()
    mock_db.save_project_slides = AsyncMock(return_value=True)
    mock_db.cleanup_excess_slides = AsyncMock(return_value=0)

    with (
        patch.object(slide_routes.ppt_service.project_manager, "get_project", new_callable=AsyncMock) as get_proj,
        patch(
            "wisedeck.services.db_project_manager.DatabaseProjectManager",
            return_value=mock_db,
        ),
    ):
        get_proj.return_value = mock_project
        result = asyncio.run(slide_routes.save_all_slides("proj-1", mock_request, mock_user))

    assert result["success"] is True
    row = mock_db.save_project_slides.await_args[0][2][0]
    assert row["html_content"] == rich_html
    assert row["pptist_aligned_preview_html"] == rich_html
    assert row["elements"][0]["content"] == "<p>edited in full editor</p>"
    assert row["elements_source"] == "user_edit"
