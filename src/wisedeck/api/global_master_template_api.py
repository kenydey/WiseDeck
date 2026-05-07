"""
Global Master Template API endpoints
"""

import asyncio
import copy
import logging
import os
import time
import uuid
from html import escape as html_escape
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query, Request, Body
from fastapi.responses import JSONResponse, Response

from .models import (
    DuplicateTemplateBody,
    GlobalMasterTemplateCreate, GlobalMasterTemplateUpdate, GlobalMasterTemplateResponse,
    GlobalMasterTemplateDetailResponse, GlobalMasterTemplateGenerateRequest,
    TemplateImportUploadRequest,
    TemplateImportUploadResponse,
    TemplateOfficeConvertRequest,
    TemplateOfficeConvertResponse,
    TemplatePdfConvertRequest,
    TemplateReferenceWorkspacePaths,
    TemplateSelectionRequest, TemplateSelectionResponse
)
from ..services.template.global_master_template_service import GlobalMasterTemplateService
from ..services.template.libreoffice_html_exporter import (
    export_presentation_html_bundle,
    inject_hidden_placeholder_slots,
    split_lo_merged_html_slide_fragments,
    wrap_lo_slide_fragment_html,
)
from ..services.template.pptx_slide_layout_hints import extract_pptx_layout_hints
from ..services.template.slide_svg_bundler import BundleMode, bundle_workspace_svgs
from ..services.template.slide_svg_bundler import wrap_single_slide_html
from ..services.template.svg_template_import_meta import (
    build_import_summary,
    merge_import_summary_with_template_contract,
    placeholder_markers_from_html,
    placeholder_markers_from_template_contract,
    trim_svg_slide_xmls_for_persistence,
)
from ..services.template.office_import_alignment import (
    collect_office_import_alignment_warnings,
    merge_warnings_unique,
)
from ..services.template.docling_adapter import try_convert_pptx_with_docling
from ..services.template.template_contract_build import build_template_contract_from_manifest
from ..services.template.template_import_service import (
    TemplateImportService,
    _resolve_soffice,
    _run_soffice_convert,
    _pdf_to_page_assets,
    materialize_office_upload_to_pptx,
)
from ..services.template.template_office_svg_placeholder_inject import (
    inject_placeholders_into_workspace_svgs,
)
from ..auth.middleware import get_current_user_required
from ..core.config import app_config
from ..database.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

_LIBREOFFICE_HTML_IMPORT_DISABLED = os.getenv(
    "WISEDECK_DISABLE_LIBREOFFICE_HTML_IMPORT", ""
).strip().lower() in ("1", "true", "yes")

_DOCLING_IMPORT_ENABLED = os.getenv("WISEDECK_ENABLE_DOCLING_IMPORT", "").strip().lower() in (
    "1",
    "true",
    "yes",
)

_LO_SVG_SUPPLEMENT_ENABLED = os.getenv("WISEDECK_ENABLE_LO_SVG_SUPPLEMENT", "").strip().lower() in (
    "1",
    "true",
    "yes",
)
_LO_SVG_SUPPLEMENT_DISABLED = os.getenv("WISEDECK_DISABLE_LO_SVG_SUPPLEMENT", "").strip().lower() in (
    "1",
    "true",
    "yes",
)


# Create router
router = APIRouter(prefix="/api/global-master-templates", tags=["Global Master Templates"])


def _template_service_for_user(
    user,
    *,
    allow_system_template_write: bool = False,
) -> GlobalMasterTemplateService:
    """Create a user-scoped template service instance."""
    return GlobalMasterTemplateService(
        user_id=user.id,
        allow_system_template_write=bool(
            allow_system_template_write and getattr(user, "is_admin", False)
        ),
    )


def _template_import_service() -> TemplateImportService:
    extract_holder: dict = {}

    def _extract(reference_pptx: dict):
        svc = extract_holder.get("svc")
        if svc is None:
            extract_holder["svc"] = GlobalMasterTemplateService()
            svc = extract_holder["svc"]
        return svc._extract_pptx_template_reference(reference_pptx)

    return TemplateImportService(extract_fn=_extract)


def _layout_hints_from_pptx_path(pptx_path: Path) -> dict:
    try:
        return extract_pptx_layout_hints(pptx_path.read_bytes())
    except Exception as e:
        logger.warning("extract_pptx_layout_hints failed: %s", e)
        return {"schema_version": 1, "error": str(e)[:200], "slides": []}


def _convert_pdf_template_sync(body: TemplatePdfConvertRequest) -> TemplateOfficeConvertResponse:
    suggested = Path(body.filename or "upload.pdf").stem.replace("\x00", "") or "imported_pdf_template"
    importer = _template_import_service()
    ws = importer.import_pdf_from_upload(
        filename=body.filename,
        data=body.data,
        png_zoom=float(body.png_zoom or 2.0),
    )
    if body.bundle_mode == "first_slide_only":
        bm: BundleMode = "first_slide_only"
    elif body.bundle_mode == "per_slide":
        bm = "per_slide"
    else:
        bm = "vertical_stack"
    svg_t, html_t, w_bundle, _slide_xmls, merged_svg = bundle_workspace_svgs(ws.svg_dir, bm)
    slide_assets = ws.manifest.get("slide_assets") or {}
    try:
        slide_count = int(slide_assets.get("page_count") or 0)
    except (TypeError, ValueError):
        slide_count = 0

    _cleanup_import_previews()
    preview_id = str(uuid.uuid4())
    vis_fields, vis_warnings = _materialize_workspace_visual_urls(
        preview_id=preview_id,
        svg_dir=ws.svg_dir,
        png_dir=ws.png_dir,
        slide_count=slide_count,
    )
    w_bundle.extend(vis_warnings or [])
    imp_pdf = build_import_summary(
        svg_template=svg_t,
        slide_count=slide_count,
        bundle_mode=bm,
        source_filename=suggested,
        pptx_layout=None,
        template_provenance="pdf_raster_svg_stack",
    )
    if merged_svg:
        merged_url, merged_warn = _materialize_merged_svg_url(
            preview_id=preview_id,
            merged_svg_xml=merged_svg,
        )
        if merged_url:
            imp_pdf["merged_svg_url"] = merged_url
        if merged_warn:
            w_bundle.append(merged_warn)
    if isinstance(vis_fields, dict) and vis_fields:
        imp_pdf.update(vis_fields)

    merge_warnings_unique(
        w_bundle,
        collect_office_import_alignment_warnings(
            declared_slide_count=slide_count,
            template_contract=None,
            svg_slide_xmls=None,
        ),
    )

    return TemplateOfficeConvertResponse(
        html_template=html_t,
        svg_template=svg_t,
        suggested_template_name=suggested,
        slide_count=slide_count,
        export_engine_used="pdf_svg_stack",
        warnings=w_bundle,
        import_summary=imp_pdf,
    )


