"""
Office-free template import: PPT/PPTX → PDF (LibreOffice) → page SVG/PNG (PyMuPDF) + structured manifest (python-pptx).

Does not use PowerPoint COM. Requires LibreOffice `soffice` on PATH or `WISEDECK_SOFFICE_PATH`.
"""

from __future__ import annotations

import base64
import json
import logging
import os
import shutil
import subprocess
import tempfile
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

logger = logging.getLogger(__name__)


def _decode_uploaded_base64_file(raw_data: str) -> bytes:
    if not raw_data or not isinstance(raw_data, str):
        raise ValueError("上传文件数据为空")

    data_str = raw_data.strip()
    if data_str.startswith("data:"):
        comma_index = data_str.find(",")
        if comma_index < 0:
            raise ValueError("上传文件数据格式无效")
        data_str = data_str[comma_index + 1 :]

    try:
        return base64.b64decode(data_str, validate=False)
    except Exception as e:
        raise ValueError(f"上传文件Base64解码失败: {e}") from e


def _which(cmd: str) -> Optional[str]:
    path = shutil.which(cmd)
    return path


def _resolve_soffice() -> str:
    env_path = (os.getenv("WISEDECK_SOFFICE_PATH") or "").strip().strip('"')
    if env_path:
        p = Path(env_path)
        if p.is_file():
            return str(p.resolve())
        raise FileNotFoundError(
            f"WISEDECK_SOFFICE_PATH 指向的文件不存在: {env_path}"
        )

    for candidate in ("soffice", "soffice.exe"):
        found = _which(candidate)
        if found:
            return found

    raise FileNotFoundError(
        "未找到 LibreOffice（soffice）。请安装 LibreOffice 或设置环境变量 WISEDECK_SOFFICE_PATH。"
    )


