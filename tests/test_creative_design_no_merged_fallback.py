"""Ensure multi-slide imports without per-slide visuals never feed merged html_template to the LLM context."""

import asyncio
from typing import Any, Dict

import pytest

from wisedeck.services.slide.creative_design_service import CreativeDesignService


class _DummyBackend:
    """Minimal EnhancedPPTService stand-in for CreativeDesignService delegation."""

    def _load_prompts_md_system_prompt(self) -> str:
        return "system"

    def _generate_fallback_slide_html(self, slide_data, page_number, total_pages):
        return "<div>fallback-layout</div>"

    async def _generate_html_with_retry(
        self,
        context: str,
        system_prompt: str,
        slide_data: Dict[str, Any],
        page_number: int,
        total_pages: int,
        max_retries: int = 5,
    ) -> str:
        return "<div>generated</div>"


def test_multideck_missing_arrays_uses_fallback_not_html_column(monkeypatch):
    captured: dict = {}
    svc = CreativeDesignService(_DummyBackend())  # type: ignore[arg-type]

    async def fake_build(
        self,
        slide_data,
        template_html,
        template_name,
        page_number,
        total_pages,
        confirmed_requirements,
        all_slides=None,
        project_id=None,
        template_record=None,
    ):
        captured["template_html"] = template_html
        return "CTX"

    monkeypatch.setattr(CreativeDesignService, "_build_creative_template_context", fake_build)

    template = {
        "html_template": "<html><body>MERGED_VERTICAL_DECK_MARKER</body></html>",
        "template_name": "X",
        "import_summary": {
            "slide_count": 5,
            "bundle_mode": "vertical_stack",
        },
    }

    async def go():
        return await svc._generate_slide_with_template(
            {"title": "t"},
            template,
            page_number=1,
            total_pages=5,
            confirmed_requirements={},
        )

    out = asyncio.run(go())
    assert "MERGED_VERTICAL_DECK_MARKER" not in captured.get("template_html", "")
    assert "fallback-layout" in captured.get("template_html", "")
    assert "generated" in out


def test_svg_slides_clamp_when_page_beyond_length(monkeypatch):
    captured: dict = {}
    svc = CreativeDesignService(_DummyBackend())  # type: ignore[arg-type]

    async def fake_build(
        self,
        slide_data,
        template_html,
        template_name,
        page_number,
        total_pages,
        confirmed_requirements,
        all_slides=None,
        project_id=None,
        template_record=None,
    ):
        captured["template_html"] = template_html
        return "CTX"

    monkeypatch.setattr(CreativeDesignService, "_build_creative_template_context", fake_build)

    slide0 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect fill="red" width="10" height="10"/></svg>"""
    slide1 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect fill="blue" width="10" height="10"/></svg>"""
    template = {
        "html_template": "<html>merged</html>",
        "template_name": "Y",
        "import_summary": {"svg_slide_xmls": [slide0, slide1]},
    }

    async def go():
        return await svc._generate_slide_with_template(
            {"title": "t"},
            template,
            page_number=9,
            total_pages=9,
            confirmed_requirements={},
        )

    asyncio.run(go())
    assert "blue" in captured["template_html"]
