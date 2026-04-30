from __future__ import annotations

import re
from typing import Mapping

from .errors import SVGPlaceholdersError


_WD_TO_PM = {
    # WiseDeck HTML contract -> ppt-master contract (minimal useful subset)
    "page_title": "PAGE_TITLE",
    "page_content": "CONTENT_AREA",
    "current_page_number": "PAGE_NUM",
    "total_page_count": "TOTAL_PAGE_COUNT",  # ppt-master canonical set doesn't define it; keep for debug only
}


def adapt_wisedeck_placeholders(wisedeck_placeholders: Mapping[str, str], *, strict: bool = True) -> dict[str, str]:
    """
    Map WiseDeck placeholders to ppt-master style markers.

    Returns a dict keyed by the inner marker name (no outer braces), e.g. {"PAGE_TITLE": "..."}.
    """
    if not isinstance(wisedeck_placeholders, Mapping):
        raise SVGPlaceholdersError("wisedeck_placeholders must be a mapping")

    out: dict[str, str] = {}
    for k, v in wisedeck_placeholders.items():
        if not isinstance(k, str):
            continue
        kk = k.strip()
        if kk in _WD_TO_PM:
            out[_WD_TO_PM[kk]] = "" if v is None else str(v)
        else:
            if strict:
                # For now, keep this strict to avoid silent template drift.
                raise SVGPlaceholdersError(f"Unsupported WiseDeck placeholder key: {kk}")

    if strict and "PAGE_TITLE" not in out:
        raise SVGPlaceholdersError("Missing required placeholder: page_title -> PAGE_TITLE")
    if strict and "CONTENT_AREA" not in out:
        raise SVGPlaceholdersError("Missing required placeholder: page_content -> CONTENT_AREA")

    return out


def fill_svg_placeholders(svg_xml: str, placeholders: Mapping[str, str], *, strict: bool = True) -> str:
    """
    Replace occurrences of {{MARKER}} in SVG with provided values.
    Keys in `placeholders` are inner names without braces (e.g. PAGE_TITLE).
    """
    if not isinstance(svg_xml, str) or not svg_xml.strip():
        raise SVGPlaceholdersError("SVG is empty")

    if not isinstance(placeholders, Mapping):
        raise SVGPlaceholdersError("placeholders must be a mapping")

    out = svg_xml
    for k, v in placeholders.items():
        if not isinstance(k, str):
            continue
        marker = k.strip()
        if not marker:
            continue
        value = "" if v is None else str(v)
        # SVG is strict XML; placeholders typically land inside text nodes.
        # Escape reserved characters to avoid breaking XML well-formedness.
        value = (
            value.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&apos;")
        )
        out = out.replace("{{" + marker + "}}", value)

    if strict:
        leftovers = re.findall(r"\{\{\s*[^}]+\}\}", out)
        if leftovers:
            # Show the first few to help debug template contract issues.
            sample = ", ".join(leftovers[:6])
            raise SVGPlaceholdersError(f"Unreplaced placeholders remain in SVG: {sample}")

    return out

