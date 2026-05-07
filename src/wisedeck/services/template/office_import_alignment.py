"""Consistency checks for single-record PPT/PPTX template import (slide counts and parallel payloads)."""

from __future__ import annotations

from typing import Any, List, Optional


def collect_office_import_alignment_warnings(
    *,
    declared_slide_count: int,
    template_contract: Optional[dict[str, Any]],
    html_slide_fragments: Optional[list[Any]] = None,
    svg_slide_xmls: Optional[list[Any]] = None,
) -> List[str]:
    """
    Emit human-readable warnings when deck-level counts disagree.

    Single GlobalMasterTemplate import: ``declared_slide_count`` is usually the API ``slide_count``
    (LibreOffice fragment count, svg_stack page_count, or pptx_readable slide list length).
    """
    warnings: List[str] = []
    n_decl = int(declared_slide_count or 0)
    if n_decl <= 0:
        return warnings

    tc = template_contract if isinstance(template_contract, dict) else None
    if tc:
        sigs = tc.get("per_slide_layout_signatures")
        if isinstance(sigs, list) and sigs:
            n_sig = len(sigs)
            if n_sig != n_decl:
                warnings.append(
                    f"per_slide_layout_signatures 条数 ({n_sig}) 与声明页数 slide_count={n_decl} 不一致"
                )

        pr = tc.get("pptx_readable")
        if isinstance(pr, dict) and not pr.get("error"):
            slides = pr.get("slides")
            if isinstance(slides, list) and slides:
                n_pr = len(slides)
                if n_pr != n_decl:
                    warnings.append(
                        f"pptx_readable.slides 条数 ({n_pr}) 与声明页数 slide_count={n_decl} 不一致"
                    )

        pl = tc.get("pptx_layout")
        if isinstance(pl, dict) and isinstance(pl.get("slides"), list):
            n_pl = len(pl["slides"])
            if n_pl > 0 and n_pl != n_decl:
                warnings.append(
                    f"pptx_layout.slides 条数 ({n_pl}) 与声明页数 slide_count={n_decl} 不一致"
                )

    if isinstance(html_slide_fragments, list) and html_slide_fragments:
        n_f = len(html_slide_fragments)
        if n_f != n_decl:
            warnings.append(
                f"html_slide_fragments 条数 ({n_f}) 与声明页数 slide_count={n_decl} 不一致"
            )

    if isinstance(svg_slide_xmls, list) and svg_slide_xmls:
        n_s = len(svg_slide_xmls)
        if n_s != n_decl:
            warnings.append(
                f"svg_slide_xmls 条数 ({n_s}) 与声明页数 slide_count={n_decl} 不一致"
            )

    return warnings


def merge_warnings_unique(base: List[str], extra: List[str]) -> None:
    """Append ``extra`` items onto ``base`` without duplicates (preserves order)."""
    seen = set(base)
    for w in extra:
        if not w or w in seen:
            continue
        seen.add(w)
        base.append(w)
