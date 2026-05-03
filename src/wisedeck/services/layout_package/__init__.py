"""声明式布局包契约（对标 Presenton 式 schema + sample_data），与模板导入 manifest 对齐。"""

from wisedeck.services.layout_package.manifest import (
    LayoutPackageManifest,
    enrich_template_manifest_with_layout_package,
    layout_package_manifest_json_schema,
    parse_layout_package_manifest,
)

__all__ = [
    "LayoutPackageManifest",
    "enrich_template_manifest_with_layout_package",
    "layout_package_manifest_json_schema",
    "parse_layout_package_manifest",
]
