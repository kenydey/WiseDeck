"""Normalize heterogeneous AIPPT payloads (array vs object) into per-slide dicts."""

from __future__ import annotations

from typing import Any, Dict, List, Optional


def _slug_alias(t: str) -> str:
    a = (t or "").strip().lower()
    aliases = {
        "title": "cover",
        "opening": "cover",
        "toc": "contents",
        "table_of_contents": "contents",
        "agenda": "contents",
        "section": "transition",
        "chapter": "transition",
        "body": "content",
        "closing": "end",
        "thankyou": "end",
        "thanks": "end",
        "refs": "reference",
        "bibliography": "reference",
    }
    return aliases.get(a, a)


def normalize_top_level_to_slide_dicts(raw: Any) -> List[Dict[str, Any]]:
    """
    Accept:
    - list of slide objects
    - object with keys cover / contents / transition / content / end / reference (Train-style bundles)
    """
    if raw is None:
        return []
    if isinstance(raw, list):
        out: List[Dict[str, Any]] = []
        for item in raw:
            if isinstance(item, dict):
                d = dict(item)
                if "type" in d:
                    d["type"] = _slug_alias(str(d["type"]))
                out.append(d)
        return out

    if isinstance(raw, dict):
        if "type" in raw and isinstance(raw.get("data"), dict):
            d = dict(raw)
            d["type"] = _slug_alias(str(d["type"]))
            return [d]

        slides: List[Dict[str, Any]] = []

        cov = raw.get("cover")
        if isinstance(cov, dict):
            slides.append({"type": "cover", "data": cov})
        elif cov:
            slides.append({"type": "cover", "data": {"title": str(cov)}})

        contents = raw.get("contents")
        if isinstance(contents, list):
            slides.append({"type": "contents", "data": {"items": [str(x) for x in contents]}})
        elif isinstance(contents, dict):
            slides.append({"type": "contents", "data": contents})

        transitions = raw.get("transition")
        if isinstance(transitions, list):
            for tr in transitions:
                if isinstance(tr, dict):
                    slides.append({"type": "transition", "data": tr})
                else:
                    slides.append({"type": "transition", "data": {"title": str(tr)}})
        elif isinstance(transitions, dict):
            slides.append({"type": "transition", "data": transitions})

        for key in ("content", "slides", "pages"):
            block = raw.get(key)
            if isinstance(block, list):
                for pg in block:
                    if isinstance(pg, dict):
                        d = dict(pg)
                        if "type" not in d:
                            d["type"] = "content"
                        else:
                            d["type"] = _slug_alias(str(d["type"]))
                        slides.append(d)
                break

        end = raw.get("end")
        if isinstance(end, dict):
            slides.append({"type": "end", "data": end})
        elif end:
            slides.append({"type": "end", "data": {"title": str(end)}})

        ref = raw.get("reference")
        if isinstance(ref, dict):
            slides.append({"type": "reference", "data": ref})

        return slides

    return []


def extract_slide_payload_for_page(raw: Any, page_number: int) -> Optional[Dict[str, Any]]:
    """When ``raw`` is an array, pick ``page_number`` (1-based). Otherwise normalize then pick."""
    slides = normalize_top_level_to_slide_dicts(raw)
    if not slides:
        return None
    idx = page_number - 1
    if 0 <= idx < len(slides):
        return slides[idx]
    return None
