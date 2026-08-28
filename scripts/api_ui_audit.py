#!/usr/bin/env python3
"""
Enumerate FastAPI HTTP routes and compare against Web UI references.

Scan corpus: repo-root/src/wisedeck/web/static, repo-root/src/wisedeck/web/templates
(files: *.js, *.html).

Usage:
  uv run python scripts/api_ui_audit.py              # JSON to stdout
  uv run python scripts/api_ui_audit.py --csv       # CSV to stdout
  uv run python scripts/api_ui_audit.py --matrix-out reports/api_ui_audit_matrix.json

Does not modify the plan file; intended for repeatable CI/local audits.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import logging
import re
import sys
from pathlib import Path
from typing import Any, Iterable

_REPO_ROOT = Path(__file__).resolve().parents[1]
_WEB_STATIC = _REPO_ROOT / "src" / "wisedeck" / "web" / "static"
_WEB_TEMPLATES = _REPO_ROOT / "src" / "wisedeck" / "web" / "templates"

_UI_EXTENSIONS = {".js", ".html"}

_PARAM_RE = re.compile(r"\{[^}]+\}")

# Match FastAPI `{name}` segments against `${...}`, `{{ ... }}`, or non-whitespace URL-ish chunks.
_DYNAMIC_SEGMENT_RE = r"(?:[^\s\"'`<>]+|\$\{[^}]+\}|\{\{[^}]+\}\})"


def _bootstrap_sys_path() -> None:
    src = _REPO_ROOT / "src"
    sp = str(src)
    if sp not in sys.path:
        sys.path.insert(0, sp)


def _suppress_startup_noise() -> None:
    logging.basicConfig(level=logging.WARNING)


def repo_root() -> Path:
    return _REPO_ROOT


def collect_ui_files() -> list[Path]:
    files: list[Path] = []
    for base in (_WEB_STATIC, _WEB_TEMPLATES):
        if not base.is_dir():
            continue
        for p in base.rglob("*"):
            if p.is_file() and p.suffix.lower() in _UI_EXTENSIONS:
                files.append(p)
    return sorted(files)


def iter_ui_lines(files: Iterable[Path]) -> list[tuple[str, int, str]]:
    rows: list[tuple[str, int, str]] = []
    for fp in files:
        try:
            text = fp.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        rel = fp.relative_to(_REPO_ROOT).as_posix()
        for i, line in enumerate(text.splitlines(), start=1):
            # Minified bundles (pptist_dist assets, dom-to-pptx bundle) pack
            # megabytes into a single line; substring-matching every route
            # against them is effectively quadratic. Hand-written fetch calls
            # never approach this length.
            if len(line) > 5000:
                continue
            rows.append((rel, i, line))
    return rows


def fastapi_path_to_regex(path: str) -> re.Pattern[str]:
    parts = _PARAM_RE.split(path)
    params = _PARAM_RE.findall(path)
    buf: list[str] = []
    for i, lit in enumerate(parts):
        buf.append(re.escape(lit))
        if i < len(params):
            buf.append(_DYNAMIC_SEGMENT_RE)
    return re.compile("".join(buf))


def collect_http_routes(app: Any) -> list[dict[str, Any]]:
    from fastapi.routing import APIRoute
    from starlette.routing import Mount

    rows: list[dict[str, Any]] = []

    def walk(prefix: str, routes: list[Any]) -> None:
        for route in routes:
            if isinstance(route, APIRoute):
                full = (prefix + route.path).replace("//", "/")
                for method in sorted(route.methods):
                    if method == "HEAD":
                        continue
                    rows.append(
                        {
                            "method": method,
                            "path": full,
                            "name": route.name,
                            "deprecated": bool(getattr(route, "deprecated", False)),
                        }
                    )
            elif isinstance(route, Mount):
                mp = (prefix + route.path.rstrip("/")).replace("//", "/")
                walk(mp + "/", list(route.routes))

    walk("", list(app.routes))
    rows.sort(key=lambda r: (r["path"], r["method"]))
    return rows


def _line_matches_literal_api_path(route_path: str, line: str) -> bool:
    """Avoid naive substring hits (e.g. '/' matching '// comment'). Require quoted/path-shaped tokens."""
    if route_path in ("/", ""):
        return bool(re.search(r'fetch\s*\(\s*["\']\/["\']', line)) or bool(
            re.search(r'href\s*=\s*["\']\/["\']', line)
        )

    quoted = ('"' + route_path + '"', "'" + route_path + "'", "`" + route_path + "`")
    if any(q in line for q in quoted):
        return True

    # Long stable prefixes often appear in template literals without closure quotes on full path.
    if len(route_path) >= 24 and route_path in line:
        return True

    return False


def build_route_candidate_index(
    route_paths: list[str], ui_lines: list[tuple[str, int, str]]
) -> dict[str, list[tuple[str, int, str]]]:
    """One combined-regex pass over the corpus; returns literal-path -> candidate lines.

    Reduces matching from O(routes x corpus) to ~O(corpus). Dynamic (param)
    routes are not indexed here and keep scanning the full corpus.
    """
    literal_paths = [p for p in route_paths if "{" not in p]
    if not literal_paths:
        return {}
    combined = re.compile("|".join(re.escape(p) for p in literal_paths))
    index: dict[str, list[tuple[str, int, str]]] = {p: [] for p in literal_paths}
    for row in ui_lines:
        line = row[2]
        seen: set[str] = set()
        for m in combined.finditer(line):
            path = m.group(0)
            if path not in seen:
                seen.add(path)
                index[path].append(row)
    return index


def match_route_in_ui(
    route_path: str,
    ui_lines: list[tuple[str, int, str]],
    candidates_by_path: dict[str, list[tuple[str, int, str]]] | None = None,
) -> tuple[str, list[dict[str, Any]]]:
    """
    Returns hit_kind and evidence list (file, line, snippet).
    hit_kind: explicit_static | templated_dynamic | none

    `candidates_by_path` optionally supplies pre-indexed candidate lines for
    literal routes (see build_route_candidate_index); when absent the full
    corpus is scanned.
    """
    evidence: list[dict[str, Any]] = []

    if "{" not in route_path:
        candidates = (
            candidates_by_path.get(route_path, [])
            if candidates_by_path is not None
            else ui_lines
        )
        for rel, lineno, line in candidates:
            if _line_matches_literal_api_path(route_path, line):
                evidence.append({"file": rel, "line": lineno, "snippet": line.strip()[:240]})
        kind = "explicit_static" if evidence else "none"
        return kind, evidence[:12]

    rx = fastapi_path_to_regex(route_path)
    for rel, lineno, line in ui_lines:
        if rx.search(line):
            evidence.append({"file": rel, "line": lineno, "snippet": line.strip()[:240]})
    kind = "templated_dynamic" if evidence else "none"
    return kind, evidence[:12]


def suggest_disposition(method: str, path: str, hit_kind: str) -> str:
    if path.startswith("/v1"):
        return "exclude_openai_compat"
    if path.startswith("/api/database"):
        return "exclude_database_admin"
    if hit_kind != "none":
        return "ui_wired"

    if "/inpaint-region" in path:
        return "B_non_ui_mcp_or_tooling"
    if "/export/catalog" in path or "/drawingml-poc-status" in path or "/charts/presets-catalog" in path:
        return "B_internal_debug_catalog"
    if path.endswith("/increment-usage") and "/global-master-templates/" in path:
        return "C_redundant_usage_inline_elsewhere"
    if "/global-master-templates/select" == path or path.endswith("/global-master-templates/select"):
        return "C_redundant_use_project_select_template"

    return "review_unknown"


def build_matrix(app: Any) -> list[dict[str, Any]]:
    ui_lines = iter_ui_lines(collect_ui_files())
    routes = collect_http_routes(app)
    candidates_by_path = build_route_candidate_index(
        [row["path"] for row in routes], ui_lines
    )
    dynamic_lines = [row for row in ui_lines if "/api/" in row[2] or "fetch(" in row[2]]
    matrix: list[dict[str, Any]] = []
    for row in routes:
        path = row["path"]
        method = row["method"]
        if "{" in path:
            hit_kind, evidence = match_route_in_ui(path, dynamic_lines)
        else:
            hit_kind, evidence = match_route_in_ui(
                path, ui_lines, candidates_by_path=candidates_by_path
            )
        matrix.append(
            {
                **row,
                "hit_kind": hit_kind,
                "evidence": evidence,
                "suggested_disposition": suggest_disposition(method, path, hit_kind),
            }
        )
    return matrix


def write_csv(matrix: list[dict[str, Any]], stream: io.TextIOBase) -> None:
    fieldnames = [
        "method",
        "path",
        "deprecated",
        "hit_kind",
        "suggested_disposition",
        "evidence_files",
    ]
    w = csv.DictWriter(stream, fieldnames=fieldnames, extrasaction="ignore")
    w.writeheader()
    for row in matrix:
        ev = row.get("evidence") or []
        files = ";".join(sorted({e["file"] for e in ev}))
        w.writerow(
            {
                "method": row["method"],
                "path": row["path"],
                "deprecated": row.get("deprecated", False),
                "hit_kind": row["hit_kind"],
                "suggested_disposition": row["suggested_disposition"],
                "evidence_files": files,
            }
        )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="WiseDeck API vs Web UI audit")
    parser.add_argument("--csv", action="store_true", help="Emit CSV instead of JSON")
    parser.add_argument("--matrix-out", type=Path, help="Write full JSON matrix to this path")
    args = parser.parse_args(argv)

    _bootstrap_sys_path()
    _suppress_startup_noise()

    from wisedeck.main import app

    matrix = build_matrix(app)

    if args.matrix_out:
        args.matrix_out.parent.mkdir(parents=True, exist_ok=True)
        args.matrix_out.write_text(json.dumps(matrix, indent=2, ensure_ascii=False), encoding="utf-8")

    if args.csv:
        buf = io.StringIO()
        write_csv(matrix, buf)
        sys.stdout.write(buf.getvalue())
    else:
        sys.stdout.write(json.dumps(matrix, indent=2, ensure_ascii=False))
        sys.stdout.write("\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
