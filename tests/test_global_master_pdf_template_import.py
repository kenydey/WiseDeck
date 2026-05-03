"""PDF-only global master template import (PyMuPDF)."""

from __future__ import annotations

import base64
from pathlib import Path

import pytest

pytest.importorskip("fitz")

from wisedeck.services.template.slide_svg_bundler import bundle_workspace_svgs
from wisedeck.services.template.svg_template_import_meta import (
    build_import_summary,
    trim_svg_slide_xmls_for_persistence,
)
from wisedeck.services.template.template_import_service import TemplateImportService


def _minimal_pdf_bytes(path: Path) -> None:
    import fitz

    doc = fitz.open()
    doc.new_page(width=320, height=240)
    doc.save(str(path))
    doc.close()


def test_import_pdf_from_upload_one_page(tmp_path: Path) -> None:
    pdf_path = tmp_path / "one.pdf"
    _minimal_pdf_bytes(pdf_path)

    svc = TemplateImportService(cache_root=tmp_path / "cache")
    b64 = base64.b64encode(pdf_path.read_bytes()).decode("ascii")
    ws = svc.import_pdf_from_upload(filename="one.pdf", data=b64, png_zoom=1.0)
    assert (ws.manifest.get("slide_assets") or {}).get("page_count") == 1
    assert len(list(ws.svg_dir.glob("slide_*.svg"))) == 1
    assert ws.manifest.get("source_kind") == "pdf"


def test_pdf_import_bundle_and_summary_matches_export_pipeline(tmp_path: Path) -> None:
    """Mirrors `_convert_pdf_template_sync` without importing FastAPI routers."""
    pdf_path = tmp_path / "smoke.pdf"
    _minimal_pdf_bytes(pdf_path)

    svc = TemplateImportService(cache_root=tmp_path / "cache")
    b64 = base64.b64encode(pdf_path.read_bytes()).decode("ascii")
    ws = svc.import_pdf_from_upload(filename="smoke.pdf", data=b64, png_zoom=1.0)
    svg_t, html_t, _warnings, slide_xmls = bundle_workspace_svgs(ws.svg_dir, "vertical_stack")
    trimmed, _trim_warn = trim_svg_slide_xmls_for_persistence(slide_xmls)
    slide_count = int((ws.manifest.get("slide_assets") or {}).get("page_count") or 0)
    summary = build_import_summary(
        svg_template=svg_t,
        svg_slide_xmls=trimmed,
        slide_count=slide_count,
        bundle_mode="vertical_stack",
        source_filename="smoke",
        pptx_layout=None,
        template_provenance="pdf_raster_svg_stack",
    )
    assert slide_count >= 1
    assert isinstance(html_t, str) and len(html_t) > 40
    assert summary.get("template_provenance") == "pdf_raster_svg_stack"
    assert summary.get("native_export_mode") == "per_slide"
    xs = summary.get("svg_slide_xmls")
    assert isinstance(xs, list) and len(xs) == 1
