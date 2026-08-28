"""PPTX round-trip bridge (server-side).

Goal: approximate PPTist `useImport.ts` (pptxtojson) output so WiseDeck can
normalize/seed `slides_data` into PPTist Slide JSON.

This is intentionally minimal: it supports background, text, images, lines, shapes
well enough for regression fixtures and seeding SSOT.
"""

from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from .pptxtojson_element_normalize import normalize_pptxtojson_element


def _pptist_repo_root() -> Path:
    # src/wisedeck/services/slide/pptx_roundtrip_bridge.py -> repo root
    return Path(__file__).resolve().parents[4]


def _pptxtojson_module_dir() -> Path:
    # Prefer the cloned PPTist's node_modules
    return _pptist_repo_root() / "src" / "PPTist" / "node_modules" / "pptxtojson"


def _run_pptxtojson_parse(pptx_path: str, *, image_mode: str = "base64") -> Dict[str, Any]:
    """Run pptxtojson.parse in Node and return the JSON result."""
    mod_dir = _pptxtojson_module_dir()
    if not mod_dir.exists():
        raise RuntimeError(f"pptxtojson not found at {mod_dir}. Please run npm install in src/PPTist.")

    # Use an inline Node script to avoid maintaining extra JS files.
    script = r"""
import fs from 'node:fs';
import { parse } from 'pptxtojson/dist/index.js';

const pptxPath = process.argv.at(-2);
const imageMode = process.argv.at(-1) || 'base64';
const buf = fs.readFileSync(pptxPath);
const json = await parse(buf.buffer, { imageMode, videoMode: 'blob', audioMode: 'blob' });
process.stdout.write(JSON.stringify(json));
"""

    env = dict(**{k: v for k, v in (dict(**(subprocess.os.environ))).items()})
    # Ensure Node can resolve pptxtojson from PPTist node_modules.
    env["NODE_PATH"] = str(mod_dir.parent)

    # Windows 默认控制台编码常为 GBK；Node 写入 stdout 的是 UTF-8 JSON（体积大、含 base64）。
    # 不显式指定 encoding 时 subprocess 按 locale 解码，会 UnicodeDecodeError，stdout 读线程失败后 proc.stdout 为 None。
    proc = subprocess.run(
        ["node", "--input-type=module", "-e", script, pptx_path, image_mode],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
        env=env,
        cwd=str(mod_dir.parent),
        timeout=120,
    )
    err_tail = (proc.stderr or "")[:800]
    if proc.returncode != 0:
        raise RuntimeError(f"pptxtojson parse failed: {err_tail}")
    out = proc.stdout
    if out is None or not str(out).strip():
        raise RuntimeError(f"pptxtojson produced empty stdout; stderr: {err_tail}")
    return json.loads(out)


def _aspect_ratio(width: float, height: float) -> float:
    if not width:
        return 0.5625
    return float(height) / float(width)


def _ratio_to_viewport(pptx_width: float, *, viewport_width: float = 1000) -> float:
    if not pptx_width:
        return 96 / 72
    return float(viewport_width) / float(pptx_width)


def pptx_bytes_to_pptist_slides(pptx_bytes: bytes, *, fixed_viewport: bool = True) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Convert PPTX bytes into PPTist slides (best-effort).

    Returns (slides, meta) where meta includes viewport + theme colors.
    """
    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as f:
        f.write(pptx_bytes)
        pptx_path = f.name

    try:
        raw = _run_pptxtojson_parse(pptx_path, image_mode="base64")
    finally:
        try:
            Path(pptx_path).unlink(missing_ok=True)
        except Exception:
            pass

    return pptxtojson_raw_dict_to_pptist_slides(raw, fixed_viewport=fixed_viewport)


def pptxtojson_raw_dict_to_pptist_slides(
    raw: Dict[str, Any], *, fixed_viewport: bool = True
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Normalize output of pptxtojson.parse (browser or Node) into PPTist slide rows.

    Shared by :func:`pptx_bytes_to_pptist_slides` and the HTTP normalize endpoint used
    by the iframe browser-parse + server-normalize import bridge.
    """
    size = raw.get("size") or {}
    pptx_w = float(size.get("width") or 0)
    pptx_h = float(size.get("height") or 0)

    ratio = (96 / 72)
    viewport_width = 1000.0
    viewport_ratio = 0.5625
    if fixed_viewport and pptx_w:
        ratio = _ratio_to_viewport(pptx_w, viewport_width=viewport_width)
    else:
        viewport_width = pptx_w * ratio if pptx_w else 1000.0
        viewport_ratio = _aspect_ratio(pptx_w, pptx_h) if pptx_w and pptx_h else 0.5625

    theme_colors = raw.get("themeColors") or []

    slides_out: List[Dict[str, Any]] = []
    for s in raw.get("slides") or []:
        fill = s.get("fill") or {}
        bg_type = fill.get("type")
        bg_value = fill.get("value")
        background: Dict[str, Any] = {"type": "solid", "color": "#fff"}
        if bg_type == "image" and isinstance(bg_value, dict):
            background = {"type": "image", "image": {"src": bg_value.get("base64") or "", "size": "cover"}}
        elif bg_type == "gradient" and isinstance(bg_value, dict):
            # Best-effort mapping to PPTist Gradient
            path = bg_value.get("path")
            background = {
                "type": "gradient",
                "gradient": {
                    "type": "linear" if path == "line" else "radial",
                    "colors": [
                        {"pos": int(c.get("pos") or 0), "color": c.get("color") or "#fff"}
                        for c in (bg_value.get("colors") or [])
                    ],
                    "rotate": int(bg_value.get("rot") or 0),
                },
            }
        elif bg_type == "solid":
            background = {"type": "solid", "color": (bg_value or "#fff")}

        elements: List[Dict[str, Any]] = []
        for el in (s.get("elements") or []):
            if not isinstance(el, dict):
                continue
            left = float(el.get("left") or 0) * ratio
            top = float(el.get("top") or 0) * ratio
            width = float(el.get("width") or 1) * ratio
            height = float(el.get("height") or 1) * ratio

            normalized = normalize_pptxtojson_element(
                el,
                theme_colors=theme_colors if isinstance(theme_colors, list) else [],
                left=left,
                top=top,
                width=width,
                height=height,
                ratio=ratio,
            )
            if normalized is not None:
                elements.append(normalized)

        slides_out.append(
            {
                "id": "",  # caller may set
                "elements": elements,
                "background": background,
                "remark": s.get("note") or "",
                "notes": [],
                "animations": [],
            }
        )

    meta = {
        "viewportSize": viewport_width,
        "viewportRatio": viewport_ratio,
        "themeColors": theme_colors,
    }
    return slides_out, meta
