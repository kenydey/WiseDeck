"""
Deterministic slide layout diagnostics from HTML string (no browser).

Scores are heuristic and explainable; intended for editor feedback + lightweight autofix triggers.
"""

from __future__ import annotations

import re
from html.parser import HTMLParser
from typing import Any, Dict, List, Optional, Tuple


INLINE_TAGS = frozenset(
    {
        "span",
        "a",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "code",
        "small",
        "sub",
        "sup",
        "br",
        "img",
    }
)


class _VisibleTextExtractor(HTMLParser):
    """Collect approximate visible text blocks with tag stack context."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._stack: List[str] = []
        self.blocks: List[Dict[str, Any]] = []

    def _current_container(self) -> str:
        for tag in reversed(self._stack):
            if tag not in INLINE_TAGS:
                return tag
        return "body"

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        self._stack.append(tag.lower())

    def handle_endtag(self, tag: str) -> None:
        tag_l = tag.lower()
        while self._stack and self._stack[-1] != tag_l:
            self._stack.pop()
        if self._stack and self._stack[-1] == tag_l:
            self._stack.pop()

    def handle_data(self, data: str) -> None:
        text = (data or "").strip()
        if not text:
            return
        self.blocks.append(
            {
                "text": text,
                "container": self._current_container(),
                "tags": list(self._stack),
            }
        )


def _strip_comments_and_scripts(html: str) -> str:
    html = re.sub(r"(?is)<script\b[^>]*>.*?</script>", " ", html)
    html = re.sub(r"(?is)<style\b[^>]*>.*?</style>", " ", html)
    html = re.sub(r"(?is)<!--.*?-->", " ", html)
    return html


def _parse_px(val: Optional[str]) -> Optional[float]:
    if not val:
        return None
    v = val.strip().lower().replace("px", "")
    try:
        return float(v)
    except ValueError:
        return None


def _extract_overflow_hidden(html: str) -> List[str]:
    hits = []
    for m in re.finditer(r'overflow\s*:\s*hidden', html, flags=re.IGNORECASE):
        start = max(0, m.start() - 120)
        snippet = html[start : m.end() + 40].replace("\n", " ")
        hits.append(snippet[:180])
    return hits[:12]


def _font_size_px_tags(html: str) -> List[float]:
    sizes: List[float] = []
    for m in re.finditer(r'font-size\s*:\s*([0-9.]+)\s*(px|pt)', html, flags=re.IGNORECASE):
        num = float(m.group(1))
        unit = (m.group(2) or "px").lower()
        if unit == "pt":
            num *= 96.0 / 72.0
        sizes.append(round(num, 2))
    return sizes


def score_slide_layout_html(html_content: str) -> Dict[str, Any]:
    raw = html_content or ""
    lowered = raw.lower()

    extractor = _VisibleTextExtractor()
    try:
        extractor.feed(_strip_comments_and_scripts(raw))
    except Exception:
        extractor.blocks = []

    heading_sizes = _font_size_px_tags(raw)
    overflow_snippets = _extract_overflow_hidden(raw)

    text_lengths = [len(b["text"]) for b in extractor.blocks]
    long_lines = sum(1 for ln in text_lengths if ln >= 220)

    fixed_canvas_hints = ("1280", "720", "slide") if raw else ()
    mentions_canvas = any(h in lowered for h in fixed_canvas_hints)

    issues: List[str] = []
    metrics: Dict[str, Any] = {
        "approx_text_blocks": len(extractor.blocks),
        "long_text_blocks_ge_220_chars": long_lines,
        "heading_font_sizes_px_samples": sorted(set(heading_sizes))[:12],
        "overflow_hidden_occurrences": len(overflow_snippets),
        "mentions_slide_canvas_hints": mentions_canvas,
    }

    score = 100.0

    if long_lines >= 3:
        issues.append("多个文本块过长，可能存在排版拥挤或溢出风险")
        score -= min(25.0, 6.0 * long_lines)

    if heading_sizes:
        mn = min(heading_sizes)
        mx = max(heading_sizes)
        if mx > 0 and (mn / mx) < 0.55:
            issues.append("标题与正文字号层级对比偏弱（可能被模型拉平）")
            score -= 12.0

    if overflow_snippets:
        issues.append("检测到 overflow:hidden，可能与文字截断相关")
        score -= min(20.0, 4.0 * len(overflow_snippets))

    if extractor.blocks and long_lines == 0 and not overflow_snippets:
        issues.append("布局规则层面未发现明显风险（仍需视觉上确认）")

    severity = "low"
    if score < 55:
        severity = "high"
    elif score < 75:
        severity = "medium"

    return {
        "score": max(0.0, min(100.0, round(score, 1))),
        "severity": severity,
        "issues": issues,
        "metrics": metrics,
        "overflow_snippets": overflow_snippets[:5],
    }


def apply_rule_based_layout_fixes(html_content: str, diagnostics: Optional[Dict[str, Any]] = None) -> str:
    """
    Conservative fixes:
    - Inject anti-overflow CSS (delegates to LayoutRepairService helper).
    """
    if not html_content:
        return html_content

    diag = diagnostics or score_slide_layout_html(html_content)
    sev = str(diag.get("severity") or "low")

    if sev == "low" and not diag.get("overflow_snippets"):
        return html_content

    from .layout_repair_service import LayoutRepairService

    # Static helper does not require service instance state.
    return LayoutRepairService._inject_anti_overflow_css(html_content)


def aggregate_slide_scores(per_slide: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not per_slide:
        return {"average_score": None, "worst_severity": "low"}

    scores = [float(s.get("score") or 0) for s in per_slide]
    avg = sum(scores) / max(len(scores), 1)

    order = {"low": 0, "medium": 1, "high": 2}
    worst = "low"
    for s in per_slide:
        sev = str(s.get("severity") or "low")
        if order.get(sev, 0) > order.get(worst, 0):
            worst = sev

    return {"average_score": round(avg, 2), "worst_severity": worst, "slides": len(per_slide)}
