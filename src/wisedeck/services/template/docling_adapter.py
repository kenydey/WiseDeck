"""Optional Docling integration for Office template import.

Docling is best-effort semantic extraction (text/structure). It does NOT replace pptx_readable/layout hints.
This module is intentionally dependency-optional: if Docling isn't installed, callers should treat it as skipped.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional, Tuple


def try_convert_pptx_with_docling(
    pptx_path: Path,
    *,
    max_markdown_chars: int = 200_000,
) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Returns (docling_payload, warning).

    docling_payload is a small dict suitable for import_summary["docling"].
    warning is a human-readable string when docling is unavailable or fails.
    """
    try:
        from docling.document_converter import DocumentConverter  # type: ignore
    except Exception as e:
        return None, f"docling 不可用（未安装或导入失败）：{str(e)[:200]}"

    try:
        converter = DocumentConverter()
        result = converter.convert(str(pptx_path))
        doc = getattr(result, "document", None)
        if doc is None:
            return None, "docling 转换失败：result.document 为空"

        md = doc.export_to_markdown() if hasattr(doc, "export_to_markdown") else ""
        if not isinstance(md, str):
            md = str(md)
        truncated = False
        if max_markdown_chars and len(md) > max_markdown_chars:
            md = md[: max_markdown_chars - 1] + "…"
            truncated = True

        return (
            {
                "kind": "docling",
                "markdown": md,
                "truncated": bool(truncated),
            },
            None,
        )
    except Exception as e:
        return None, f"docling 转换失败：{str(e)[:200]}"

