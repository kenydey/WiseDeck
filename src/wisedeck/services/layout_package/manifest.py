"""
布局包 manifest：layout_id + JSON Schema（data_schema）+ sample_data + 可选图表绑定点。
导入模板时写入 manifest.json 的 layout_package 字段，供后续生成器校验占位数据。
"""

from __future__ import annotations

import copy
from typing import Any, Dict, List, Literal, Optional, Tuple

from pydantic import BaseModel, Field, ValidationError


class LayoutPackageManifest(BaseModel):
    schema_version: Literal[1] = Field(default=1, description="布局包契约版本")
    layout_id: str = Field(..., min_length=1, description="稳定布局标识，如 group:layout 或 import:{workspace_id}")
    display_name: Optional[str] = Field(default=None, description="展示名称")
    template_group: Optional[str] = Field(default=None, description="模板分组，可与 structured_export_layout_group 对齐")
    data_schema: Dict[str, Any] = Field(default_factory=dict, description="幻灯片数据的 JSON Schema 草案")
    sample_data: Dict[str, Any] = Field(default_factory=dict, description="与 schema 对齐的示例一页数据")
    chart_bindings: List[str] = Field(
        default_factory=list,
        description="图表占位字段路径，如 slides[].chart_config",
    )


def layout_package_manifest_json_schema() -> Dict[str, Any]:
    """Pydantic 生成的 JSON Schema（供校验器 / 静态分发）。"""
    return LayoutPackageManifest.model_json_schema()


def parse_layout_package_manifest(raw: Any) -> Tuple[Optional[LayoutPackageManifest], Optional[str]]:
    """解析第三方 manifest.layout_package；失败返回 (None, error_message)。"""
    if raw is None:
        return None, None
    if not isinstance(raw, dict):
        return None, "layout_package must be an object"
    try:
        return LayoutPackageManifest.model_validate(raw), None
    except ValidationError as e:
        return None, str(e.errors())[:800]


def enrich_template_manifest_with_layout_package(
    manifest: Dict[str, Any],
    *,
    workspace_id: str,
    slide_count: int,
    source: str = "template_import",
) -> Dict[str, Any]:
    """
    为 Office-free 导入产物追加默认 layout_package（不覆盖已有 layout_package）。
    """
    out = copy.deepcopy(manifest)
    if out.get("layout_package"):
        return out

    lp = LayoutPackageManifest(
        layout_id=f"import:{workspace_id}",
        display_name=out.get("source_filename"),
        template_group=None,
        data_schema={
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "content_points": {"type": "array", "items": {"type": "string"}},
                "chart_config": {"type": "object"},
            },
        },
        sample_data={
            "title": "示例标题",
            "content_points": ["要点一", "要点二"],
            "chart_config": None,
        },
        chart_bindings=["chart_config"],
    )
    block = lp.model_dump(mode="json")
    block["provenance"] = {"source": source, "slide_count": slide_count}
    out["layout_package"] = block
    return out
