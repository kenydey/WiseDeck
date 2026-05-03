from __future__ import annotations

import logging
import re
import tempfile
from pathlib import Path
from typing import Any, Mapping, Sequence

from .errors import (
    SVGConversionError,
    SVGFinalizeError,
    SVGPlaceholdersError,
    SVGQualityGateError,
)
from .placeholder_adapter import fill_svg_placeholders
from .ppt_master_import import import_ppt_master_module
from .quality import collect_quality_report

logger = logging.getLogger(__name__)


def _safe_write_template_assets(project_dir: Path, template_assets: Mapping[str, bytes]) -> None:
    """Write asset bytes under project_dir/assets with path traversal guards."""
    root = project_dir / "assets"
    root.mkdir(parents=True, exist_ok=True)
    for rel, blob in dict(template_assets).items():
        if not isinstance(rel, str) or not rel.strip():
            continue
        p = (root / rel).resolve()
        try:
            p.relative_to(root.resolve())
        except ValueError as e:
            raise SVGFinalizeError(f"Invalid template_assets path: {rel!r}") from e
        p.parent.mkdir(parents=True, exist_ok=True)
        data = blob if isinstance(blob, (bytes, bytearray)) else bytes(blob)
        p.write_bytes(data)


def _page_hint_from_checker_row(row: object) -> int | None:
    if not isinstance(row, dict):
        return None
    for key in ("file", "path", "svg_path", "svg_file"):
        val = row.get(key)
        if isinstance(val, str):
            m = re.search(r"(\d+)\.svg", val, re.I)
            if m:
                return int(m.group(1))
    return None


