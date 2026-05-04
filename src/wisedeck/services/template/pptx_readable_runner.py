"""
Invoke scripts/pptxtojson-runner (Node + bundled fork) to produce pptx-readable JSON.
"""

from __future__ import annotations

import json
import logging
import os
import shutil
import subprocess
from pathlib import Path
from typing import Any, Dict

logger = logging.getLogger(__name__)


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[4]


def _node_binary() -> str:
    return (os.getenv("WISEDECK_NODE_BIN") or "").strip() or (shutil.which("node") or "")


def parse_pptx_to_readable_json(
    pptx_path: Path,
    *,
    timeout_sec: float = 180.0,
    strict: bool = False,
) -> Dict[str, Any]:
    """
    Parse .pptx via Node runner. Returns dict suitable for pptx_readable_contract.wrap_and_cap_pptx_readable.
    On failure returns {"error": "..."} only (caller wraps), unless strict=True then raises RuntimeError.
    """
    def _fail(msg: str) -> Dict[str, Any]:
        if strict:
            raise RuntimeError(f"pptx_readable required but failed: {msg}")
        return {"error": msg}

    flag = (os.getenv("WISEDECK_DISABLE_PPTX_READABLE_JSON") or "").strip().lower()
    if flag in {"1", "true", "yes", "on"}:
        return _fail("disabled_by_env")

    node = _node_binary()
    if not node:
        return _fail("node_not_found")

    run_script = _repo_root() / "scripts" / "pptxtojson-runner" / "run.mjs"
    bundle = _repo_root() / "scripts" / "pptxtojson-runner" / "bundle" / "wisedeck-pptx-parse.mjs"
    if not run_script.is_file():
        return _fail("runner_script_missing")
    if not bundle.is_file():
        return _fail("runner_bundle_missing_run_npm_build")

    pptx_path = Path(pptx_path).resolve()
    if not pptx_path.is_file():
        return _fail("pptx_path_missing")

    cwd = str(run_script.parent)
    cmd = [node, str(run_script), str(pptx_path)]
    try:
        proc = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            timeout=timeout_sec,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
    except subprocess.TimeoutExpired:
        return _fail("pptx_readable_timeout")
    except Exception as e:
        logger.warning("pptx_readable subprocess failed: %s", e)
        return _fail(str(e)[:300])

    if proc.returncode != 0:
        err = (proc.stderr or proc.stdout or "").strip()[:800]
        logger.warning("pptx_readable node exit=%s err=%s", proc.returncode, err)
        return _fail(err or f"node_exit_{proc.returncode}")

    raw = (proc.stdout or "").strip()
    if not raw:
        return _fail("empty_stdout")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        return _fail(f"json_decode:{e}"[:300])

    if not isinstance(data, dict):
        return _fail("parsed_non_object")

    return data