def _supplement_svg_from_pptx(
    pptx_path: Path,
    root: Path,
    soffice: str,
    pptx_layout_hints: dict,
    slide_count: int,
    *,
    pptx_readable: Optional[dict] = None,
) -> tuple[Optional[str], List[str], Optional[str]]:
    """
    Generate SVG template + per-slide SVG XMLs from a .pptx via LibreOffice PDF + PyMuPDF.

    Reuses the same pipeline as the svg_stack path:
      PPTX → PDF (LibreOffice) → per-page SVG (PyMuPDF) → placeholder injection → bundle.

    Returns (svg_template, svg_slide_xmls, merged_svg_template) or (None, [], None) on failure.
    ``merged_svg_template`` is the vertical composite when multiple slides exist; the first return
    value is always the first slide only (same contract as :func:`bundle_workspace_svgs`).
    """
    pdf_dir = root / "svg_supplement_pdf"
    pdf_path = _run_soffice_convert(soffice, pptx_path, pdf_dir, "pdf")

    svg_dir = root / "svg_supplement_svg"
    png_dir = root / "svg_supplement_png"
    _pdf_to_page_assets(pdf_path, svg_dir, png_dir, png_zoom=2.0, generate_svg=True)

    inject_placeholders_into_workspace_svgs(
        svg_dir,
        pptx_layout_hints,
        pptx_readable=pptx_readable,
    )

    svg_t, _html_t, _w_bundle, slide_xmls, merged_svg = bundle_workspace_svgs(
        svg_dir, "vertical_stack"
    )
    return svg_t, slide_xmls, merged_svg


def _static_import_preview_dir(*, preview_id: str) -> Path:
    # src/wisedeck/api/ -> src/wisedeck/ -> web/static/
    static_root = (Path(__file__).resolve().parents[1] / "web" / "static").resolve()
    return (static_root / "assets" / "templates" / "import_previews" / preview_id).resolve()


def _cleanup_import_previews(*, keep_days: int = 7, max_delete: int = 30) -> None:
    """
    Best-effort cleanup for /static/assets/templates/import_previews.
    Deletes directories older than keep_days. Keeps workload bounded by max_delete.
    """
    try:
        root = _static_import_preview_dir(preview_id="__probe__").parents[0]
        if not root.is_dir():
            return
        now = time.time()
        cutoff = now - (int(keep_days or 7) * 86400)
        deleted = 0
        for p in sorted(root.iterdir(), key=lambda x: x.name):
            if deleted >= max_delete:
                break
            if not p.is_dir():
                continue
            try:
                m = p.stat().st_mtime
            except OSError:
                continue
            if m >= cutoff:
                continue
            # avoid deleting our probe dir name by accident
            if p.name == "__probe__":
                continue
            try:
                import shutil

                shutil.rmtree(p, ignore_errors=True)
                deleted += 1
            except Exception:
                continue
    except Exception:
        return


def _static_preview_png_dir(*, preview_id: str) -> Path:
    return _static_import_preview_dir(preview_id=preview_id)


def _materialize_workspace_visual_urls(
    *,
    preview_id: str,
    svg_dir: Path,
    png_dir: Path,
    slide_count: int,
    max_pages: int = 60,
) -> tuple[dict, list[str]]:
    """
    Copy slide_XX.svg/png from a workspace directory into /static import_previews and return URL lists.
    """
    warnings: List[str] = []
    out: dict = {"visual_preview_id": preview_id}
    n = int(slide_count or 0)
    if n <= 0:
        return out, warnings
    if n > max_pages:
        warnings.append(f"逐页预览落盘已跳过：页数 {n} 超过上限 {max_pages}")
        return out, warnings

    static_dir = _static_import_preview_dir(preview_id=preview_id)
    static_dir.mkdir(parents=True, exist_ok=True)

    svg_urls: List[str] = []
    png_urls: List[str] = []
    for i in range(1, n + 1):
        svg_src = svg_dir / f"slide_{i:02d}.svg"
        if svg_src.is_file():
            dst = static_dir / svg_src.name
            try:
                dst.write_bytes(svg_src.read_bytes())
                svg_urls.append(f"/static/assets/templates/import_previews/{preview_id}/{dst.name}")
            except Exception as e:
                warnings.append(f"逐页 SVG 写入失败：{svg_src.name}（{e}）")

        png_src = png_dir / f"slide_{i:02d}.png"
        if png_src.is_file():
            dst = static_dir / png_src.name
            try:
                dst.write_bytes(png_src.read_bytes())
                png_urls.append(f"/static/assets/templates/import_previews/{preview_id}/{dst.name}")
            except Exception as e:
                warnings.append(f"逐页 PNG 写入失败：{png_src.name}（{e}）")

    if svg_urls:
        out["svg_slide_urls"] = svg_urls
        out["svg_preview_base_url"] = f"/static/assets/templates/import_previews/{preview_id}"
    if png_urls:
        out["png_slide_urls"] = png_urls
        out["png_preview_base_url"] = f"/static/assets/templates/import_previews/{preview_id}"
    if svg_urls or png_urls:
        warnings.append("已将逐页预览素材落盘到 /static/assets/templates/import_previews/（URL 引用）")
    return out, warnings


def _materialize_merged_svg_url(
    *,
    preview_id: str,
    merged_svg_xml: str,
) -> tuple[Optional[str], Optional[str]]:
    """
    Persist merged deck SVG (vertical composite) under /static import_previews and return URL.
    """
    if not isinstance(merged_svg_xml, str) or not merged_svg_xml.strip():
        return None, None
    static_dir = _static_import_preview_dir(preview_id=preview_id)
    static_dir.mkdir(parents=True, exist_ok=True)
    p = static_dir / "merged.svg"
    try:
        p.write_text(merged_svg_xml, encoding="utf-8")
    except Exception as e:
        return None, f"merged_svg 写入失败（merged.svg）：{e}"
    return f"/static/assets/templates/import_previews/{preview_id}/{p.name}", None


def _supplement_svg_preview_from_pptx(
    pptx_path: Path,
    root: Path,
    soffice: str,
    *,
    preview_id: str,
    slide_count: int,
    png_zoom: float,
    max_pages: int = 60,
) -> tuple[list[str], list[str]]:
    """
    Generate per-slide SVGs for preview (best-effort). Files are copied under /static and referenced by URL list.
    Returns (svg_urls, warnings). SVG generation may be partial; callers should keep PNG as fallback.
    """
    warnings: List[str] = []
    n = int(slide_count or 0)
    if n <= 0:
        return [], []
    if n > max_pages:
        warnings.append(f"逐页 SVG 预览已跳过：页数 {n} 超过上限 {max_pages}")
        return [], warnings

    pdf_dir = root / "svg_preview_pdf"
    pdf_path = _run_soffice_convert(soffice, pptx_path, pdf_dir, "pdf")
    svg_dir = root / "svg_preview_svg"
    png_dir = root / "svg_preview_png"
    _pdf_to_page_assets(
        pdf_path,
        svg_dir,
        png_dir,
        png_zoom=float(png_zoom or 2.0),
        generate_svg=True,
    )

    static_dir = _static_import_preview_dir(preview_id=preview_id)
    static_dir.mkdir(parents=True, exist_ok=True)
    urls: List[str] = []
    for i in range(1, n + 1):
        src = svg_dir / f"slide_{i:02d}.svg"
        if not src.is_file():
            continue
        dst = static_dir / src.name
        try:
            dst.write_bytes(src.read_bytes())
        except Exception as e:
            warnings.append(f"逐页 SVG 写入失败：{src.name}（{e}）")
            continue
        urls.append(f"/static/assets/templates/import_previews/{preview_id}/{dst.name}")

    if urls:
        warnings.append("已生成逐页 SVG 预览（/static/assets/templates/import_previews/...）")
    else:
        warnings.append("逐页 SVG 预览未生成（将使用 PNG/HTML 兜底）")
    return urls, warnings



