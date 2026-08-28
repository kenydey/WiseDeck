"""Materialize PPTist slide dicts from WiseDeck AIPPT v1 models + annotated template packs."""

from __future__ import annotations

import copy
import json
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from ..pptist_background_utils import normalize_slide_background
from ..schema.wds_aippt_v1 import (
    ContentBulletItem,
    ContentChartItem,
    ContentImageItem,
    ContentTextItem,
    WDSlideContent,
    WDSlideContents,
    WDSlideCover,
    WDSlideEnd,
    WDSlideReference,
    WDSlideTransition,
    WDSAnySlide,
)

_PACK_DIR = Path(__file__).resolve().parent.parent / "templates" / "wds_template_packs"
_DEFAULT_PACK_ID = "template_pack_smoke"

_LAYOUT_CACHE: Dict[str, Dict[str, Any]] = {}


def _new_id() -> str:
    return uuid.uuid4().hex[:10]


def _load_pack(pack_id: Optional[str]) -> Dict[str, Any]:
    pid = pack_id or _DEFAULT_PACK_ID
    if pid in _LAYOUT_CACHE:
        return _LAYOUT_CACHE[pid]
    path = _PACK_DIR / f"{pid}.json"
    if not path.exists():
        path = _PACK_DIR / f"{_DEFAULT_PACK_ID}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    _LAYOUT_CACHE[pid] = data
    return data


def list_installed_template_packs() -> List[Dict[str, Any]]:
    """Ids + names for GET /api/pptist/templates."""
    rows: List[Dict[str, Any]] = []
    if not _PACK_DIR.is_dir():
        return rows
    for p in sorted(_PACK_DIR.glob("*.json")):
        try:
            raw = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue
        tid = raw.get("id") or p.stem
        rows.append(
            {
                "id": tid,
                "name": raw.get("name") or tid,
                "cover_url": raw.get("cover_url") or "",
            }
        )
    return rows


def load_template_pack_body(template_id: str) -> Dict[str, Any]:
    """Return pack JSON (slides + theme + width/height) for GET .../templates/{id}."""
    return _load_pack(template_id)


def load_template_pack_strict(template_id: str) -> Dict[str, Any]:
    """Load pack by id only if file exists (API GET — no silent fallback)."""
    pid = Path(template_id).name
    if pid != template_id or ".." in template_id:
        raise ValueError("invalid template id")
    path = _PACK_DIR / f"{pid}.json"
    if not path.is_file():
        raise FileNotFoundError(str(path))
    return json.loads(path.read_text(encoding="utf-8"))


def _deep_copy_slide(tpl: Dict[str, Any], slide_id: Optional[str]) -> Dict[str, Any]:
    s = copy.deepcopy(tpl)
    s["id"] = slide_id or _new_id()
    for el in s.get("elements") or []:
        el["id"] = _new_id()
    s["notes"] = s.get("notes") or []
    s["animations"] = s.get("animations") or []
    s["remark"] = s.get("remark") or ""
    if "background" in s:
        s["background"] = normalize_slide_background(s["background"])
    return s


def _wrap_html(text: str) -> str:
    from html import escape

    t = (text or "").strip()
    if not t:
        return "<p></p>"
    return f"<p>{escape(t)}</p>"


def _wrap_multi(lines: List[str]) -> str:
    from html import escape

    if not lines:
        return "<p></p>"
    return "".join(f"<p>{escape(x)}</p>" for x in lines if x)


def _tpl_slide_type(sl: Dict[str, Any]) -> str:
    return str(sl.get("type") or sl.get("slideTag") or "").strip().lower()


def _has_chart_placeholder(sl: Dict[str, Any]) -> bool:
    for el in sl.get("elements") or []:
        if el.get("type") == "chart" and el.get("chartMark") == "chartItem":
            return True
    return False


def _content_needs_chart(model: WDSlideContent) -> bool:
    for it in model.data.items:
        if isinstance(it, ContentChartItem):
            return True
    return False


def _pick_content_template(slides: List[Dict[str, Any]], need_chart: bool) -> Dict[str, Any]:
    candidates = [s for s in slides if _tpl_slide_type(s) == "content"]
    if not candidates:
        return slides[0]
    if need_chart:
        tagged = [s for s in candidates if _has_chart_placeholder(s)]
        return tagged[0] if tagged else candidates[0]
    plain = [s for s in candidates if not _has_chart_placeholder(s) or s.get("wdsVariant") == "text"]
    return plain[0] if plain else candidates[0]


def _pick_by_type(slides: List[Dict[str, Any]], t: str) -> Dict[str, Any]:
    tt = t.strip().lower()
    pool = [s for s in slides if _tpl_slide_type(s) == tt]
    if pool:
        return pool[0]
    return slides[0]


def _find_elements(slide: Dict[str, Any], text_type: str) -> List[Dict[str, Any]]:
    out = []
    for el in slide.get("elements") or []:
        if el.get("type") == "text" and el.get("textType") == text_type:
            out.append(el)
    return out


