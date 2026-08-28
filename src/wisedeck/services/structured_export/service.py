"""
Structured PPTX export: native python-pptx charts (+ SVG path).
Server-side Playwright has been removed; homomorphic screenshot modes raise at call sites.
"""

from __future__ import annotations

import logging
import os
import tempfile
import uuid
from io import BytesIO
from pathlib import Path
from typing import Any, Dict, Optional

from pptx import Presentation
from pptx.util import Inches

from wisedeck.services.structured_export.chart_mapper import deck_to_pptx_presentation_model
from wisedeck.services.structured_export._presenton.pptx_presentation_creator import (
    PptxPresentationCreator,
)
from wisedeck.services.structured_export.schemas import StructuredSlideDeckModel
from wisedeck.svg_export import render_pptx_from_svg_templates
from wisedeck.svg_export.engine import build_slide_placeholders_from_wisedeck_contract
from wisedeck.svg_export.errors import SVGExportError

logger = logging.getLogger(__name__)


_PLAYWRIGHT_REMOVED_MSG = (
    "Server-side Playwright has been removed from WiseDeck. "
    "Use the editor client export (dom-to-pptx) or structured python/svg modes instead."
)


async def export_dom_to_pptx_bytes_via_playwright(
    *,
    slides_html_url: str,
    timeout_ms: int = 180_000,
) -> bytes:
    raise RuntimeError(_PLAYWRIGHT_REMOVED_MSG)


async def screenshot_html_files_to_png_via_playwright(
    *,
    html_files: list[str],
    png_files: list[str],
    timeout_ms: int = 60_000,
) -> list[bool]:
    raise RuntimeError(_PLAYWRIGHT_REMOVED_MSG)


async def build_pptx_bytes_from_slide_html_screenshots(
    *,
    slides: list[dict[str, Any]],
    export_base_url: str,
) -> bytes:
    raise RuntimeError(_PLAYWRIGHT_REMOVED_MSG)


async def merge_native_charts_into_pptx_bytes(
    base_pptx_bytes: bytes,
    *,
    deck: StructuredSlideDeckModel,
    chart_position_override_pt: tuple[int, int, int, int] | None = None,
) -> bytes:
    """
    Merge native editable charts into an existing .pptx produced by dom-to-pptx or other sources.

    MVP behavior: for each slide index that has chart_config, append a native chart shape to that slide.
    """
    base = BytesIO(base_pptx_bytes)
    prs = Presentation(base)

    # Keep deck -> slide index mapping simple and explicit: by order (0-based).
    for idx, slide_model in enumerate(deck.slides):
        if slide_model.chart_config is None:
            continue
        if idx >= len(prs.slides):
            # Ignore out-of-range deck slides; client export may be subset or mismatch.
            continue
        native_model = deck_to_pptx_presentation_model(
            StructuredSlideDeckModel(
                title=deck.title,
                language=deck.language,
                slides=[slide_model],
            )
        )
        # Expect: [title textbox, chart] shapes; best-effort find first chart model.
        chart_shape_model = None
        for s in (native_model.slides[0].shapes or []):
            if getattr(s, "shape_type", None) == "chart":
                chart_shape_model = s
                break
        if chart_shape_model is None:
            continue
        if chart_position_override_pt is not None:
            try:
                from wisedeck.services.structured_export._presenton.pptx_models import PptxPositionModel

                left, top, width, height = chart_position_override_pt
                chart_shape_model.position = PptxPositionModel(
                    left=int(left),
                    top=int(top),
                    width=int(width),
                    height=int(height),
                )
            except Exception:
                # Best-effort override; fall back to model-provided position.
                pass
        creator = PptxPresentationCreator(native_model, "")
        creator.add_chart(prs.slides[idx], chart_shape_model)

    out = BytesIO()
    prs.save(out)
    return out.getvalue()


