"""
Post-process generated slide HTML to ensure required {{MARKER}} slots exist (deterministic injection).
"""

from __future__ import annotations

import logging
import os
import re
from typing import Any, Dict, List, Optional, Set, Tuple

from bs4 import BeautifulSoup

from wisedeck.services.slide.slide_html_placeholder_policy import extract_placeholder_inners_from_html

logger = logging.getLogger(__name__)

_STRICT_ENV = "WISEDECK_SLIDE_PLACEHOLDER_STRICT"


def _strict_mode() -> bool:
    return os.getenv(_STRICT_ENV, "").strip().lower() in ("1", "true", "yes")


def enforce_slide_placeholder_slots(
    html: str,
    required: Set[str],
    *,
    slide_data: Optional[Dict[str, Any]] = None,
) -> Tuple[str, List[str]]:
    """
    Ensure each marker in ``required`` appears as literal {{MARKER}} in HTML.
    Returns (possibly_modified_html, list_of_injected_marker_names).
    """
    if not required:
        return html, []
    if not isinstance(html, str) or not html.strip():
        return html, []

    html = normalize_placeholder_spacing(html)
    present = extract_placeholder_inners_from_html(html)
    missing = sorted(required - present)
    if not missing:
        return html, []

    injected: List[str] = []

    try:
        soup = BeautifulSoup(html, "html.parser")
    except Exception as e:
        logger.warning("placeholder enforce: BeautifulSoup parse failed, append fallback: %s", e)
        out_fb, extra = _append_literal_markers(html, missing)
        return out_fb, extra

    body = soup.body
    if body is None:
        frag = BeautifulSoup("", "html.parser")
        body = frag.new_tag("body")
        for child in list(soup.children):
            body.append(child.extract())
        soup.append(body)

    for marker in missing:
        token = "{{" + marker + "}}"
        div = soup.new_tag("div")
        div["class"] = "wd-slot"
        div["data-wd-marker"] = marker
        div.string = token
        body.append(div)
        injected.append(marker)

    out = str(soup)
    still_missing = sorted(required - extract_placeholder_inners_from_html(out))
    if still_missing:
        out, extra = _append_literal_markers(out, still_missing)
        injected.extend(extra)

    final_missing = sorted(required - extract_placeholder_inners_from_html(out))

    if injected:
        logger.info(
            "slide_html_placeholder_enforce: injected markers=%s strict=%s",
            injected,
            _strict_mode(),
        )
    if _strict_mode() and final_missing:
        logger.error(
            "slide_html_placeholder_enforce strict: still missing after inject=%s",
            final_missing,
        )

    return out, injected


def _append_literal_markers(html: str, markers: List[str]) -> Tuple[str, List[str]]:
    parts: List[str] = []
    for m in markers:
        tok = "{{" + m + "}}"
        parts.append(
            f'<span class="wd-slot-fallback" style="display:none" data-wd-marker="{m}">{tok}</span>'
        )
    blob = "\n".join(parts)
    lower = html.lower()
    idx = lower.rfind("</body>")
    if idx >= 0:
        out = html[:idx] + "\n" + blob + "\n" + html[idx:]
    else:
        out = html + "\n" + blob + "\n"
    return out, list(markers)


def normalize_placeholder_spacing(html: str) -> str:
    """Collapse illegal whitespace inside {{ }} tokens where possible."""
    if not html:
        return html

    def _fix(m: re.Match[str]) -> str:
        inner = (m.group(1) or "").strip().upper().replace(" ", "_")
        return "{{" + inner + "}}"

    return re.sub(r"\{\{\s*([^}]+?)\s*\}\}", _fix, html)