def _apply_chart_element(el: Dict[str, Any], chart: ContentChartItem) -> None:
    alias = {
        "bar": "bar",
        "column": "column",
        "line": "line",
        "pie": "pie",
        "doughnut": "ring",
        "donut": "ring",
        "ring": "ring",
        "area": "area",
        "radar": "radar",
        "scatter": "scatter",
    }
    ctype = (chart.chartType or "bar").lower()
    el["chartType"] = alias.get(ctype, "bar")
    legends = [str(s.label or "") for s in chart.series]
    series = []
    for s in chart.series:
        row = [float(v) if isinstance(v, (int, float)) else 0.0 for v in (s.data or [])]
        series.append(row)
    el["data"] = {"labels": list(chart.labels or []), "legends": legends, "series": series}


def _bullet_pairs(model: WDSlideContent) -> List[Tuple[str, str]]:
    pairs: List[Tuple[str, str]] = []
    for it in model.data.items:
        if isinstance(it, ContentBulletItem):
            pairs.append((it.title, it.text))
        elif isinstance(it, ContentTextItem):
            pairs.append((it.title, it.text))
        elif isinstance(it, ContentImageItem):
            pairs.append((it.title or "图片", it.text or it.src))
    return pairs


def emit_pptist_from_wds_aippt(
    model: WDSAnySlide,
    *,
    slide_id: Optional[str] = None,
    template_pack_id: Optional[str] = None,
) -> Dict[str, Any]:
    pack = _load_pack(template_pack_id)
    templates: List[Dict[str, Any]] = pack.get("slides") or []
    if not templates:
        raise ValueError("template pack has no slides")

    stype = model.type  # discriminator

    if isinstance(model, WDSlideCover):
        tpl = _pick_by_type(templates, "cover")
        slide = _deep_copy_slide(tpl, slide_id)
        for el in _find_elements(slide, "title"):
            el["content"] = _wrap_html(model.data.title)
        for el in _find_elements(slide, "subtitle"):
            el["content"] = _wrap_html(model.data.text)
        return slide

    if isinstance(model, WDSlideContents):
        tpl = _pick_by_type(templates, "contents")
        slide = _deep_copy_slide(tpl, slide_id)
        for el in _find_elements(slide, "title"):
            el["content"] = _wrap_html("目录")
        lines = [f"{i + 1}. {t}" for i, t in enumerate(model.data.items or [])]
        for el in _find_elements(slide, "content"):
            el["content"] = _wrap_multi(lines)
        return slide

    if isinstance(model, WDSlideTransition):
        tpl = _pick_by_type(templates, "transition")
        slide = _deep_copy_slide(tpl, slide_id)
        for el in _find_elements(slide, "title"):
            el["content"] = _wrap_html(model.data.title)
        for el in _find_elements(slide, "content"):
            el["content"] = _wrap_html(model.data.text)
        return slide

    if isinstance(model, WDSlideContent):
        need_chart = _content_needs_chart(model)
        tpl = _pick_content_template(templates, need_chart)
        slide = _deep_copy_slide(tpl, slide_id)
        for el in _find_elements(slide, "title"):
            el["content"] = _wrap_html(model.data.title)

        charts = [it for it in model.data.items if isinstance(it, ContentChartItem)]
        bullets = _bullet_pairs(model)

        if need_chart and charts:
            for el in slide.get("elements") or []:
                if el.get("type") == "chart" and el.get("chartMark") == "chartItem":
                    _apply_chart_element(el, charts[0])
                    break
            summary_lines = []
            for it in model.data.items:
                if isinstance(it, (ContentBulletItem, ContentTextItem)):
                    summary_lines.append(f"• {it.title}: {it.text}".strip())
            for el in _find_elements(slide, "content"):
                el["content"] = _wrap_multi(summary_lines if summary_lines else [" "])
        else:
            titles = _find_elements(slide, "itemTitle")
            bodies = _find_elements(slide, "item")
            for i, (tit, body) in enumerate(bullets[: max(len(titles), len(bodies))]):
                if i < len(titles):
                    titles[i]["content"] = _wrap_html(tit)
                if i < len(bodies):
                    bodies[i]["content"] = _wrap_html(body)
            imgs = [it for it in model.data.items if isinstance(it, ContentImageItem)]
            img_els = [e for e in slide.get("elements") or [] if e.get("type") == "image"]
            for i, im in enumerate(imgs):
                if i < len(img_els) and im.src:
                    img_els[i]["src"] = im.src
        return slide

    if isinstance(model, WDSlideEnd):
        tpl = _pick_by_type(templates, "end")
        slide = _deep_copy_slide(tpl, slide_id)
        title = model.data.title or "谢谢观看"
        for el in _find_elements(slide, "title"):
            el["content"] = _wrap_html(title)
        return slide

    if isinstance(model, WDSlideReference):
        tpl = _pick_by_type(templates, "reference")
        slide = _deep_copy_slide(tpl, slide_id)
        for el in _find_elements(slide, "title"):
            el["content"] = _wrap_html(model.data.title or "参考文献")
        lines = []
        for it in model.data.items:
            lines.append(f"• {it.title}: {it.text}".strip())
        for el in _find_elements(slide, "content"):
            el["content"] = _wrap_multi(lines or [" "])
        return slide

    raise TypeError(f"unsupported model {type(model)!r}")