async def build_pptx_bytes_from_deck(deck: StructuredSlideDeckModel) -> bytes:
    """Create .pptx bytes using vendored PptxPresentationCreator (editable charts)."""
    model = deck_to_pptx_presentation_model(deck)
    tmp = tempfile.mkdtemp(prefix="wd_struct_")
    try:
        creator = PptxPresentationCreator(model, tmp)
        await creator.create_ppt()
        out = Path(tmp) / f"{uuid.uuid4().hex}.pptx"
        creator.save(str(out))
        return out.read_bytes()
    finally:
        for f in Path(tmp).glob("*"):
            try:
                f.unlink()
            except OSError:
                pass
        try:
            Path(tmp).rmdir()
        except OSError:
            pass


def _structured_pptx_measurement_source() -> str:
    """
    Control which measurement/source pipeline `mode=auto` uses.

    Values:
    - homomorphic-editable (default): Playwright screenshots from slides-html + python-pptx chart merge
    - homomorphic: explicit screenshot pipeline + chart merge (same as editable naming for auto screenshots)
    - python-only: bypass screenshots; python-pptx only (lower fidelity)
    - wisedeck-html: reserved (currently maps to python-only or screenshots when inputs exist)

    ``render-service`` is ignored with a warning (maps to homomorphic-editable).
    """
    v = (os.environ.get("WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE") or "").strip().lower()
    raw = v or "homomorphic-editable"
    if raw == "render-service":
        logger.warning(
            "WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE=render-service is obsolete; using homomorphic-editable"
        )
        return "homomorphic-editable"
    return raw


async def export_structured_pptx_via_homomorphic_html(
    deck: StructuredSlideDeckModel,
    *,
    slides_for_same_html: list[dict[str, Any]] | None,
    export_base_url: str,
) -> bytes:
    """Former Playwright screenshot + chart-merge path (removed).

    Server-side Playwright is gone; this now degrades gracefully to the
    python-only deck export instead of raising, so explicit `homomorphic`
    requests always produce a usable PPTX.
    """
    logger.warning(
        "%s Falling back to python-only deck export.",
        _PLAYWRIGHT_REMOVED_MSG,
    )
    return await build_pptx_bytes_from_deck(deck)


async def export_structured_pptx_via_homomorphic_dom_to_pptx(
    deck: StructuredSlideDeckModel,
    *,
    project_id: str,
    export_base_url: str,
) -> bytes:
    """Former server-side Playwright dom-to-pptx path (removed).

    Server-side Playwright is gone; this now degrades gracefully to the
    python-only deck export instead of raising. High-fidelity layout export is
    available in the editor client (browser dom-to-pptx + native chart merge).
    """
    _ = project_id
    _ = export_base_url
    logger.warning(
        "%s Falling back to python-only deck export.",
        _PLAYWRIGHT_REMOVED_MSG,
    )
    return await build_pptx_bytes_from_deck(deck)


def _coerce_stored_svg_slide_xmls(import_summary: dict | None) -> list[str] | None:
    if not isinstance(import_summary, dict):
        return None
    raw = import_summary.get("svg_slide_xmls")
    if not isinstance(raw, list) or not raw:
        return None
    out = [x.strip() for x in raw if isinstance(x, str) and x.strip()]
    return out or None


def _svg_native_xml_for_each_slide(
    *,
    svg_template: str,
    import_summary: dict | None,
    deck_slide_count: int,
) -> list[str]:
    pool = _coerce_stored_svg_slide_xmls(import_summary)
    if pool:
        return [pool[i % len(pool)] for i in range(deck_slide_count)]
    return [svg_template] * deck_slide_count


