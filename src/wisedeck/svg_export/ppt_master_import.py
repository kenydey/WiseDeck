from __future__ import annotations

import os
import sys
from pathlib import Path
from types import ModuleType
from typing import Optional


def _candidate_ppt_master_scripts_dir() -> Optional[Path]:
    """
    Best-effort locator for a local ppt-master clone.

    We intentionally keep this simple and environment-driven so deployments can
    vendor the code later without relying on a fixed absolute path.
    """
    env = (os.environ.get("WISEDECK_PPT_MASTER_SCRIPTS_DIR") or "").strip()
    if env:
        p = Path(env)
        if p.exists():
            return p

    # Developer default from the conversation context.
    p = Path(r"C:\dev\ppt-master-main\skills\ppt-master\scripts")
    return p if p.exists() else None


def import_ppt_master_module(module_name: str) -> ModuleType:
    """
    Import a ppt-master module (e.g. 'svg_quality_checker', 'finalize_svg', 'svg_to_pptx').
    """
    scripts_dir = _candidate_ppt_master_scripts_dir()
    if scripts_dir is None:
        raise ImportError("ppt-master scripts directory not found; set WISEDECK_PPT_MASTER_SCRIPTS_DIR")

    # Ensure scripts dir is on sys.path (ppt-master code expects absolute imports within that dir).
    s = str(scripts_dir)
    if s not in sys.path:
        sys.path.insert(0, s)

    __import__(module_name)
    return sys.modules[module_name]

