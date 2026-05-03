"""Smoke tests for scripts/api_ui_audit.py route enumeration vs Web UI corpus."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _load_audit_module():
    path = ROOT / "scripts" / "api_ui_audit.py"
    spec = importlib.util.spec_from_file_location("api_ui_audit", path)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_collect_http_routes_reasonable_cardinality():
    sys.path.insert(0, str(ROOT / "src"))
    from wisedeck.main import app

    mod = _load_audit_module()
    rows = mod.collect_http_routes(app)
    assert len(rows) >= 80
    pairs = {(r["method"], r["path"]) for r in rows}
    assert ("GET", "/health") in pairs


def test_slides_stream_registered_and_detected_in_ui():
    sys.path.insert(0, str(ROOT / "src"))
    from wisedeck.main import app

    mod = _load_audit_module()
    matrix = mod.build_matrix(app)
    row = next(r for r in matrix if r["path"].endswith("/slides/stream"))
    assert row["hit_kind"] != "none"


def test_removed_dead_single_bullet_enhance_route():
    sys.path.insert(0, str(ROOT / "src"))
    from wisedeck.main import app

    mod = _load_audit_module()
    pairs = {(r["method"], r["path"]) for r in mod.collect_http_routes(app)}
    assert ("POST", "/api/ai/enhance-bullet-point") not in pairs


def test_literal_path_matching_requires_quotes():
    mod = _load_audit_module()
    assert mod._line_matches_literal_api_path("/", 'fetch("/")') is True
    assert mod._line_matches_literal_api_path("/", "// placeholder comment") is False
    assert mod._line_matches_literal_api_path("/", 'fetch(`/dashboard`)') is False
    assert mod._line_matches_literal_api_path("/api/foo", 'fetch("/api/foo")') is True


def test_global_master_deprecated_select_remains_registered():
    sys.path.insert(0, str(ROOT / "src"))
    from wisedeck.main import app

    mod = _load_audit_module()
    matrix = mod.build_matrix(app)
    row = next(r for r in matrix if r["path"] == "/api/global-master-templates/select")
    assert row["method"] == "POST"
    assert row.get("deprecated") is True
