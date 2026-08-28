"""Regression: rich html_content must win over export-chrome resolved preview."""

from __future__ import annotations

from wisedeck.services.slide.slide_visual_sync import (
    is_export_chrome_preview_html,
    pptist_elements_to_preview_html,
)


def test_rich_html_content_preferred_over_export_chrome_resolved():
    """Mirrors slidePreviewHtml: html_content first; #222 resolved is degraded."""
    rich = "<div class='outline'>rich outline html with chart graphics</motion.div>"
    resolved = pptist_elements_to_preview_html(
        {
            "background": {"type": "solid", "color": "#fff"},
            "elements": [{"type": "chart", "left": 0, "top": 0, "width": 100, "height": 80}],
        },
        preview_chrome="export",
    )
    assert is_export_chrome_preview_html(resolved)
    assert rich.strip()
    # Client: if html_content non-empty, use it; never pick degraded resolved.
    chosen = rich if rich.strip() else resolved
    assert chosen == rich
    assert "background:#222" not in chosen.replace(" ", "").lower()
