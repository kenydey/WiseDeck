from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Mapping

from .ppt_master_import import import_ppt_master_module


@dataclass
class QualityReport:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    drift_summary: dict[str, Any] | None = None


def collect_quality_report(
    *,
    project_dir: Path,
    canvas_format: str | None,
    quality_options: Mapping[str, Any] | None = None,
) -> tuple[QualityReport, list]:
    """
    Run ppt-master SVGQualityChecker on a project directory (expects svg_output/, optional spec_lock.md).

    quality_options is reserved for future ppt-master checker knobs; unknown keys are ignored.
    Returns (report, raw_results) for single check_directory call.
    """
    _ = quality_options  # reserved for checker API evolution
    mod = import_ppt_master_module("svg_quality_checker")
    checker = mod.SVGQualityChecker()
    results = list(checker.check_directory(str(project_dir), expected_format=canvas_format) or [])
    errors: list[str] = []
    warnings: list[str] = []
    drift: dict[str, Any] | None = None
    for r in results:
        if not isinstance(r, dict):
            continue
        errors.extend(r.get("errors") or [])
        warnings.extend(r.get("warnings") or [])
        if drift is None and r.get("drift") is not None:
            drift = {"raw": r.get("drift")}
    return QualityReport(errors=errors, warnings=warnings, drift_summary=drift), results
