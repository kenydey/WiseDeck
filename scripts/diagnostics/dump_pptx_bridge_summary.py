#!/usr/bin/env python3
"""
Offline summary of pptx_bytes_to_pptist_slides output (pptxtojson via Node).

Usage (from repo root):
  python scripts/diagnostics/dump_pptx_bridge_summary.py path/to/file.pptx

Requires: Node + pptxtojson under src/PPTist/node_modules (same as production bridge).

Browser parity (merged PPTX = SSOT for pptx_bridge seed vs toolbar export):
  Set localStorage WISEDECK_PPTX_BRIDGE_DIAG=1, run 「同步矢量」或打开完整编辑：控制台打印 merged Blob 的 SHA-256
  与字节大小；同一会话内用工具栏「客户端导出 + 合并可编辑图表」下载的 .pptx 应对齐同一哈希（稿不变时）。
  Iframe postMessage 体积：URL ?wisedeck_diag=1 或 localStorage WISEDECK_FULL_EDITOR_DIAG=1。
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def _repo_src() -> Path:
    return Path(__file__).resolve().parents[2] / "src"


def _ensure_import_path() -> None:
    src = _repo_src()
    if str(src) not in sys.path:
        sys.path.insert(0, str(src))


def _norm_text(content: object) -> str:
    if not isinstance(content, str):
        return ""
    s = content.strip()
    if s in ("", "<p></p>", "<p><br></p>"):
        return ""
    return s


def _summarize_elements(elements: object) -> dict[str, int]:
    out = {
        "elements_total": 0,
        "text_nonempty": 0,
        "text_empty": 0,
        "image_src_nonempty": 0,
        "image_src_empty": 0,
        "other": 0,
    }
    if not isinstance(elements, list):
        return out
    out["elements_total"] = len(elements)
    for el in elements:
        if not isinstance(el, dict):
            out["other"] += 1
            continue
        et = el.get("type")
        if et == "text":
            if _norm_text(el.get("content")):
                out["text_nonempty"] += 1
            else:
                out["text_empty"] += 1
        elif et == "image":
            src = el.get("src")
            if isinstance(src, str) and src.strip():
                out["image_src_nonempty"] += 1
            else:
                out["image_src_empty"] += 1
        else:
            out["other"] += 1
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Summarize PPTX → pptx_roundtrip_bridge slides.")
    parser.add_argument("pptx_path", type=Path, help="Path to .pptx file")
    parser.add_argument(
        "--json-out",
        type=Path,
        default=None,
        help="Optional path to write full slides JSON (large if base64 images)",
    )
    args = parser.parse_args()

    pptx_path = args.pptx_path.resolve()
    if not pptx_path.is_file():
        print(f"ERROR: not a file: {pptx_path}", file=sys.stderr)
        return 1
    if pptx_path.suffix.lower() != ".pptx":
        print("WARN: file extension is not .pptx", file=sys.stderr)

    raw_bytes = pptx_path.read_bytes()
    print(f"File: {pptx_path}")
    print(f"PPTX bytes: {len(raw_bytes)}")

    _ensure_import_path()
    try:
        from wisedeck.services.slide.pptx_roundtrip_bridge import pptx_bytes_to_pptist_slides
    except ImportError as e:
        print(f"ERROR: cannot import pptx_roundtrip_bridge: {e}", file=sys.stderr)
        return 2

    try:
        slides, meta = pptx_bytes_to_pptist_slides(raw_bytes, fixed_viewport=True)
    except Exception as e:
        print(f"ERROR: pptx_bytes_to_pptist_slides failed: {e}", file=sys.stderr)
        return 3

    print(f"Slides parsed: {len(slides)}")
    print(f"Meta: {json.dumps(meta, ensure_ascii=False, default=str)[:500]}")

    agg = {
        "elements_total": 0,
        "text_nonempty": 0,
        "text_empty": 0,
        "image_src_nonempty": 0,
        "image_src_empty": 0,
        "other": 0,
    }
    for i, slide in enumerate(slides):
        if not isinstance(slide, dict):
            print(f"  slide[{i}]: non-dict, skip")
            continue
        els = slide.get("elements")
        st = _summarize_elements(els)
        for k in agg:
            agg[k] += st[k]
        remark = (slide.get("remark") or "")[:60]
        print(
            f"  slide[{i + 1:02d}] elements={st['elements_total']} "
            f"text_nonempty={st['text_nonempty']} text_empty={st['text_empty']} "
            f"img_ok={st['image_src_nonempty']} img_empty={st['image_src_empty']} "
            f"other={st['other']} remark={remark!r}"
        )

    print("AGGREGATE:", json.dumps(agg, ensure_ascii=False))

    if args.json_out:
        payload = {"meta": meta, "slides": slides}
        args.json_out.parent.mkdir(parents=True, exist_ok=True)
        args.json_out.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        print(f"Wrote JSON: {args.json_out.resolve()} (may be large)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
