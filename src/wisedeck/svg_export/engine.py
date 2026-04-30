from __future__ import annotations

import tempfile
from pathlib import Path
from typing import Any, Mapping, Sequence

from .errors import (
    SVGConversionError,
    SVGFinalizeError,
    SVGQualityGateError,
)
from .placeholder_adapter import fill_svg_placeholders
from .ppt_master_import import import_ppt_master_module


def render_pptx_from_svg_templates(
    *,
    svg_xmls: Sequence[str],
    slide_placeholders: Sequence[Mapping[str, str]] | None = None,
    spec_lock: str | None = None,
    canvas_format: str | None = None,
    native_shapes: bool = True,
    finalize_options: Mapping[str, bool] | None = None,
    quiet: bool = True,
) -> bytes:
    """
    Render a native editable PPTX from SVG templates via ppt-master code.

    Implementation note:
    - Current ppt-master implementation is file-system oriented (project_dir/svg_output).
      We bridge via a temporary project directory.
    """
    if not svg_xmls:
        raise SVGConversionError("svg_xmls is empty")

    if slide_placeholders is not None and len(slide_placeholders) != len(svg_xmls):
        raise SVGConversionError("slide_placeholders length must match svg_xmls length")

    with tempfile.TemporaryDirectory(prefix="wd_svg_native_") as tmp:
        project_dir = Path(tmp)
        svg_output = project_dir / "svg_output"
        svg_output.mkdir(parents=True, exist_ok=True)

        # 1) Write inputs to svg_output/
        svg_paths: list[Path] = []
        for i, raw_svg in enumerate(svg_xmls, start=1):
            svg_text = str(raw_svg or "")
            if slide_placeholders is not None:
                svg_text = fill_svg_placeholders(svg_text, slide_placeholders[i - 1], strict=True)
            p = svg_output / f"{i:02d}.svg"
            p.write_text(svg_text, encoding="utf-8")
            svg_paths.append(p)

        # 2) Optional: spec_lock.md for drift check
        if isinstance(spec_lock, str) and spec_lock.strip():
            (project_dir / "spec_lock.md").write_text(spec_lock, encoding="utf-8")

        # 3) Quality gate
        try:
            mod = import_ppt_master_module("svg_quality_checker")
            checker = mod.SVGQualityChecker()
            results = checker.check_directory(str(project_dir), expected_format=canvas_format)
            errors = []
            for r in results or []:
                errors.extend((r or {}).get("errors") or [])
            if errors:
                raise SVGQualityGateError("SVG quality gate failed: " + "; ".join(errors[:6]))
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
                opts.update({k: bool(v) for k, v in dict(finalize_options).items()})
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
) -> dict[str, str]:
    """
    Helper for callers: provide the minimal ppt-master placeholder mapping per slide.

    This intentionally matches the strict ppt-master contract used in `TemplatePrompts`.
    """
    return {
        "PAGE_TITLE": str(page_title or ""),
        "CONTENT_AREA": str(page_content or ""),
        "PAGE_NUM": str(page_num),
        # TOTAL_PAGE_COUNT is not in the canonical ppt-master set; omit on purpose.
    }

