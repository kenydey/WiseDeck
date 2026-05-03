"""
pptx_readable manifest envelope: schema version, defensive blob stripping, optional size cap.
"""

from __future__ import annotations

import json
from typing import Any, Dict

PPTX_READABLE_SCHEMA_VERSION = 1
PPTX_READABLE_PARSER_ID = "pptxtojson@2.0.2+wisedeck-placeholder-v1"
_UNITS_PT = "pt"
_MEDIA_KEYS = frozenset({"base64", "blob", "picBase64", "picBlob"})
_DEFAULT_MAX_JSON_BYTES = 2_400_000


def strip_media_blobs(obj: Any) -> Any:
    """Remove embedded media blobs from nested structures (defense in depth; runner uses imageMode none)."""
    if isinstance(obj, dict):
        return {k: strip_media_blobs(v) for k, v in obj.items() if k not in _MEDIA_KEYS}
    if isinstance(obj, list):
        return [strip_media_blobs(x) for x in obj]
    return obj


def wrap_and_cap_pptx_readable(payload: Dict[str, Any], *, max_json_bytes: int = _DEFAULT_MAX_JSON_BYTES) -> Dict[str, Any]:
    """
    Wrap parser output with WiseDeck metadata; cap serialized JSON size by trimming slides tail.
    """
    if not isinstance(payload, dict):
        return {
            "schema_version": PPTX_READABLE_SCHEMA_VERSION,
            "parser": PPTX_READABLE_PARSER_ID,
            "units": _UNITS_PT,
            "error": "invalid_payload",
        }

    inner_error = payload.get("error")
    if inner_error:
        out = {
            "schema_version": PPTX_READABLE_SCHEMA_VERSION,
            "parser": PPTX_READABLE_PARSER_ID,
            "units": _UNITS_PT,
            "error": str(inner_error)[:500],
        }
        return out

    stripped = strip_media_blobs(payload)
    envelope: Dict[str, Any] = {
        "schema_version": PPTX_READABLE_SCHEMA_VERSION,
        "parser": PPTX_READABLE_PARSER_ID,
        "units": _UNITS_PT,
        "slides": stripped.get("slides"),
        "themeColors": stripped.get("themeColors"),
        "usedFonts": stripped.get("usedFonts"),
        "size": stripped.get("size"),
    }
    raw = json.dumps(envelope, ensure_ascii=False)
    if len(raw.encode("utf-8")) <= max_json_bytes:
        return envelope

    slides = envelope.get("slides")
    if isinstance(slides, list) and len(slides) > 1:
        lo, hi = 0, len(slides)
        best = envelope
        while lo < hi:
            mid = (lo + hi) // 2
            trial = dict(envelope)
            trial["slides"] = slides[:mid]
            trial["truncated"] = True
            trial["truncated_slide_count"] = len(slides) - mid
            if len(json.dumps(trial, ensure_ascii=False).encode("utf-8")) <= max_json_bytes:
                best = trial
                lo = mid + 1
            else:
                hi = mid
        return best

    envelope["truncated"] = True
    envelope["note_zh"] = "JSON 超限：仅保留元数据骨架（可考虑提升上限或缩小幻灯片数量）。"
    envelope.pop("slides", None)
    return envelope
