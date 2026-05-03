"""
可选：在大纲 / 导出前校验 layout_package 与 chart_config 的一致性。
"""

from __future__ import annotations

import logging
import os
from typing import Any, Dict, List, Optional

from wisedeck.services.layout_package.manifest import parse_layout_package_manifest
from wisedeck.services.structured_export.chart_mapper import _normalize_chart_type
from wisedeck.services.structured_export.chart_presets import OFFICIAL_CHART_TYPES

logger = logging.getLogger(__name__)


def collect_layout_package_issues(
    layout_package: Optional[Dict[str, Any]],
    outline: Optional[Dict[str, Any]],
) -> List[str]:
    """返回人类可读的问题列表（空列表表示未发现问题）。"""
    issues: List[str] = []
    if not layout_package:
        return issues

    parsed, err = parse_layout_package_manifest(layout_package)
    if err:
        issues.append(f"layout_package 解析失败: {err}")
        return issues

    assert parsed is not None  # noqa: S101
    slides = []
    if isinstance(outline, dict):
        slides = outline.get("slides") or []
    if not isinstance(slides, list):
        return issues

    strict_native = os.getenv("WISEDECK_LAYOUT_PACKAGE_STRICT_CHARTS", "").strip().lower() in (
        "1",
        "true",
        "yes",
    )

    for i, slide in enumerate(slides):
        if not isinstance(slide, dict):
            continue
        cc = slide.get("chart_config")
        if not isinstance(cc, dict):
            continue
        raw_type = _normalize_chart_type(str(cc.get("type") or "bar"))
        if raw_type not in OFFICIAL_CHART_TYPES and strict_native:
            issues.append(
                f"幻灯片 {i + 1}: chart_config.type={raw_type!r} 不在官方导出类型 {OFFICIAL_CHART_TYPES} 内"
            )
        elif raw_type not in OFFICIAL_CHART_TYPES:
            logger.info(
                "layout_package hint: slide %s chart type %s not in OFFICIAL_CHART_TYPES",
                i + 1,
                raw_type,
            )

    _ = parsed.chart_bindings  # reserved for deeper JSON-schema checks
    return issues


def should_raise_on_layout_issues() -> bool:
    return os.getenv("WISEDECK_LAYOUT_PACKAGE_STRICT", "").strip().lower() in ("1", "true", "yes")