def render_pptx_from_svg_templates(
    *,
    svg_xmls: Sequence[str],
    slide_placeholders: Sequence[Mapping[str, str]] | None = None,
    spec_lock: str | None = None,
    notes: Mapping[str, str] | None = None,
    canvas_format: str | None = None,
    native_shapes: bool = True,
    finalize_options: Mapping[str, Any] | None = None,
    quality_options: Mapping[str, Any] | None = None,
    strict_placeholder: bool = True,
    template_assets: Mapping[str, bytes] | None = None,
    quiet: bool = True,
) -> bytes:
    """
    Render a native editable PPTX from SVG templates via ppt-master code.

    Contract:
    - Editor / HTML templates use ``{{ page_title }}`` style markers; callers into this layer
      should pass ``slide_placeholders`` keyed by **inner** ppt-master names (e.g. PAGE_TITLE).
    - ``notes`` is reserved for future speaker-notes injection (currently logged at debug only).

    Implementation note:
    - Current ppt-master implementation is file-system oriented (project_dir/svg_output).
      We bridge via a temporary project directory.
    """
    if notes:
        logger.debug("render_pptx_from_svg_templates: notes= ignored (stub): %s", dict(notes))

    if not svg_xmls:
        raise SVGConversionError("svg_xmls is empty")

    if slide_placeholders is not None and len(slide_placeholders) != len(svg_xmls):
        raise SVGConversionError(
            "slide_placeholders length must match svg_xmls length",
            details=f"slides={len(svg_xmls)} placeholders={len(slide_placeholders)}",
        )

    with tempfile.TemporaryDirectory(prefix="wd_svg_native_") as tmp:
        project_dir = Path(tmp)
        svg_output = project_dir / "svg_output"
        svg_output.mkdir(parents=True, exist_ok=True)

        # 1) Write inputs to svg_output/
        svg_paths: list[Path] = []
        for i, raw_svg in enumerate(svg_xmls, start=1):
            svg_text = str(raw_svg or "")
            if slide_placeholders is not None:
                try:
                    svg_text = fill_svg_placeholders(
                        svg_text,
                        slide_placeholders[i - 1],
                        strict=strict_placeholder,
                        page_index=i,
                    )
                except SVGPlaceholdersError as e:
                    if e.page_index is None:
                        raise SVGPlaceholdersError(str(e), page_index=i, details=e.details) from e
                    raise
            p = svg_output / f"{i:02d}.svg"
            p.write_text(svg_text, encoding="utf-8")
            svg_paths.append(p)

        if template_assets:
            try:
                _safe_write_template_assets(project_dir, template_assets)
            except SVGFinalizeError:
                raise
            except Exception as e:
                raise SVGFinalizeError(f"template_assets write failed: {e}") from e

        # 2) Optional: spec_lock.md for drift check
        if isinstance(spec_lock, str) and spec_lock.strip():
            (project_dir / "spec_lock.md").write_text(spec_lock, encoding="utf-8")

        # 3) Quality gate
        try:
            report, raw_results = collect_quality_report(
                project_dir=project_dir,
                canvas_format=canvas_format,
                quality_options=quality_options,
            )
            if report.errors:
                page_guess: int | None = None
                for r in raw_results:
                    if isinstance(r, dict) and (r.get("errors") or []):
                        page_guess = _page_hint_from_checker_row(r)
                        if page_guess is not None:
                            break
                warn_txt = "; ".join(report.warnings[:8]) if report.warnings else None
                details_bits = ["; ".join(report.errors[:6])]
                if warn_txt:
                    details_bits.append("warnings=" + warn_txt)
                raise SVGQualityGateError(
                    "SVG quality gate failed: " + "; ".join(report.errors[:6]),
                    page_index=page_guess,
                    details=" | ".join(details_bits),
                )
            if report.warnings and not quiet:
                logger.info(
                    "SVG quality gate warnings (non-fatal): %s",
                    "; ".join(report.warnings[:12]),
                )
        except SVGQualityGateError:
            raise
        except Exception as e:
            raise SVGQualityGateError(f"SVG quality gate failed: {e}") from e

        # 4) Finalize SVGs (post-processing)
        try:
            finalize_svg = import_ppt_master_module("finalize_svg")
            opts = dict(
                embed_icons=True,
                crop_images=True,
                fix_aspect=True,
                embed_images=True,
                flatten_text=True,
                fix_rounded=True,
            )
            if finalize_options:
                for k, v in dict(finalize_options).items():
                    if isinstance(v, bool):
                        opts[k] = v
                    else:
                        opts[k] = v
            ok = finalize_svg.finalize_project(
                project_dir=project_dir,
                options=opts,
                dry_run=False,
                quiet=bool(quiet),
            )
            if not ok:
                raise SVGFinalizeError("finalize_project returned False")
        except SVGFinalizeError:
            raise
        except Exception as e:
            raise SVGFinalizeError(f"SVG finalize failed: {e}") from e

        # 5) Convert svg_final/*.svg -> pptx
        try:
            svg_final = project_dir / "svg_final"
            final_svgs = sorted(svg_final.glob("*.svg"))
            if not final_svgs:
                raise SVGConversionError("No SVG files found after finalize (svg_final is empty)")

            svg_to_pptx = import_ppt_master_module("svg_to_pptx")
            out_path = project_dir / "out.pptx"
            ok = svg_to_pptx.create_pptx_with_native_svg(
                svg_files=final_svgs,
                output_path=out_path,
                canvas_format=canvas_format,
                use_native_shapes=bool(native_shapes),
                verbose=not bool(quiet),
            )
            if not ok or not out_path.exists():
                raise SVGConversionError("ppt-master create_pptx_with_native_svg failed")
            return out_path.read_bytes()
        except SVGConversionError:
            raise
        except Exception as e:
            raise SVGConversionError(f"SVG->PPTX conversion failed: {e}") from e


def build_slide_placeholders_from_wisedeck_contract(
    *,
    page_title: str,
    page_content: str,
    page_num: int,
    total_pages: int,
    deck_title: str = "",
    subtitle: str = "",
) -> dict[str, str]:
    """
    Per-slide mapping for ``render_pptx_from_svg_templates`` (inner marker keys, no braces).

    Single contract for structured export: HTML/outline use ``page_title`` / ``page_content`` in
    templates; this helper is the **only** supported bridge into SVG native markers.
    """
    title = str(page_title or "")
    body = str(page_content or "")
    deck = str(deck_title or "").strip()
    sub = str(subtitle or "").strip()
    out: dict[str, str] = {
        "PAGE_TITLE": title,
        "CONTENT_AREA": body,
        "PAGE_NUM": str(page_num),
        "TITLE": deck if deck else title,
        "SUBTITLE": sub,
        "PAGE_CONTENT": body,
    }
    if total_pages > 0:
        out["TOTAL_PAGE_COUNT"] = str(total_pages)
    return out