def _run_soffice_convert(soffice: str, src_path: Path, out_dir: Path, target_ext: str) -> Path:
    """
    Convert src to target_ext (e.g. pdf, pptx) into out_dir. Returns output path.
    LibreOffice names output based on stem of src.
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    cmd = [
        soffice,
        "--headless",
        "--nologo",
        "--nofirststartwizard",
        "--norestore",
        "--convert-to",
        target_ext,
        "--outdir",
        str(out_dir),
        str(src_path),
    ]
    logger.info("Running LibreOffice: %s", " ".join(cmd))
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    if proc.returncode != 0:
        stderr = (proc.stderr or "").strip()
        stdout = (proc.stdout or "").strip()
        raise RuntimeError(
            f"LibreOffice 转换失败 (exit={proc.returncode}): {stderr or stdout or 'no output'}"
        )

    expected = out_dir / f"{src_path.stem}.{target_ext}"
    if expected.is_file():
        return expected

    matches = sorted(out_dir.glob(f"*.{target_ext}"))
    if matches:
        return matches[-1]

    raise FileNotFoundError(
        f"LibreOffice 未生成预期的 {target_ext} 文件: {expected}"
    )


def materialize_office_upload_to_pptx(
    *,
    filename: str,
    data: str,
    cache_root: Optional[Path] = None,
) -> tuple[Path, Path, str]:
    """
    Decode upload and normalize to .pptx on disk. Returns (pptx_path, workspace_root, safe_filename).

    Used when only LibreOffice HTML export is needed (skips PDF/SVG rasterization).
    """
    raw_bytes = _decode_uploaded_base64_file(data)
    if not raw_bytes:
        raise ValueError("上传文件为空")

    lower = (filename or "").lower()
    if not (lower.endswith(".pptx") or lower.endswith(".ppt")):
        raise ValueError("仅支持上传 .ppt 或 .pptx 模板文件")

    if len(raw_bytes) > 50 * 1024 * 1024:
        raise ValueError("演示文稿过大，请控制在 50MB 以内")

    env_root = (os.getenv("WISEDECK_TEMPLATE_IMPORT_CACHE") or "").strip()
    if cache_root is not None:
        root_base = Path(cache_root)
    elif env_root:
        root_base = Path(env_root)
    else:
        root_base = Path(os.getcwd()) / "temp" / "templates_cache" / "template_import"

    workspace_id = str(uuid.uuid4())
    root = root_base / workspace_id
    root.mkdir(parents=True, exist_ok=True)

    src_ext = ".pptx" if lower.endswith(".pptx") else ".ppt"
    safe_name = Path(filename or "upload").name.replace("\x00", "")
    raw_path = root / f"source{src_ext}"
    raw_path.write_bytes(raw_bytes)

    soffice = _resolve_soffice()

    pptx_path = raw_path
    if src_ext == ".ppt":
        conv_dir = root / "convert_ppt"
        pptx_path = _run_soffice_convert(soffice, raw_path, conv_dir, "pptx")

    return pptx_path, root, safe_name


def _pdf_to_page_assets(pdf_path: Path, svg_dir: Path, png_dir: Path, png_zoom: float = 2.0) -> Dict[str, Any]:
    try:
        import fitz  # PyMuPDF
    except ImportError as e:
        raise ImportError(
            "当前环境未安装 PyMuPDF（import 名 fitz）。请在依赖中加入 pymupdf。"
        ) from e

    svg_dir.mkdir(parents=True, exist_ok=True)
    png_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(pdf_path))
    page_count = doc.page_count
    svg_paths: List[str] = []
    png_paths: List[str] = []

    try:
        for i in range(page_count):
            page = doc.load_page(i)
            slide_no = i + 1

            svg_text = page.get_svg_image()
            svg_file = svg_dir / f"slide_{slide_no:02d}.svg"
            svg_file.write_text(svg_text, encoding="utf-8")
            svg_paths.append(str(svg_file.resolve()))

            mat = fitz.Matrix(png_zoom, png_zoom)
            pix = page.get_pixmap(matrix=mat, alpha=False)
            png_file = png_dir / f"slide_{slide_no:02d}.png"
            pix.save(str(png_file))
            png_paths.append(str(png_file.resolve()))
    finally:
        doc.close()

    return {
        "page_count": page_count,
        "svg_paths": svg_paths,
        "png_paths": png_paths,
        "png_zoom": png_zoom,
    }


@dataclass
class TemplateReferenceWorkspace:
    workspace_id: str
    root_dir: Path
    source_filename: str
    pptx_path: Path
    pdf_path: Path
    manifest_path: Path
    svg_dir: Path
    png_dir: Path
    manifest: Dict[str, Any] = field(default_factory=dict)

    def to_summary_dict(self) -> Dict[str, Any]:
        rel = lambda p: str(Path(p).resolve())  # noqa: E731
        return {
            "workspace_id": self.workspace_id,
            "root_dir": rel(self.root_dir),
            "source_filename": self.source_filename,
            "pptx_path": rel(self.pptx_path),
            "pdf_path": rel(self.pdf_path),
            "manifest_path": rel(self.manifest_path),
            "svg_dir": rel(self.svg_dir),
            "png_dir": rel(self.png_dir),
            "slide_count": (self.manifest.get("slide_assets") or {}).get("page_count")
            or self.manifest.get("python_pptx", {}).get("slide_count"),
        }


class TemplateImportService:
    """Import PPT/PPTX into a TemplateReferenceWorkspace on disk."""

    def __init__(
        self,
        *,
        cache_root: Optional[Path] = None,
        extract_fn: Optional[Callable[[Dict[str, Any]], Dict[str, Any]]] = None,
    ):
        env_root = (os.getenv("WISEDECK_TEMPLATE_IMPORT_CACHE") or "").strip()
        if cache_root is not None:
            root = cache_root
        elif env_root:
            root = Path(env_root)
        else:
            root = Path(os.getcwd()) / "temp" / "templates_cache" / "template_import"
        self.cache_root = Path(root)
        self._extract_fn = extract_fn

    def import_from_upload(
        self,
        *,
        filename: str,
        data: str,
        png_zoom: float = 2.0,
    ) -> TemplateReferenceWorkspace:
        raw_bytes = _decode_uploaded_base64_file(data)
        if not raw_bytes:
            raise ValueError("上传文件为空")

        lower = (filename or "").lower()
        if not (lower.endswith(".pptx") or lower.endswith(".ppt")):
            raise ValueError("仅支持上传 .ppt 或 .pptx 模板文件")

        if len(raw_bytes) > 50 * 1024 * 1024:
            raise ValueError("演示文稿过大，请控制在 50MB 以内")

        workspace_id = str(uuid.uuid4())
        root = self.cache_root / workspace_id
        root.mkdir(parents=True, exist_ok=True)

        src_ext = ".pptx" if lower.endswith(".pptx") else ".ppt"
        safe_name = Path(filename or "upload").name.replace("\x00", "")
        raw_path = root / f"source{src_ext}"
        raw_path.write_bytes(raw_bytes)

        soffice = _resolve_soffice()

        pptx_path = raw_path
        if src_ext == ".ppt":
            conv_dir = root / "convert_ppt"
            pptx_path = _run_soffice_convert(soffice, raw_path, conv_dir, "pptx")

        pdf_dir = root / "pdf"
        pdf_path = _run_soffice_convert(soffice, pptx_path, pdf_dir, "pdf")

        svg_dir = root / "svg"
        png_dir = root / "png"
        slide_assets = _pdf_to_page_assets(pdf_path, svg_dir, png_dir, png_zoom=png_zoom)

        manifest_path = root / "manifest.json"
        pptx_meta: Dict[str, Any] = {}
        if self._extract_fn:
            try:
                pptx_meta = self._extract_fn(
                    {
                        "filename": safe_name if lower.endswith(".pptx") else f"{Path(safe_name).stem}.pptx",
                        "data": base64.b64encode(pptx_path.read_bytes()).decode("ascii"),
                        "size": pptx_path.stat().st_size,
                        "type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    }
                )
            except Exception as e:
                logger.warning("python-pptx manifest extraction failed: %s", e)
                pptx_meta = {"error": str(e)}

        from wisedeck.services.template.pptx_slide_layout_hints import extract_pptx_layout_hints
        from wisedeck.services.template.svg_template_import_meta import (
            guess_canvas_format_from_svg,
            scan_svg_dir_placeholder_markers,
        )
        from wisedeck.services.template.template_office_svg_placeholder_inject import (
            inject_placeholders_into_workspace_svgs,
        )

        pptx_layout_hints: Dict[str, Any] = {}
        try:
            pptx_layout_hints = extract_pptx_layout_hints(pptx_path.read_bytes())
        except Exception as e:
            logger.warning("extract_pptx_layout_hints failed: %s", e)
            pptx_layout_hints = {"schema_version": 1, "error": str(e)[:200], "slides": []}

        inject_placeholders_into_workspace_svgs(svg_dir, pptx_layout_hints)

        per_slide_markers = scan_svg_dir_placeholder_markers(svg_dir)
        first_svg = ""
        try:
            paths0 = sorted(svg_dir.glob("slide_*.svg"))
            if paths0:
                first_svg = paths0[0].read_text(encoding="utf-8", errors="replace")
        except OSError:
            first_svg = ""

        manifest: Dict[str, Any] = {
            "workspace_id": workspace_id,
            "source_filename": safe_name,
            "libreoffice": {"soffice": soffice},
            "paths": {
                "root": str(root.resolve()),
                "pptx": str(pptx_path.resolve()),
                "pdf": str(pdf_path.resolve()),
                "manifest": str(manifest_path.resolve()),
                "svg_dir": str(svg_dir.resolve()),
                "png_dir": str(png_dir.resolve()),
            },
            "slide_assets": slide_assets,
            "python_pptx": pptx_meta,
            "pptx_layout": pptx_layout_hints,
            "svg_native_meta": {
                "placeholder_markers": per_slide_markers,
                "canvas_format_guess": guess_canvas_format_from_svg(first_svg),
            },
        }

        try:
            from wisedeck.services.template.pptx_readable_contract import wrap_and_cap_pptx_readable
            from wisedeck.services.template.pptx_readable_placeholders import (
                build_pptx_readable_summary_for_manifest,
            )
            from wisedeck.services.template.pptx_readable_runner import parse_pptx_to_readable_json

            raw_readable = parse_pptx_to_readable_json(pptx_path)
            pptx_readable = wrap_and_cap_pptx_readable(raw_readable)
            manifest["pptx_readable"] = pptx_readable
            manifest["pptx_readable_summary"] = build_pptx_readable_summary_for_manifest(pptx_readable)
        except Exception as readable_err:
            logger.warning("pptx_readable pipeline skipped: %s", readable_err)
            manifest["pptx_readable"] = {"schema_version": 1, "error": str(readable_err)[:300]}
            manifest["pptx_readable_summary"] = {}

        from wisedeck.services.layout_package.manifest import (
            enrich_template_manifest_with_layout_package,
            overlay_layout_package_with_pptx_readable,
        )

        page_ct = 0
        try:
            page_ct = int((slide_assets or {}).get("page_count") or 0)
        except (TypeError, ValueError):
            page_ct = 0
        manifest = enrich_template_manifest_with_layout_package(
            manifest,
            workspace_id=workspace_id,
            slide_count=page_ct,
            source="template_import",
        )
        manifest = overlay_layout_package_with_pptx_readable(manifest)

        manifest_path.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        return TemplateReferenceWorkspace(
            workspace_id=workspace_id,
            root_dir=root,
            source_filename=safe_name,
            pptx_path=pptx_path,
            pdf_path=pdf_path,
            manifest_path=manifest_path,
            svg_dir=svg_dir,
            png_dir=png_dir,
            manifest=manifest,
        )

    def import_pdf_from_upload(
        self,
        *,
        filename: str,
        data: str,
        png_zoom: float = 2.0,
    ) -> TemplateReferenceWorkspace:
        """Import PDF directly into slide SVGs + PNGs (no LibreOffice). PyMuPDF required."""
        raw_bytes = _decode_uploaded_base64_file(data)
        if not raw_bytes:
            raise ValueError("上传文件为空")

        lower = (filename or "").lower()
        if not lower.endswith(".pdf"):
            raise ValueError("仅支持上传 .pdf 模板文件")

        if len(raw_bytes) > 50 * 1024 * 1024:
            raise ValueError("PDF 过大，请控制在 50MB 以内")

        workspace_id = str(uuid.uuid4())
        root = self.cache_root / workspace_id
        root.mkdir(parents=True, exist_ok=True)

        safe_name = Path(filename or "upload.pdf").name.replace("\x00", "")
        pdf_path = root / "source.pdf"
        pdf_path.write_bytes(raw_bytes)

        svg_dir = root / "svg"
        png_dir = root / "png"
        slide_assets = _pdf_to_page_assets(pdf_path, svg_dir, png_dir, png_zoom=png_zoom)

        manifest_path = root / "manifest.json"

        from wisedeck.services.template.svg_template_import_meta import (
            guess_canvas_format_from_svg,
            scan_svg_dir_placeholder_markers,
        )

        per_slide_markers = scan_svg_dir_placeholder_markers(svg_dir)
        first_svg = ""
        try:
            paths0 = sorted(svg_dir.glob("slide_*.svg"))
            if paths0:
                first_svg = paths0[0].read_text(encoding="utf-8", errors="replace")
        except OSError:
            first_svg = ""

        manifest: Dict[str, Any] = {
            "workspace_id": workspace_id,
            "source_filename": safe_name,
            "source_kind": "pdf",
            "paths": {
                "root": str(root.resolve()),
                "pptx": str(pdf_path.resolve()),
                "pdf": str(pdf_path.resolve()),
                "manifest": str(manifest_path.resolve()),
                "svg_dir": str(svg_dir.resolve()),
                "png_dir": str(png_dir.resolve()),
            },
            "slide_assets": slide_assets,
            "python_pptx": {},
            "pptx_layout": {"schema_version": 1, "slides": [], "source": "pdf_upload"},
            "svg_native_meta": {
                "placeholder_markers": per_slide_markers,
                "canvas_format_guess": guess_canvas_format_from_svg(first_svg),
            },
            "pptx_readable": {"schema_version": 1, "error": "skipped_pdf_import"},
            "pptx_readable_summary": {},
        }

        from wisedeck.services.layout_package.manifest import (
            enrich_template_manifest_with_layout_package,
            overlay_layout_package_with_pptx_readable,
        )

        page_ct = 0
        try:
            page_ct = int((slide_assets or {}).get("page_count") or 0)
        except (TypeError, ValueError):
            page_ct = 0

        manifest = enrich_template_manifest_with_layout_package(
            manifest,
            workspace_id=workspace_id,
            slide_count=page_ct,
            source="pdf_template_import",
        )
        manifest = overlay_layout_package_with_pptx_readable(manifest)

        manifest_path.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        return TemplateReferenceWorkspace(
            workspace_id=workspace_id,
            root_dir=root,
            source_filename=safe_name,
            pptx_path=pdf_path,
            pdf_path=pdf_path,
            manifest_path=manifest_path,
            svg_dir=svg_dir,
            png_dir=png_dir,
            manifest=manifest,
        )
