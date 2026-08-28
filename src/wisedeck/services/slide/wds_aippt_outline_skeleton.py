"""从大纲单页构造 wds_aippt_v1 最小骨架（{type, data}），供 Train 风格 JSON 扩写。"""

from __future__ import annotations

from typing import Any, Dict, List

from .aippt_normalize import _slug_alias


def _normalize_points(slide: Dict[str, Any]) -> List[str]:
    raw = (
        slide.get("content_points")
        or slide.get("bullet_points")
        or slide.get("points")
        or slide.get("bullets")
        or []
    )
    if isinstance(raw, str):
        raw = [raw]
    if not isinstance(raw, list):
        return []
    out: List[str] = []
    for p in raw:
        s = str(p).strip()
        if s:
            out.append(s)
    return out


def outline_slide_to_aippt_skeleton(
    slide: Dict[str, Any],
    page_idx_0: int,
    total_pages: int,
) -> Dict[str, Any]:
    """
    由大纲条目推导最小合法骨架；type 使用 _slug_alias 与 aippt_normalize / Train bundle 对齐。
    template_pack 绑定在 assemble 阶段通过 template_pack_id 完成；此处仅占位结构与文案字段。
    """
    raw_type = str(slide.get("slide_type") or slide.get("type") or "").strip()
    if raw_type:
        st = _slug_alias(raw_type)
    else:
        if total_pages <= 0:
            st = "content"
        elif page_idx_0 == 0:
            st = "cover"
        elif page_idx_0 == total_pages - 1:
            st = "end"
        elif page_idx_0 == 1 and total_pages > 3:
            st = "contents"
        else:
            st = "content"

    title = str(slide.get("title") or "").strip()
    points = _normalize_points(slide)
    subtitle = str(slide.get("subtitle") or slide.get("text") or slide.get("summary") or "").strip()

    if st == "cover":
        return {"type": "cover", "data": {"title": title or "演示标题", "text": subtitle}}

    if st == "contents":
        items = points if points else ([title] if title else ["议程"])
        return {"type": "contents", "data": {"items": items}}

    if st == "transition":
        return {
            "type": "transition",
            "data": {"title": title or "章节过渡", "text": subtitle or (" ".join(points[:3]) if points else "")},
        }

    if st == "end":
        return {"type": "end", "data": {"title": title or "谢谢", "text": subtitle}}

    if st == "reference":
        items = [{"title": str(i + 1), "text": p} for i, p in enumerate(points)]
        if not items and title:
            items = [{"title": "", "text": title}]
        return {"type": "reference", "data": {"title": title or "参考文献", "items": items}}

    items: List[Dict[str, Any]] = [{"title": "", "text": p} for p in points]
    if not items and title:
        items.append({"title": "", "text": title})

    chart_cfg = slide.get("chart_config")
    if isinstance(chart_cfg, dict) and chart_cfg:
        labels = chart_cfg.get("labels") or []
        series = chart_cfg.get("series") or []
        if not isinstance(labels, list):
            labels = []
        if not isinstance(series, list):
            series = []
        items.append(
            {
                "kind": "chart",
                "chartType": str(chart_cfg.get("chartType") or chart_cfg.get("type") or "bar"),
                "labels": [str(x) for x in labels],
                "series": series,
            }
        )

    return {"type": "content", "data": {"title": title or f"第{page_idx_0 + 1}页", "items": items}}
