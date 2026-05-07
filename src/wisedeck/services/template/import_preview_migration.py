from __future__ import annotations

from pathlib import Path
from typing import List, Optional, Tuple


def materialize_svg_slide_xmls_to_static(
    *,
    static_root: Path,
    preview_id: str,
    svg_slide_xmls: list[str],
    max_pages: int = 60,
) -> Tuple[List[str], Optional[str]]:
    """
    Best-effort helper for migrating legacy import_summary.svg_slide_xmls (inline XML) into
    /static/assets/templates/import_previews/<preview_id>/slide_XX.svg and returning URL list.
    """
    if not isinstance(svg_slide_xmls, list) or not svg_slide_xmls:
        return [], None
    n = len(svg_slide_xmls)
    if n > max_pages:
        return [], f"旧模板 SVG 迁移已跳过：页数 {n} 超过上限 {max_pages}"

    out_dir = (static_root / "assets" / "templates" / "import_previews" / preview_id).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    urls: List[str] = []
    for i, xml in enumerate(svg_slide_xmls, start=1):
        if not isinstance(xml, str) or not xml.strip():
            continue
        fname = f"slide_{i:02d}.svg"
        try:
            (out_dir / fname).write_text(xml, encoding="utf-8")
        except Exception:
            continue
        urls.append(f"/static/assets/templates/import_previews/{preview_id}/{fname}")
    return urls, None