async def export_structured_pptx_via_svg_native(
    deck: StructuredSlideDeckModel,
    *,
    svg_template: str,
    canvas_format: str | None = None,
    spec_lock: str | None = None,
    import_summary: dict | None = None,
) -> bytes:
    """
    Native SVG/DrawingML export (ppt-master style):
    - Fill placeholders into a per-slide SVG template
    - Run svg_quality_checker + finalize_svg + svg_to_pptx (via wisedeck.svg_export)
    - Return pptx bytes

    Placeholder contract: slide HTML uses ``{{ page_title }}`` style in the editor; this path
    uses ``build_slide_placeholders_from_wisedeck_contract`` as the **only** supported bridge
    into ppt-master inner markers (PAGE_TITLE, CONTENT_AREA, …).
    """
    if not isinstance(svg_template, str) or not svg_template.strip():
        raise RuntimeError("SVG native export requires svg_template")

    if isinstance(import_summary, dict):
        stored = import_summary.get("placeholder_hash")
        if isinstance(stored, str) and stored.strip():
            from wisedeck.services.template.svg_template_import_meta import build_import_summary

            slide_pool = _coerce_stored_svg_slide_xmls(import_summary)
            current = build_import_summary(
                svg_template=svg_template,
                svg_slide_xmls=slide_pool,
                slide_count=len(deck.slides),
                bundle_mode=import_summary.get("bundle_mode"),
                source_filename=import_summary.get("source_filename"),
            ).get("placeholder_hash")
            if current and current != stored:
                logger.warning(
                    "svg_native: svg_template placeholder_hash mismatch (stored=%s current=%s)",
                    stored[:16],
                    (current or "")[:16],
                )

    svg_sequence = _svg_native_xml_for_each_slide(
        svg_template=svg_template,
        import_summary=import_summary,
        deck_slide_count=len(deck.slides),
    )

    svg_xmls: list[str] = []
    placeholders: list[dict[str, str]] = []
    total = max(1, len(deck.slides))
    deck_title = str(deck.title or "")

    for idx, slide in enumerate(deck.slides, start=1):
        svg_xmls.append(svg_sequence[idx - 1])
        # Best-effort: map structured slide into text placeholders.
        page_title = str(slide.title or "")
        # Join content points into a single text blob; template can decide how to wrap.
        points = slide.content_points or []
        if isinstance(points, list):
            page_content = "\n".join(str(p) for p in points if p)
        else:
            page_content = str(points or "")

        placeholders.append(
            build_slide_placeholders_from_wisedeck_contract(
                page_title=page_title,
                page_content=page_content,
                page_num=idx,
                total_pages=total,
                deck_title=deck_title,
                subtitle="",
            )
        )

    try:
        base_pptx = render_pptx_from_svg_templates(
            svg_xmls=svg_xmls,
            slide_placeholders=placeholders,
            spec_lock=spec_lock,
            canvas_format=canvas_format,
            native_shapes=True,
            quiet=True,
        )
        # Reuse existing chart merge (append native charts by slide index).
        raw = (os.environ.get("WISEDECK_HOMOMORPHIC_CHART_BOX_PT") or "").strip()
        override = None
        if raw:
            try:
                parts = [int(p.strip()) for p in raw.split(",") if p.strip()]
                if len(parts) == 4:
                    override = (parts[0], parts[1], parts[2], parts[3])
            except Exception:
                override = None
        if override is None:
            override = (520, 170, 420, 300)
        merged = await merge_native_charts_into_pptx_bytes(
            base_pptx,
            deck=deck,
            chart_position_override_pt=override,
        )
        return _merge_native_tables_into_pptx_bytes(merged, deck=deck)
    except SVGExportError as e:
        # Let callers decide fallback strategy (preserve error type).
        raise


