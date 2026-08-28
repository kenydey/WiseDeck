"""WiseDeck AIPPT v1 → PPTist emitter / assemble priority."""

from __future__ import annotations

import asyncio
import json

from wisedeck.services.slide.render.aippt_emitter import emit_pptist_from_wds_aippt, load_template_pack_strict
from wisedeck.services.slide.schema.wds_aippt_v1 import ContentChartItem, parse_wds_aippt_slide
from wisedeck.services.slide.slide_document_builder import assemble_generated_slide_outputs
from wisedeck.services.slide.slide_generation_service import (
    _extract_html_and_optional_wds_aippt,
    extract_wds_aippt_json_only,
)
from wisedeck.services.slide.wds_aippt_outline_skeleton import outline_slide_to_aippt_skeleton


def test_extract_html_and_wds_aippt_from_llm_fence():
    raw = """<html><body><p>X</p></body></html>
```wds_aippt_v1
{"type": "cover", "data": {"title": "FromFence", "text": "Sub"}}
```
"""
    html, payload = _extract_html_and_optional_wds_aippt(raw)
    assert "<p>X</p>" in html
    assert "```" not in html
    assert payload is not None
    assert payload.get("type") == "cover"
    slide = {"title": "HTML Title", "content_points": [], "wds_aippt_v1": payload}
    doc, ppt, _preview = asyncio.run(assemble_generated_slide_outputs(slide, html, 1, 1))
    assert doc.schema_version >= 1
    assert ppt.get("elements_source") == "aippt_template"


def test_template_pack_smoke_loads():
    pack = load_template_pack_strict("template_pack_smoke")
    assert pack.get("id") == "template_pack_smoke"
    assert isinstance(pack.get("slides"), list) and len(pack["slides"]) >= 3


def test_emit_cover_from_aippt():
    m = parse_wds_aippt_slide({"type": "cover", "data": {"title": "Hello", "text": "Sub"}})
    ppt = emit_pptist_from_wds_aippt(m)
    blob = json.dumps(ppt["elements"], ensure_ascii=False)
    assert "Hello" in blob
    assert ppt.get("background")


def test_emit_content_chart_updates_chart_element():
    m = parse_wds_aippt_slide(
        {
            "type": "content",
            "data": {
                "title": "Sales",
                "items": [
                    {"kind": "chart", "chartType": "bar", "labels": ["A", "B"], "series": [{"label": "x", "data": [1, 2]}]},
                    {"title": "Note", "text": "Growth"},
                ],
            },
        }
    )
    assert isinstance(m.data.items[0], ContentChartItem)
    ppt = emit_pptist_from_wds_aippt(m)
    charts = [e for e in ppt["elements"] if e.get("type") == "chart"]
    assert len(charts) == 1
    assert charts[0]["data"]["labels"] == ["A", "B"]


def test_outline_skeleton_cover_when_no_type():
    sk = outline_slide_to_aippt_skeleton({}, 0, 5)
    assert sk["type"] == "cover"
    assert "title" in sk["data"]


def test_outline_skeleton_slide_type_toc_alias():
    sk = outline_slide_to_aippt_skeleton({"slide_type": "toc", "title": "议程"}, 2, 6)
    assert sk["type"] == "contents"
    assert sk["data"]["items"]


def test_extract_wds_aippt_json_only_plain_object():
    raw = '{"type": "cover", "data": {"title": "Plain", "text": ""}}'
    p = extract_wds_aippt_json_only(raw)
    assert p is not None
    assert p.get("type") == "cover"


def test_assemble_prefers_wds_aippt_payload():
    slide = {
        "title": "HTML Title",
        "wds_aippt_v1": {"type": "cover", "data": {"title": "From AIPPT", "text": "x"}},
        "content_points": [],
    }
    html = "<html><body><h1>HTML Title</h1></body></html>"
    doc, ppt, preview = asyncio.run(assemble_generated_slide_outputs(slide, html, 1, 1))
    assert doc.schema_version >= 1
    assert ppt.get("elements_source") == "aippt_template"
    blob = json.dumps(ppt["elements"], ensure_ascii=False)
    assert "From AIPPT" in blob
    assert "wds-slide-root" in preview