def _supplement_png_preview_from_pptx(
    pptx_path: Path,
    root: Path,
    soffice: str,
    *,
    preview_id: str,
    slide_count: int,
    png_zoom: float,
    max_pages: int = 60,
) -> tuple[list[str], list[str]]:
    """
    Generate per-slide PNGs for preview only (no SVG). Files are copied under /static and referenced by URL list.
    Returns (png_urls, warnings).
    """
    warnings: List[str] = []
    n = int(slide_count or 0)
    if n <= 0:
        return [], []
    if n > max_pages:
        warnings.append(f"逐页 PNG 预览已跳过：页数 {n} 超过上限 {max_pages}")
        return [], warnings

    pdf_dir = root / "png_preview_pdf"
    pdf_path = _run_soffice_convert(soffice, pptx_path, pdf_dir, "pdf")
    png_dir = root / "png_preview_png"
    _pdf_to_page_assets(
        pdf_path,
        None,
        png_dir,
        png_zoom=float(png_zoom or 2.0),
        generate_svg=False,
    )

    static_dir = _static_preview_png_dir(preview_id=preview_id)
    static_dir.mkdir(parents=True, exist_ok=True)
    urls: List[str] = []
    for i in range(1, n + 1):
        src = png_dir / f"slide_{i:02d}.png"
        if not src.is_file():
            warnings.append(f"逐页 PNG 缺失：slide_{i:02d}.png")
            continue
        dst = static_dir / src.name
        try:
            dst.write_bytes(src.read_bytes())
        except Exception as e:
            warnings.append(f"逐页 PNG 写入失败：{src.name}（{e}）")
            continue
        urls.append(f"/static/assets/templates/import_previews/{preview_id}/{dst.name}")

    if urls:
        warnings.append("已生成逐页 PNG 预览兜底（/static/assets/templates/import_previews/...）")
    return urls, warnings


def _supplement_visual_previews_from_pptx(
    pptx_path: Path,
    root: Path,
    soffice: str,
    *,
    preview_id: str,
    slide_count: int,
    png_zoom: float,
) -> tuple[dict, list[str]]:
    """
    Generate visual preview artifacts under /static and return import_summary fields + warnings.
    Prefer SVG URLs, keep PNG URLs as baseline fallback.
    """
    warnings: List[str] = []
    out: dict = {"visual_preview_id": preview_id}
    _cleanup_import_previews()

    try:
        png_urls, png_warnings = _supplement_png_preview_from_pptx(
            pptx_path,
            root,
            soffice,
            preview_id=preview_id,
            slide_count=slide_count,
            png_zoom=float(png_zoom or 2.0),
        )
        if png_urls:
            out["png_slide_urls"] = png_urls
            out["png_preview_base_url"] = f"/static/assets/templates/import_previews/{preview_id}"
        warnings.extend(png_warnings or [])
    except Exception as e:
        logger.warning("png preview supplement failed (non-fatal): %s", e)
        warnings.append(f"逐页 PNG 预览兜底生成失败：{e}")

    if _LO_SVG_SUPPLEMENT_DISABLED:
        warnings.append("已跳过逐页 SVG 预览：设置了 WISEDECK_DISABLE_LO_SVG_SUPPLEMENT=1")
        return out, warnings

    try:
        svg_urls, svg_warnings = _supplement_svg_preview_from_pptx(
            pptx_path,
            root,
            soffice,
            preview_id=preview_id,
            slide_count=slide_count,
            png_zoom=float(png_zoom or 2.0),
        )
        if svg_urls:
            out["svg_slide_urls"] = svg_urls
            out["svg_preview_base_url"] = f"/static/assets/templates/import_previews/{preview_id}"
            warnings.append("已生成逐页 SVG 预览（svg_slide_urls）")
        warnings.extend(svg_warnings or [])
    except Exception as e:
        logger.warning("svg preview supplement failed (non-fatal): %s", e)
        warnings.append(f"逐页 SVG 预览生成失败（将使用 PNG/HTML 兜底）：{e}")

    return out, warnings


def _convert_office_structured_only_sync(
    body: TemplateOfficeConvertRequest,
    suggested: str,
) -> TemplateOfficeConvertResponse:
    """PPTX→pptxtojson only: no LibreOffice / PyMuPDF. Requires Node + runner bundle."""
    from wisedeck.services.template.pptx_readable_runner import parse_pptx_to_readable_json

    pptx_path, _root, safe_name = materialize_office_upload_to_pptx(
        filename=body.filename,
        data=body.data,
    )
    stem = Path(safe_name).stem or suggested
    lw_wid = str(uuid.uuid4())
    importer = _template_import_service()
    raw = parse_pptx_to_readable_json(pptx_path, strict=True)
    slides = raw.get("slides") if isinstance(raw, dict) else None
    slide_count = len(slides) if isinstance(slides, list) else 0
    lw_manifest = importer.build_lightweight_structured_manifest(
        pptx_path,
        workspace_id=lw_wid,
        slide_count=slide_count,
        source_filename=stem,
        strict_pptx_readable=False,
        pre_parsed_raw=raw if isinstance(raw, dict) else None,
    )
    template_contract = build_template_contract_from_manifest(
        lw_manifest,
        slide_count=slide_count,
        source_filename=suggested,
    )
    hints = lw_manifest.get("pptx_layout") if isinstance(lw_manifest.get("pptx_layout"), dict) else {}
    imp = build_import_summary(
        svg_template=None,
        slide_count=slide_count,
        bundle_mode=None,
        source_filename=stem,
        pptx_layout=hints,
        template_provenance="office_pptxtojson_only",
    )
    imp = merge_import_summary_with_template_contract(imp, template_contract)
    imp["structured_contract"] = True
    imp["html_engine"] = "pptxtojson_only"
    safe_title = html_escape((stem or "template").replace("<", "").replace(">", ""))
    html_stub = (
        f"<!doctype html><html><head><meta charset=\"UTF-8\"><title>{safe_title}</title></head>"
        f"<body><p>结构化导入模式（pptxtojson_only）：无 LibreOffice 视觉参考；"
        f"请依赖 template_contract / 生成流程填充幻灯片。</p></body></html>"
    )
    struct_warnings = collect_office_import_alignment_warnings(
        declared_slide_count=slide_count,
        template_contract=template_contract,
    )
    return TemplateOfficeConvertResponse(
        html_template=html_stub,
        svg_template=None,
        suggested_template_name=stem,
        slide_count=slide_count,
        export_engine_used="pptxtojson_only",
        warnings=struct_warnings,
        import_summary=imp,
        template_contract=template_contract,
    )