def _merge_native_tables_into_pptx_bytes(pptx_bytes: bytes, *, deck: StructuredSlideDeckModel) -> bytes:
    """
    MVP: merge outline table_config as native python-pptx tables.

    Slides with `slide.table_config` (dict) will receive an editable table shape.
    Placement can be overridden with `WISEDECK_NATIVE_TABLE_BOX_PT=left,top,width,height` (pt).
    """
    raw = (os.environ.get("WISEDECK_NATIVE_TABLE_BOX_PT") or "").strip()
    box_pt = None
    if raw:
        try:
            parts = [int(p.strip()) for p in raw.split(",") if p.strip()]
            if len(parts) == 4:
                box_pt = (parts[0], parts[1], parts[2], parts[3])
        except Exception:
            box_pt = None
    if box_pt is None:
        box_pt = (80, 140, 560, 420)

    # 1 pt = 12700 EMU
    def _pt_to_emu(v: int) -> int:
        return int(v) * 12700

    prs = Presentation(BytesIO(pptx_bytes))

    for slide_idx, slide_model in enumerate(deck.slides):
        cfg = getattr(slide_model, "table_config", None)
        if not isinstance(cfg, dict) or not cfg:
            continue
        if slide_idx >= len(prs.slides):
            break

        headers = cfg.get("headers") or []
        rows = cfg.get("rows") or []
        caption = cfg.get("caption")
        html_tbl = cfg.get("html_table")
        if isinstance(html_tbl, str) and html_tbl.strip():
            from wisedeck.services.structured_export.pptx_layout_utils import parse_simple_html_table

            parsed = parse_simple_html_table(html_tbl)
            if parsed:
                if len(parsed) >= 2 and cfg.get("first_row_header", True):
                    headers = parsed[0]
                    rows = parsed[1:]
                else:
                    headers = []
                    rows = parsed

        # Determine column count.
        col_count = 0
        if isinstance(headers, list):
            col_count = max(col_count, len(headers))
        body_rows = []
        if isinstance(rows, list):
            for r in rows:
                if isinstance(r, list):
                    body_rows.append(r)
                    col_count = max(col_count, len(r))
        if col_count <= 0:
            continue

        # Guardrail for MVP: cap rows to avoid unreadable exports.
        body_rows = body_rows[:12]
        row_count = (1 if headers else 0) + max(1, len(body_rows))

        slide = prs.slides[slide_idx]
        left = _pt_to_emu(box_pt[0])
        top = _pt_to_emu(box_pt[1])
        width = _pt_to_emu(box_pt[2])
        height = _pt_to_emu(box_pt[3])

        table_shape = slide.shapes.add_table(row_count, col_count, left, top, width, height)
        table = table_shape.table

        r0 = 0
        if headers:
            for c in range(col_count):
                val = str(headers[c] or "") if c < len(headers) else ""
                table.cell(0, c).text = val
            r0 = 1

        if body_rows:
            for r_i, r in enumerate(body_rows):
                for c in range(col_count):
                    val = str(r[c] or "") if c < len(r) else ""
                    table.cell(r0 + r_i, c).text = val
        else:
            for c in range(col_count):
                table.cell(r0, c).text = ""

        if isinstance(caption, str) and caption.strip():
            try:
                tb = slide.shapes.add_textbox(left, top - _pt_to_emu(18), width, _pt_to_emu(16))
                tb.text_frame.text = caption.strip()
            except Exception:
                pass

    out = BytesIO()
    prs.save(out)
    return out.getvalue()


async def export_structured_pptx_auto(
    deck: StructuredSlideDeckModel,
    *,
    slides_for_same_html: Optional[list[dict[str, Any]]] = None,
    export_base_url: Optional[str] = None,
) -> bytes:
    """
    Default structured export for ``mode=auto`` via ``WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE``.

    Homomorphic / screenshot sources depended on Playwright (removed) and now fall back to
    ``build_pptx_bytes_from_deck`` with a warning.
    """
    _ = slides_for_same_html
    _ = export_base_url
    source = _structured_pptx_measurement_source()
    if source in (
        "homomorphic-editable",
        "homomorphic_editable",
        "homomorphic",
        "homomorphic-html",
        "homomorphic_html",
        "wisedeck-html",
    ):
        logger.warning(
            "WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE=%s relied on Playwright (removed); using python-only deck export",
            source,
        )
        return await build_pptx_bytes_from_deck(deck)
    if source in ("python-only", "python"):
        return await build_pptx_bytes_from_deck(deck)

    logger.warning("Unknown WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE=%s; using python-only", source)
    return await build_pptx_bytes_from_deck(deck)
