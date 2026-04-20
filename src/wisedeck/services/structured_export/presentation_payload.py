"""Build render-service PresentationData JSON from StructuredSlideDeckModel."""

from __future__ import annotations

import uuid
from typing import Any, Dict, List

from wisedeck.services.structured_export.chart_mapper import _normalize_chart_type
from wisedeck.services.structured_export.schemas import StructuredSlideDeckModel


def _recharts_chart_type(normalized: str) -> str:
    if normalized == "horizontalbar":
        return "horizontalBar"
    if normalized == "bar":
        return "bar"
    if normalized == "line":
        return "line"
    if normalized == "pie":
        return "pie"
    if normalized == "donut":
        return "donut"
    if normalized == "area":
        return "area"
    return "bar"


def deck_to_presenton_presentation_json(deck: StructuredSlideDeckModel) -> Dict[str, Any]:
    slides_payload: List[Dict[str, Any]] = []
    for idx, s in enumerate(deck.slides):
        if s.chart_config is not None:
            chart = s.chart_config
            data = chart.data
            categories = list(data.labels) if data else []
            series: List[Dict[str, Any]] = []
            if data:
                for ds in data.datasets:
                    col = "#6366F1"
                    if ds.backgroundColor and len(ds.backgroundColor) > 0:
                        col = str(ds.backgroundColor[0])
                    series.append(
                        {
                            "name": ds.label or "Series",
                            "color": col,
                            "values": list(ds.data),
                        }
                    )
            title_text = ""
            if chart.options and isinstance(chart.options.get("plugins"), dict):
                leg = chart.options["plugins"].get("title") or {}
                if isinstance(leg, dict):
                    title_text = str(leg.get("text") or "")
            ctype = _recharts_chart_type(_normalize_chart_type(chart.type))
            desc = "\n".join(s.content_points[:3]) if s.content_points else ""
            if len(desc) > 100:
                desc = desc[:97] + "..."
            content = {
                "title": (s.title or f"Slide {idx + 1}")[:21],
                "description": desc,
                "chart": {
                    "title": title_text,
                    "type": ctype,
                    "categories": categories,
                    "series": series,
                    "colorPalette": "professional",
                },
                "metrics": [
                    {"value": "$0", "label": "A"},
                    {"value": "$0", "label": "B"},
                ],
            }
            slides_payload.append(
                {
                    "id": str(uuid.uuid4()),
                    "index": idx,
                    "layout_group": "neo-general",
                    "layout": "title-metrics-with-chart",
                    "content": content,
                    "properties": {},
                }
            )
        else:
            raw_points = s.content_points or [s.title or "Content"]
            filler = "Supporting detail for this bullet point in presentation export."
            points = []
            for p in raw_points[:4]:
                body = (p + ". ") if len(p) < 30 else p[:220]
                if len(body) < 30:
                    body = (body + " " + filler)[:220]
                title = (p[:60] if len(p) >= 6 else (p + " — item")[:60])[:60]
                points.append({"title": title, "body": body})
            while len(points) < 1:
                points.append({"title": "Point", "body": filler})
            stmt = " ".join(raw_points)[:260]
            if len(stmt) < 20:
                stmt = filler
            slides_payload.append(
                {
                    "id": str(uuid.uuid4()),
                    "index": idx,
                    "layout_group": "swift",
                    "layout": "simple-bullet-points-layout",
                    "content": {
                        "title": (s.title or "Overview")[:36],
                        "statement": stmt,
                        "points": points,
                        "website": "www.example.com",
                    },
                    "properties": {},
                }
            )

    return {
        "id": str(uuid.uuid4()),
        "language": deck.language,
        "layout": {"name": "mixed", "ordered": True, "slides": []},
        "n_slides": len(slides_payload),
        "title": deck.title,
        "slides": slides_payload,
        "theme": None,
    }
