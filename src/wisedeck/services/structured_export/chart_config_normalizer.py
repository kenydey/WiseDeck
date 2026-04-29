"""
Normalize various chart_config shapes into Chart.js-style config used by structured export.

WiseDeck outline may contain either:
1) Chart.js-like:
   {"type": "...", "data": {"labels": [...], "datasets": [{"label": "...", "data": [...], "backgroundColor": [...] } ]}, "options": {...}}
2) Presenton-like (legacy / editor):
   {"type": "...", "title": "...", "categories": [...], "series": [{"name": "...", "data": [...]}]}
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional


def _is_nonempty_list(x: Any) -> bool:
    return isinstance(x, list) and len(x) > 0


def normalize_chart_config(cc: Any) -> Optional[Dict[str, Any]]:
    """
    Return a dict compatible with ChartConfigModel (Chart.js-style).

    - If `cc` is already Chart.js-style, returns it unchanged.
    - If `cc` uses {categories,series,title}, converts it to Chart.js-style.
    - Otherwise returns original dict (best-effort) or None if not a dict.
    """
    if not isinstance(cc, dict) or not cc:
        return None

    # Already Chart.js-ish.
    data = cc.get("data")
    if isinstance(data, dict) and (
        isinstance(data.get("labels"), list) or isinstance(data.get("datasets"), list)
    ):
        return cc

    categories = cc.get("categories")
    series = cc.get("series")
    if not isinstance(categories, list) or not isinstance(series, list):
        return cc

    labels: List[str] = [str(x) for x in categories]
    datasets: List[Dict[str, Any]] = []
    for s in series:
        if not isinstance(s, dict):
            continue
        name = str(s.get("name") or "Series")
        raw_data = s.get("data")
        if not isinstance(raw_data, list):
            raw_data = []
        values: List[float] = []
        for v in raw_data:
            try:
                values.append(float(v))
            except (TypeError, ValueError):
                values.append(0.0)
        ds: Dict[str, Any] = {"label": name, "data": values}

        # Optional colors.
        bg = s.get("backgroundColor") or s.get("background_color") or s.get("colors")
        if _is_nonempty_list(bg):
            ds["backgroundColor"] = [str(c) for c in bg]
        datasets.append(ds)

    # Put title into options.plugins.title.text so existing payload code can pick it up.
    title = cc.get("title")
    options: Dict[str, Any] = {}
    if isinstance(cc.get("options"), dict):
        options = dict(cc["options"])
    plugins = options.get("plugins")
    if not isinstance(plugins, dict):
        plugins = {}
    if title and isinstance(title, str) and title.strip():
        plugins = dict(plugins)
        plugins["title"] = {"text": title.strip()}
    options["plugins"] = plugins

    out: Dict[str, Any] = {
        "type": cc.get("type") or "bar",
        "data": {"labels": labels, "datasets": datasets},
        "options": options,
    }
    return out