def _convert_office_svg_stack_sync(
    body: TemplateOfficeConvertRequest,
    suggested: str,
    warnings_acc: List[str],
) -> TemplateOfficeConvertResponse:
    """PPTX → PDF → SVG stack (existing path)."""
    importer = _template_import_service()
    ws = importer.import_from_upload(
        filename=body.filename,
        data=body.data,
        png_zoom=float(body.png_zoom or 2.0),
    )
    layout_hints = ws.manifest.get("pptx_layout")
    if not isinstance(layout_hints, dict):
        layout_hints = _layout_hints_from_pptx_path(ws.pptx_path)
    svg_t, html_t, w_bundle, _slide_xmls, merged_svg = bundle_workspace_svgs(
        ws.svg_dir, body.bundle_mode
    )
    warnings_acc.extend(w_bundle)
    slide_assets = ws.manifest.get("slide_assets") or {}
    slide_count = int(slide_assets.get("page_count") or 0)

    _cleanup_import_previews()
    preview_id = str(uuid.uuid4())
    vis_fields, vis_warnings = _materialize_workspace_visual_urls(
        preview_id=preview_id,
        svg_dir=ws.svg_dir,
        png_dir=ws.png_dir,
        slide_count=slide_count,
    )
    warnings_acc.extend(vis_warnings or [])

    template_contract = build_template_contract_from_manifest(
        ws.manifest if isinstance(ws.manifest, dict) else {},
        slide_count=slide_count,
        source_filename=suggested,
    )
    imp = build_import_summary(
        svg_template=svg_t,
        slide_count=slide_count,
        bundle_mode=body.bundle_mode,
        source_filename=suggested,
        pptx_layout=layout_hints if isinstance(layout_hints, dict) else None,
        template_provenance="office_svg_stack_injected",
    )
    if _DOCLING_IMPORT_ENABLED:
        docling_payload, docling_warn = try_convert_pptx_with_docling(ws.pptx_path)
        if docling_payload:
            imp["docling"] = docling_payload
        if docling_warn:
            warnings_acc.append(docling_warn)
    imp = merge_import_summary_with_template_contract(imp, template_contract)
    imp["structured_contract"] = True
    if merged_svg:
        merged_url, merged_warn = _materialize_merged_svg_url(
            preview_id=preview_id,
            merged_svg_xml=merged_svg,
        )
        if merged_url:
            imp["merged_svg_url"] = merged_url
        if merged_warn:
            warnings_acc.append(merged_warn)
    if isinstance(vis_fields, dict) and vis_fields:
        imp.update(vis_fields)

    merge_warnings_unique(
        warnings_acc,
        collect_office_import_alignment_warnings(
            declared_slide_count=slide_count,
            template_contract=template_contract,
            svg_slide_xmls=None,
        ),
    )

    return TemplateOfficeConvertResponse(
        html_template=html_t,
        svg_template=svg_t,
        suggested_template_name=suggested,
        slide_count=slide_count,
        export_engine_used="svg_stack",
        warnings=warnings_acc,
        import_summary=imp,
        template_contract=template_contract,
    )


def _convert_office_template_sync(body: TemplateOfficeConvertRequest) -> TemplateOfficeConvertResponse:
    suggested = (
        Path(body.filename or "upload").stem.replace("\x00", "") or "imported_template"
    )
    mode = str(getattr(body, "import_mode", None) or "structured_with_html").strip()
    if not body.prefer_libreoffice_html and mode == "structured_with_html":
        mode = "structured_with_svg"

    if mode == "structured":
        return _convert_office_structured_only_sync(body, suggested)

    warnings_acc: List[str] = []
    if mode == "structured_with_svg":
        warnings_acc.append("import_mode=structured_with_svg：跳过 LibreOffice HTML，使用 PDF→SVG 管线")
        try_lo = False
    elif mode == "full":
        try_lo = True
        warnings_acc.append("import_mode=full：与 structured_with_html 相同（LibreOffice HTML 优先）")
    else:
        try_lo = bool(body.prefer_libreoffice_html)

    if _LIBREOFFICE_HTML_IMPORT_DISABLED:
        try_lo = False
        warnings_acc.append(
            "已跳过 LibreOffice HTML：设置了 WISEDECK_DISABLE_LIBREOFFICE_HTML_IMPORT，直接使用 svg_stack"
        )
    if try_lo:
        try:
            pptx_path, root, safe_name = materialize_office_upload_to_pptx(
                filename=body.filename,
                data=body.data,
            )
            soffice = _resolve_soffice()
            html_t, slide_count, warnings = export_presentation_html_bundle(
                pptx_path,
                work_dir=root,
                soffice=soffice,
            )
            stem = Path(safe_name).stem or suggested
            hints = _layout_hints_from_pptx_path(pptx_path)

            # LibreOffice may export a single merged HTML file. Split it early so the rest of the pipeline
            # (structured manifest/contract + alignment warnings) uses the real per-slide count.
            lo_fragments = split_lo_merged_html_slide_fragments(html_t)
            if lo_fragments:
                slide_count = len(lo_fragments)

            lw_wid = str(uuid.uuid4())
            importer = _template_import_service()
            lw_manifest = importer.build_lightweight_structured_manifest(
                pptx_path,
                workspace_id=lw_wid,
                slide_count=slide_count,
                source_filename=stem,
            )
            template_contract = build_template_contract_from_manifest(
                lw_manifest,
                slide_count=slide_count,
                source_filename=suggested,
            )
            contract_markers = placeholder_markers_from_template_contract(template_contract)
            html_t = inject_hidden_placeholder_slots(html_t, markers=contract_markers)
            imp_lo = build_import_summary(
                svg_template=None,
                slide_count=slide_count,
                bundle_mode=None,
                source_filename=stem,
                pptx_layout=hints,
                template_provenance="office_libreoffice_html",
            )
            if _DOCLING_IMPORT_ENABLED:
                docling_payload, docling_warn = try_convert_pptx_with_docling(pptx_path)
                if docling_payload:
                    imp_lo["docling"] = docling_payload
                if docling_warn:
                    warnings_acc.append(docling_warn)
            imp_lo = merge_import_summary_with_template_contract(imp_lo, template_contract)
            if not (imp_lo.get("placeholder_markers") or []):
                imp_lo["placeholder_markers"] = placeholder_markers_from_html(html_t)
            imp_lo["structured_contract"] = True
            imp_lo["html_engine"] = "libreoffice_html"
            html_template_out = html_t
            if lo_fragments:
                imp_lo["html_slide_fragments"] = lo_fragments
                imp_lo["visual_persistence_version"] = max(int(imp_lo.get("visual_persistence_version") or 0), 1)
                imp_lo["merged_libreoffice_html"] = html_t
                html_template_out = wrap_lo_slide_fragment_html(
                    lo_fragments[0],
                    title=f"{stem} · 第1页",
                )
                imp_lo["slide_count"] = slide_count

            svg_t_lo: Optional[str] = None
            preview_id = str(uuid.uuid4())
            vis_fields, vis_warnings = _supplement_visual_previews_from_pptx(
                pptx_path,
                root,
                soffice,
                preview_id=preview_id,
                slide_count=slide_count,
                png_zoom=float(body.png_zoom or 2.0),
            )
            if isinstance(vis_fields, dict) and vis_fields:
                imp_lo.update(vis_fields)
                if vis_fields.get("png_slide_urls") or vis_fields.get("svg_slide_urls"):
                    imp_lo["visual_persistence_version"] = max(int(imp_lo.get("visual_persistence_version") or 0), 1)
                if vis_fields.get("svg_slide_urls"):
                    imp_lo["svg_supplement"] = True
            warnings_acc.extend(vis_warnings or [])

            merge_warnings_unique(
                warnings_acc,
                collect_office_import_alignment_warnings(
                    declared_slide_count=slide_count,
                    template_contract=template_contract,
                    html_slide_fragments=imp_lo.get("html_slide_fragments")
                    if isinstance(imp_lo.get("html_slide_fragments"), list)
                    else None,
                    svg_slide_xmls=None,
                ),
            )

            return TemplateOfficeConvertResponse(
                html_template=html_template_out,
                svg_template=svg_t_lo,
                suggested_template_name=stem,
                slide_count=slide_count,
                export_engine_used="libreoffice_html",
                warnings=list(warnings or []) + warnings_acc,
                import_summary=imp_lo,
                template_contract=template_contract,
            )
        except Exception as e:
            if not body.fallback_to_svg_stack:
                raise
            warnings_acc.append(f"libreoffice_html 失败，已回退 svg_stack：{e}")

    return _convert_office_svg_stack_sync(body, suggested, warnings_acc)


