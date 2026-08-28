"""Phase A regression: full-editor save must not replace rich html_content (automated)."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import asyncio

from wisedeck.web.route_modules import slide_routes


def test_full_editor_save_regression_rich_html_preserved():
    """Simulates PPTist PUT without html_content after outline generation."""
    rich = "<div class='wds-slide-root'>" + ("<p>bullet</p>" * 30) + "</div>"
    existing = {
        "page_number": 1,
        "id": "s1",
        "html_content": rich,
        "pptist_aligned_preview_html": rich,
        "elements_source": "slide_document",
    }
    incoming = {
        "id": "s1",
        "elements": [
            {
                "id": "e1",
                "type": "text",
                "content": "<p>edited</p>",
                "left": 0,
                "top": 0,
                "width": 200,
                "height": 40,
            }
        ],
        "background": {"type": "solid", "color": "#ffffff"},
    }

    mock_request = MagicMock()
    mock_request.json = AsyncMock(return_value={"slides": [incoming], "sync_visual_from_elements": False})

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
        patch("wisedeck.services.db_project_manager.DatabaseProjectManager", return_value=mock_db),
    ):
        get_proj.return_value = mock_project
        result = asyncio.run(slide_routes.save_all_slides("p1", mock_request, mock_user))

    assert result["success"] is True
    row = mock_db.save_project_slides.await_args[0][2][0]
    assert row["html_content"] == rich
    assert row["pptist_aligned_preview_html"] == rich
    assert row["elements"][0]["content"] == "<p>edited</p>"
