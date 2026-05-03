from __future__ import annotations

import re
from typing import AbstractSet, Mapping, Optional

from .errors import SVGPlaceholdersError


_WD_TO_PM = {
    # WiseDeck HTML / outline contract -> ppt-master inner marker names (no braces)
    "page_title": "PAGE_TITLE",
    "page_content": "CONTENT_AREA",
    "current_page_number": "PAGE_NUM",
    # Optional deck-level fields (not required in every SVG)
    "total_page_count": "TOTAL_PAGE_COUNT",
    "deck_title": "TITLE",
    "subtitle": "SUBTITLE",
    "slide_subtitle": "SUBTITLE",
}


def scan_svg_placeholder_inner_names(svg_xml: str) -> list[str]:
    """Return sorted unique inner names for `{{NAME}}` patterns in SVG/XML text."""
    if not isinstance(svg_xml, str) or not svg_xml.strip():
        return []
    found = re.findall(r"\{\{\s*([^}]+?)\s*\}\}", svg_xml)
    inner: set[str] = set()
    for raw in found:
        name = str(raw).strip()
        if name:
            inner.add(name)
    return sorted(inner)


def adapt_wisedeck_placeholders(
    wisedeck_placeholders: Mapping[str, str],
    *,
    strict: bool = True,
    target_marker_set: AbstractSet[str] | None = None,
) -> dict[str, str]:
    """
    Map WiseDeck placeholders to ppt-master style markers.

    Returns a dict keyed by the inner marker name (no outer braces), e.g. {"PAGE_TITLE": "..."}.

    When target_marker_set is set, keys in the output are restricted to that set (values may be empty).
    Unknown keys in wisedeck_placeholders still raise in strict mode.
    """
    if not isinstance(wisedeck_placeholders, Mapping):
        raise SVGPlaceholdersError("wisedeck_placeholders must be a mapping")

    out: dict[str, str] = {}
    for k, v in wisedeck_placeholders.items():
        if not isinstance(k, str):
            continue
        kk = k.strip()
        if kk in _WD_TO_PM:
            pm = _WD_TO_PM[kk]
            if target_marker_set is not None and pm not in target_marker_set:
                if strict:
                    raise SVGPlaceholdersError(
                        f"Mapped marker {pm!r} is not allowed by target_marker_set",
                    )
                continue
            out[pm] = "" if v is None else str(v)
        else:
            if strict:
                raise SVGPlaceholdersError(f"Unsupported WiseDeck placeholder key: {kk}")

    if strict and "PAGE_TITLE" not in out:
        raise SVGPlaceholdersError("Missing required placeholder: page_title -> PAGE_TITLE")
    if strict and "CONTENT_AREA" not in out:
        raise SVGPlaceholdersError("Missing required placeholder: page_content -> CONTENT_AREA")

    return out


def assert_all_placeholders_replaced(
    *,
    svg_xml: str,
    allowed_inner_names: AbstractSet[str] | None = None,
    strict: bool = True,
) -> None:
    """
    If strict, raise when any `{{...}}` remains whose inner name is not in allowed_inner_names
    (when allowed_inner_names is None, any remaining placeholder fails).
    """
    if not strict:
        return
    leftovers = re.findall(r"\{\{\s*([^}]+?)\s*\}\}", svg_xml)
    inner_left = [x.strip() for x in leftovers if x.strip()]
    if not inner_left:
        return
    if allowed_inner_names is not None:
        bad = [x for x in inner_left if x not in allowed_inner_names]
        if not bad:
            return
        sample = ", ".join(f"{{{{{x}}}}}" for x in bad[:6])
        raise SVGPlaceholdersError(f"Unreplaced or disallowed placeholders remain in SVG: {sample}")
    sample = ", ".join(f"{{{{{x}}}}}" for x in inner_left[:6])
    raise SVGPlaceholdersError(f"Unreplaced placeholders remain in SVG: {sample}")


def fill_svg_placeholders(
    svg_xml: str,
    placeholders: Mapping[str, str],
    *,
    strict: bool = True,
    page_index: Optional[int] = None,
) -> str:
    """
    Replace occurrences of {{MARKER}} in SVG with provided values.
    Keys in `placeholders` are inner names without braces (e.g. PAGE_TITLE).
    """
    if not isinstance(svg_xml, str) or not svg_xml.strip():
        raise SVGPlaceholdersError("SVG is empty", page_index=page_index)

    if not isinstance(placeholders, Mapping):
        raise SVGPlaceholdersError("placeholders must be a mapping", page_index=page_index)

    out = svg_xml
    for k, v in placeholders.items():
        if not isinstance(k, str):
            continue
        marker = k.strip()
        if not marker:
            continue
        value = "" if v is None else str(v)
        value = (
            value.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&apos;")
        )
        out = out.replace("{{" + marker + "}}", value)

    if strict:
        try:
            assert_all_placeholders_replaced(svg_xml=out, allowed_inner_names=None, strict=True)
        except SVGPlaceholdersError as e:
            raise SVGPlaceholdersError(
                str(e),
                page_index=e.page_index if e.page_index is not None else page_index,
                details=e.details,
            ) from e

    return out