@router.post("/import/convert-office-template", response_model=TemplateOfficeConvertResponse)
async def convert_office_template(
    request: TemplateOfficeConvertRequest,
    user=Depends(get_current_user_required),
):
    """Convert PPT/PPTX to html_template (+ svg_template for svg_stack) for template import."""
    del user
    try:
        return await asyncio.to_thread(_convert_office_template_sync, request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"convert-office-template failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/import/convert-pdf-template", response_model=TemplateOfficeConvertResponse)
async def convert_pdf_template(
    request: TemplatePdfConvertRequest,
    user=Depends(get_current_user_required),
):
    """Convert PDF to html_template + svg_template (PyMuPDF pages, bundled)."""
    del user
    try:
        return await asyncio.to_thread(_convert_pdf_template_sync, request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ImportError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"convert-pdf-template failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/import/office-engine-status")
async def office_engine_status(user=Depends(get_current_user_required)):
    """Lightweight health check for the LibreOffice (soffice) binary used by Office template import."""
    del user
    try:
        soffice = await asyncio.to_thread(_resolve_soffice)
        return {"available": True, "soffice_path": soffice, "error": None}
    except FileNotFoundError as e:
        return {"available": False, "soffice_path": None, "error": str(e)}
    except Exception as e:
        logger.warning("office-engine-status check failed: %s", e)
        return {"available": False, "soffice_path": None, "error": str(e)}


@router.post("/template-import/workspace", response_model=TemplateImportUploadResponse)
async def import_template_workspace(
    request: TemplateImportUploadRequest,
    user=Depends(get_current_user_required),
):
    """Build TemplateReferenceWorkspace from uploaded PPT/PPTX (LibreOffice + PyMuPDF)."""
    del user  # reserved for quotas / auditing
    try:
        importer = _template_import_service()
        ws = importer.import_from_upload(
            filename=request.filename,
            data=request.data,
            png_zoom=float(request.png_zoom or 2.0),
        )
        summary = ws.to_summary_dict()
        return TemplateImportUploadResponse(
            workspace=TemplateReferenceWorkspacePaths(
                workspace_id=summary["workspace_id"],
                root_dir=summary["root_dir"],
                pptx_path=summary["pptx_path"],
                pdf_path=summary["pdf_path"],
                manifest_path=summary["manifest_path"],
                svg_dir=str(ws.svg_dir.resolve()),
                png_dir=str(ws.png_dir.resolve()),
                slide_count=summary.get("slide_count"),
            )
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Template import failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=GlobalMasterTemplateResponse)
async def create_template(
    template_data: GlobalMasterTemplateCreate,
    user=Depends(get_current_user_required),
):
    """Create a new global master template"""
    try:
        template_service = _template_service_for_user(user)
        payload = template_data.model_dump()
        if (payload.get("created_by") or "").strip().lower() == "user":
            payload["created_by"] = f"user:{user.id}"
        result = await template_service.create_template(payload)
        return GlobalMasterTemplateResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create template: {e}")
        raise HTTPException(status_code=500, detail="Failed to create template")


@router.get("/", response_model=dict)
async def get_all_templates(
    active_only: bool = Query(True, description="Only return active templates"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    page_size: int = Query(6, ge=1, le=100, description="Number of items per page"),
    search: Optional[str] = Query(None, description="Search in template name and description"),
    user=Depends(get_current_user_required),
):
    """Get all global master templates with pagination"""
    try:
        template_service = _template_service_for_user(user)
        if tags:
            tag_list = [tag.strip() for tag in tags.split(",")]
            result = await template_service.get_templates_by_tags_paginated(
                tag_list, active_only, page, page_size, search
            )
        else:
            result = await template_service.get_all_templates_paginated(
                active_only, page, page_size, search
            )

        return {
            "templates": [GlobalMasterTemplateResponse(**template) for template in result["templates"]],
            "pagination": result["pagination"]
        }
    except Exception as e:
        logger.error(f"Failed to get templates: {e}")
        raise HTTPException(status_code=500, detail="Failed to get templates")


@router.put("/{template_id}", response_model=dict)
async def update_template(
    template_id: int,
    update_data: GlobalMasterTemplateUpdate,
    user=Depends(get_current_user_required),
):
    """Update a global master template"""
    try:
        template_service = _template_service_for_user(
            user,
            allow_system_template_write=True,
        )
        # Filter out None values
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
        
        if not update_dict:
            raise HTTPException(status_code=400, detail="No update data provided")
        
        success = await template_service.update_template(template_id, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {"success": True, "message": "Template updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update template {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update template")


@router.delete("/{template_id}", response_model=dict)
async def delete_template(template_id: int, user=Depends(get_current_user_required)):
    """Delete a global master template"""
    try:
        template_service = _template_service_for_user(
            user,
            allow_system_template_write=True,
        )
        success = await template_service.delete_template(template_id)
        if not success:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {"success": True, "message": "Template deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete template {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete template")


@router.post("/{template_id}/set-default", response_model=dict)
async def set_default_template(template_id: int, user=Depends(get_current_user_required)):
    """Set a template as the default template"""
    try:
        template_service = _template_service_for_user(
            user,
            allow_system_template_write=True,
        )
        success = await template_service.set_default_template(template_id)
        if not success:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {"success": True, "message": "Default template set successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to set default template {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to set default template")


@router.get("/default/template", response_model=GlobalMasterTemplateDetailResponse)
async def get_default_template(user=Depends(get_current_user_required)):
    """Get the default global master template"""
    try:
        template_service = _template_service_for_user(user)
        template = await template_service.get_default_template()
        if not template:
            raise HTTPException(status_code=404, detail="No default template found")
        
        return GlobalMasterTemplateDetailResponse(**template)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get default template: {e}")
        raise HTTPException(status_code=500, detail="Failed to get default template")


@router.get("/{template_id}", response_model=GlobalMasterTemplateDetailResponse)
async def get_template_by_id(template_id: int, user=Depends(get_current_user_required)):
    """Get a global master template by ID"""
    try:
        template_service = _template_service_for_user(user)
        template = await template_service.get_template_by_id(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return GlobalMasterTemplateDetailResponse(**template)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get template {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get template")


@router.post("/generate")
async def generate_template_with_ai(
    request: GlobalMasterTemplateGenerateRequest,
    user = Depends(get_current_user_required)
):
    """Generate a new template using AI (does not save to database)"""
    try:
        # Create service with user_id for proper WiseDeck provider config handling
        user_template_service = GlobalMasterTemplateService(user_id=user.id)

        # Credits/billing removed in local anonymous mode.
        
        # 准备参考图片数据
        reference_image_data = None
        if request.reference_image:
            reference_image_data = {
                "filename": request.reference_image.filename,
                "data": request.reference_image.data,
                "size": request.reference_image.size,
                "type": request.reference_image.type
            }
        reference_pptx_data = None
        if getattr(request, "reference_pptx", None):
            reference_pptx_data = {
                "filename": request.reference_pptx.filename,
                "data": request.reference_pptx.data,
                "size": request.reference_pptx.size,
                "type": request.reference_pptx.type,
            }

        workspace_hint = getattr(request, "template_workspace_id", None)

        # 使用AI生成服务（不保存到数据库）
        result = await user_template_service.generate_template_with_ai(
            prompt=request.prompt,
            template_name=request.template_name,
            description=request.description,
            tags=request.tags,
            generation_mode=request.generation_mode,
            output_format=(request.output_format or "html"),
            reference_image=reference_image_data,
            reference_pptx=reference_pptx_data,
            template_workspace_id=workspace_hint,
        )

        return {
            "success": True,
            "message": "模板生成完成！",
            "data": result
        }

    except Exception as e:
        logger.error(f"Failed to generate template with AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/save-generated", response_model=GlobalMasterTemplateResponse)
async def save_generated_template(
    request: dict,
    user=Depends(get_current_user_required),
):
    """Save a generated template after user confirmation"""
    try:
        raw_name = request.get("template_name")
        if not isinstance(raw_name, str) or not raw_name.strip():
            raise ValueError("template_name is required and must be a non-empty string")
        template_name_base = raw_name.strip()

        template_service = _template_service_for_user(user)
        ws_id = str(request.get("template_workspace_id") or "").strip()
        client_summary = request.get("import_summary")
        workspace_warnings: List[str] = []

        merged_summary: Optional[dict] = None
        workspace_svg: Optional[str] = None
        if ws_id:
            try:

                def _load_ws():
                    return template_service.build_workspace_persist_metadata(ws_id)

                meta = await asyncio.to_thread(_load_ws)
                workspace_warnings = list(meta.get("warnings") or [])
                merged_summary = meta.get("import_summary") if isinstance(meta.get("import_summary"), dict) else None
                ws_svg = meta.get("svg_template")
                workspace_svg = ws_svg if isinstance(ws_svg, str) and ws_svg.strip() else None
            except ValueError as ve:
                workspace_warnings.append(str(ve))

        if isinstance(client_summary, dict) and client_summary:
            if merged_summary is None:
                merged_summary = dict(client_summary)
            else:
                merged_summary = {**merged_summary, **client_summary}

        svg_from_client = request.get("svg_template")
        svg_pick = workspace_svg if workspace_svg else (
            svg_from_client if isinstance(svg_from_client, str) and svg_from_client.strip() else None
        )

        # Extract template data from request
        template_data = {
            'template_name': template_name_base,
            'description': request.get('description', ''),
            'html_template': request.get('html_template'),
            'svg_template': svg_pick,
            'tags': request.get('tags', []),
            'created_by': 'AI'
        }
        if merged_summary:
            template_data["import_summary"] = merged_summary

        # Add timestamp to avoid name conflicts
        import time
        timestamp = int(time.time())
        template_data['template_name'] = f"{template_name_base}_{timestamp}"

        result = await template_service.create_template(template_data)
        resp = GlobalMasterTemplateResponse(**result)
        if workspace_warnings:
            # surfaced via detail extension — FastAPI response_model strips extras;
            # log for ops; optional: return custom JSONResponse with warnings
            logger.info("save-generated workspace warnings: %s", workspace_warnings)
        return resp
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to save generated template: {e}")
        raise HTTPException(status_code=500, detail="Failed to save template")


@router.post("/adjust-template")
async def adjust_template(
    payload: dict,
    user=Depends(get_current_user_required),
    http_request: Request = None,
):
    """Adjust a generated template based on user feedback"""
    from fastapi.responses import StreamingResponse
    import json

    user_template_service = GlobalMasterTemplateService(user_id=user.id)

    template_data = payload.get("template_data") or {}
    current_html = (
        payload.get("html_template")
        or template_data.get("html_template")
        or template_data.get("html")
    )
    adjustment_request = (
        payload.get("adjustment_request")
        or payload.get("adjustment")
        or template_data.get("adjustment_request")
    )
    template_name = (
        payload.get("template_name")
        or template_data.get("template_name")
        or "模板"
    )

    # Decide response mode:
    # - SSE when the client explicitly asks (`Accept: text/event-stream`) or `stream=true`.
    accept = ((http_request.headers.get("accept") if http_request else "") or "").lower()
    stream_flag = payload.get("stream")
    want_stream = ("text/event-stream" in accept) or bool(stream_flag)

    if not (isinstance(current_html, str) and current_html.strip()):
        if want_stream:
            async def _err():
                yield f"data: {json.dumps({'type': 'error', 'message': 'html_template is required'})}\n\n"
            return StreamingResponse(_err(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"})
        raise HTTPException(status_code=400, detail="html_template is required")

    if not (isinstance(adjustment_request, str) and adjustment_request.strip()):
        if want_stream:
            async def _err():
                yield f"data: {json.dumps({'type': 'error', 'message': 'adjustment_request is required'})}\n\n"
            return StreamingResponse(_err(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"})
        raise HTTPException(status_code=400, detail="adjustment_request is required")

    # Credits/billing removed in local anonymous mode.

    if want_stream:
        async def adjust_stream():
            try:
                # Send initial status
                yield f"data: {json.dumps({'type': 'status', 'message': '正在分析调整需求...'})}\n\n"

                async for chunk in user_template_service.adjust_template_with_ai_stream(
                    current_html=current_html,
                    adjustment_request=adjustment_request,
                    template_name=template_name,
                ):
                    yield f"data: {json.dumps(chunk)}\n\n"

            except Exception as e:
                logger.error(f"Failed to adjust template: {e}")
                yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

        return StreamingResponse(
            adjust_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        )

    # Default: return JSON (more compatible with `apiClient` callers).
    complete_event = None
    async for chunk in user_template_service.adjust_template_with_ai_stream(
        current_html=current_html,
        adjustment_request=adjustment_request,
        template_name=template_name,
    ):
        if (chunk or {}).get("type") == "error":
            raise HTTPException(status_code=500, detail=(chunk or {}).get("message") or "Template adjustment failed")
        if (chunk or {}).get("type") == "complete" and (chunk or {}).get("html_template"):
            complete_event = chunk
            break

    if not complete_event:
        raise HTTPException(status_code=500, detail="Template adjustment failed")

    return {"success": True, "data": complete_event}


@router.post(
    "/select",
    response_model=TemplateSelectionResponse,
    deprecated=True,
    summary="Deprecated — use POST /api/projects/{project_id}/select-template",
)
async def select_template_for_project(
    request: TemplateSelectionRequest,
    user=Depends(get_current_user_required),
):
    """Select a template for PPT generation"""
    try:
        template_service = _template_service_for_user(user)
        if request.selected_template_id:
            # Get the selected template
            template = await template_service.get_template_by_id(request.selected_template_id)
            if not template:
                raise HTTPException(status_code=404, detail="Selected template not found")
            
            # Increment usage count
            await template_service.increment_template_usage(request.selected_template_id)
            
            return TemplateSelectionResponse(
                success=True,
                message="Template selected successfully",
                selected_template=GlobalMasterTemplateResponse(**template)
            )
        else:
            # Use default template
            template = await template_service.get_default_template()
            if not template:
                raise HTTPException(status_code=404, detail="No default template found")
            
            # Increment usage count
            await template_service.increment_template_usage(template['id'])
            
            return TemplateSelectionResponse(
                success=True,
                message="Default template selected",
                selected_template=GlobalMasterTemplateResponse(**template)
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to select template: {e}")
        raise HTTPException(status_code=500, detail="Failed to select template")


@router.post("/{template_id}/duplicate", response_model=GlobalMasterTemplateResponse)
async def duplicate_template(
    template_id: int,
    new_name: Optional[str] = Query(None, description="New template name (optional if JSON body provides new_name)"),
    body: Optional[DuplicateTemplateBody] = Body(None),
    user=Depends(get_current_user_required),
):
    """Duplicate an existing template"""
    try:
        resolved_name = (
            (body.new_name.strip() if body and isinstance(body.new_name, str) else "")
            or (new_name.strip() if isinstance(new_name, str) else "")
        )
        if not resolved_name:
            raise HTTPException(status_code=400, detail="new_name is required (query or JSON body)")

        template_service = _template_service_for_user(user)
        # Get the original template
        original = await template_service.get_template_by_id(template_id)
        if not original:
            raise HTTPException(status_code=404, detail="Template not found")

        orig_tags = list(original.get("tags") or [])
        dup_tags = orig_tags + (["复制"] if "复制" not in orig_tags else [])
        orig_desc = (original.get("description") or "").strip()
        desc_head = f"复制自: {original['template_name']}"
        dup_description = desc_head + (f"\n\n{orig_desc}" if orig_desc else "")

        dup_summary = (
            copy.deepcopy(original["import_summary"])
            if isinstance(original.get("import_summary"), dict)
            else original.get("import_summary")
        )
        dup_style = (
            copy.deepcopy(original["style_config"])
            if isinstance(original.get("style_config"), dict)
            else original.get("style_config")
        )

        duplicate_data = {
            "template_name": resolved_name,
            "description": dup_description,
            "html_template": original["html_template"],
            "svg_template": original.get("svg_template"),
            "preview_image": original.get("preview_image"),
            "import_summary": dup_summary,
            "style_config": dup_style,
            "tags": dup_tags,
            "created_by": "duplicate",
        }

        result = await template_service.create_template(duplicate_data)
        return GlobalMasterTemplateResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to duplicate template {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to duplicate template")


@router.get("/{template_id}/preview", response_model=dict)
async def get_template_preview(template_id: int, user=Depends(get_current_user_required)):
    """Get template preview data"""
    try:
        template_service = _template_service_for_user(user)
        template = await template_service.get_template_by_id(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {
            "id": template['id'],
            "template_name": template['template_name'],
            "preview_image": template['preview_image'],
            "html_template": template['html_template'],
            "svg_template": template.get('svg_template'),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get template preview {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get template preview")


@router.get("/{template_id}/preview-slide", response_model=dict)
async def get_template_preview_slide(
    template_id: int,
    index: int = Query(1, ge=1, description="1-based slide index"),
    user=Depends(get_current_user_required),
):
    """
    Optional: preview a specific slide for one imported template record.

    Prefers import_summary.svg_slide_xmls / import_summary.html_slide_fragments when present; otherwise falls back
    to template.svg_template/html_template.
    """
    try:
        template_service = _template_service_for_user(user)
        template = await template_service.get_template_by_id(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")

        name = template.get("template_name") or "模板"
        imp = template.get("import_summary") if isinstance(template, dict) else None
        if not isinstance(imp, dict):
            imp = {}
        slide_count = 0
        try:
            slide_count = int(imp.get("slide_count") or 0)
        except Exception:
            slide_count = 0
        if slide_count <= 0:
            tc = imp.get("template_contract")
            if isinstance(tc, dict):
                try:
                    slide_count = int(tc.get("slide_count") or 0)
                except Exception:
                    slide_count = 0

        # Try per-page SVG URLs first (best visual fidelity, loaded on demand).
        svg_urls = imp.get("svg_slide_urls")
        if isinstance(svg_urls, list) and 1 <= index <= len(svg_urls):
            svg_url = svg_urls[index - 1]
            if isinstance(svg_url, str) and svg_url.strip():
                safe_title = html_escape((name or "模板").replace("<", "").replace(">", ""))
                safe_badge = html_escape(f"{index} / {slide_count or len(svg_urls)}")
                html = f"""<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{safe_title} · 第{index}页</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {{
      margin: 0;
      padding: 16px;
      overflow: auto;
      background: #f0f0f0;
      font-family: system-ui, -apple-system, Segoe UI, sans-serif;
    }}
    .wd-stage {{
      min-height: calc(100vh - 32px);
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .wd-card {{
      position: relative;
      display: inline-block;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      border-radius: 6px;
      padding: 8px;
    }}
    .wd-card img {{
      display: block;
      max-width: min(100%, 1400px);
      max-height: calc(100vh - 64px);
      width: auto;
      height: auto;
      object-fit: contain;
    }}
    .wd-badge {{
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 12px;
      line-height: 1;
      user-select: none;
    }}
  </style>
</head>
<body>
  <div class="wd-stage">
    <div class="wd-card">
      <div class="wd-badge">{safe_badge}</div>
      <img src="{svg_url}" alt="slide {index}" />
    </div>
  </div>
</body>
</html>"""
                return {
                    "id": template["id"],
                    "template_name": name,
                    "index": index,
                    "slide_count": slide_count,
                    "source": "svg_slide_urls",
                    "svg_url": svg_url,
                    "merged_svg_url": imp.get("merged_svg_url"),
                    "html_template": html,
                    "svg_template": None,
                }

        # PNG fallback (visual-only, stable) — prefer this over LO HTML fragments for preview fidelity.
        png_urls = imp.get("png_slide_urls")
        if isinstance(png_urls, list) and 1 <= index <= len(png_urls):
            png_url = png_urls[index - 1]
            if isinstance(png_url, str) and png_url.strip():
                safe_title = html_escape((name or "模板").replace("<", "").replace(">", ""))
                safe_badge = html_escape(f"{index} / {slide_count or len(png_urls)}")
                html = f"""<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{safe_title} · 第{index}页</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {{
      margin: 0;
      padding: 16px;
      overflow: auto;
      background: #f0f0f0;
      font-family: system-ui, -apple-system, Segoe UI, sans-serif;
    }}
    .wd-stage {{
      min-height: calc(100vh - 32px);
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .wd-card {{
      position: relative;
      display: inline-block;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      border-radius: 6px;
      padding: 8px;
    }}
    .wd-card img {{
      display: block;
      max-width: min(100%, 1400px);
      max-height: calc(100vh - 64px);
      width: auto;
      height: auto;
      object-fit: contain;
    }}
    .wd-badge {{
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 12px;
      line-height: 1;
      user-select: none;
    }}
    .wd-hint {{
      margin-top: 8px;
      color: #666;
      font-size: 12px;
      text-align: center;
    }}
  </style>
</head>
<body>
  <div class="wd-stage">
    <div>
      <div class="wd-card">
        <div class="wd-badge">{safe_badge}</div>
        <img src="{png_url}" alt="slide {index}" />
      </div>
      <div class="wd-hint">提示：可用浏览器缩放（Ctrl + 鼠标滚轮 / Ctrl + +/-）查看细节</div>
    </div>
  </div>
</body>
</html>"""
                return {
                    "id": template["id"],
                    "template_name": name,
                    "index": index,
                    "slide_count": slide_count,
                    "source": "png_slide_urls",
                    "png_url": png_url,
                    "html_template": html,
                    "svg_template": None,
                    "merged_svg_url": imp.get("merged_svg_url"),
                }

        # Try LO HTML fragments (structure reference; may be less visually accurate than PNG/SVG).
        html_frags = imp.get("html_slide_fragments")
        if isinstance(html_frags, list) and 1 <= index <= len(html_frags):
            frag = html_frags[index - 1]
            if isinstance(frag, str) and frag.strip():
                return {
                    "id": template["id"],
                    "template_name": name,
                    "index": index,
                    "slide_count": slide_count,
                    "source": "html_slide_fragments",
                    "html_template": wrap_lo_slide_fragment_html(frag, title=f"{name} · 第{index}页"),
                    "svg_template": None,
                    "merged_svg_url": imp.get("merged_svg_url"),
                }

        # Try SVG per-page XML (legacy compatibility).
        svg_pages = imp.get("svg_slide_xmls")
        if isinstance(svg_pages, list) and 1 <= index <= len(svg_pages):
            svg_xml = svg_pages[index - 1]
            if isinstance(svg_xml, str) and svg_xml.strip():
                return {
                    "id": template["id"],
                    "template_name": name,
                    "index": index,
                    "slide_count": slide_count,
                    "source": "svg_slide_xmls",
                    "html_template": wrap_single_slide_html(svg_xml, template_name=f"{name} · 第{index}页"),
                    "svg_template": svg_xml,
                    "merged_svg_url": imp.get("merged_svg_url"),
                }

        # Fallback to default preview surfaces.
        return {
            "id": template["id"],
            "template_name": name,
            "index": index,
            "slide_count": slide_count,
            "source": "default",
            "html_template": template.get("html_template") or "",
            "svg_template": template.get("svg_template"),
            "merged_svg_url": imp.get("merged_svg_url"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get template preview slide {template_id}#{index}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get template preview slide")


@router.get("/{template_id}/export-native-pptx")
async def export_template_as_native_pptx(template_id: int, user=Depends(get_current_user_required)):
    """
    Export a single global master template as a native editable PPTX via SVG->DrawingML.

    This is intended as a quick template smoke export (1 slide) for validating svg_template.
    """
    from wisedeck.svg_export import render_pptx_from_svg_templates
    from wisedeck.svg_export.engine import build_slide_placeholders_from_wisedeck_contract

    try:
        template_service = _template_service_for_user(user)
        template = await template_service.get_template_by_id(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")

        svg_template = template.get("svg_template") if isinstance(template, dict) else None
        if not isinstance(svg_template, str) or not svg_template.strip():
            raise HTTPException(status_code=400, detail="Template has no svg_template")

        slide_ph = build_slide_placeholders_from_wisedeck_contract(
            page_title="模板预览",
            page_content="SVG 原生导出单页预览正文。",
            page_num=1,
            total_pages=1,
            deck_title="模板预览",
            subtitle="",
        )
        pptx_bytes = render_pptx_from_svg_templates(
            svg_xmls=[svg_template],
            slide_placeholders=[slide_ph],
            spec_lock=None,
            canvas_format=None,
            native_shapes=True,
            quiet=True,
        )

        safe_name = (template.get("template_name") or "template").strip()
        safe_name = "".join(ch for ch in safe_name if ch not in '\\/:*?"<>|')[:80] or "template"
        return Response(
            content=pptx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={
                "Content-Disposition": f'attachment; filename="{safe_name}_native.pptx"',
                "X-Export-Method": "WiseDeck-Template-SVG-Native",
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to export native pptx for template {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to export native pptx")


@router.post(
    "/{template_id}/increment-usage",
    response_model=dict,
    deprecated=True,
    summary="Deprecated — usage is incremented via template selection flows",
)
async def increment_template_usage(template_id: int, user=Depends(get_current_user_required)):
    """Increment template usage count (legacy HTTP shim; prefer selection endpoints)."""
    try:
        template_service = _template_service_for_user(user)
        success = await template_service.increment_template_usage(template_id)
        if not success:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {"success": True, "message": "Usage count incremented"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to increment usage for template {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to increment usage count")
