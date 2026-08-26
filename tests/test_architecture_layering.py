"""Architecture guard: keep the dependency graph one-directional.

Allowed direction:  web/api -> services -> database, with `wisedeck.schemas`
as a shared leaf contract package.

Forbidden:
- services/* or database/* importing anything from wisedeck.api (any relative
  depth or absolute form).
"""

from __future__ import annotations

import re
from pathlib import Path

SRC_ROOT = Path(__file__).resolve().parents[1] / "src" / "wisedeck"

GUARDED_PACKAGES = ("services", "database")

# Matches:
#   from ..api.x import y   from ....api import z      (any relative depth >= 2)
#   from wisedeck.api.x import y                import wisedeck.api
_FORBIDDEN = re.compile(
    r"^\s*(?:from\s+(?:\.{2,}api|wisedeck\.api)[\s.]|import\s+wisedeck\.api\b)",
    re.MULTILINE,
)

# Relative imports must point at the wisedeck root before "api" can be reached;
# a single leading dot refers to the current package and can never reach api.
_RELATIVE_API = re.compile(r"^\s*from\s+(\.+)([A-Za-z_])", re.MULTILINE)


def _iter_py_files() -> list[Path]:
    files: list[Path] = []
    for pkg in GUARDED_PACKAGES:
        files.extend((SRC_ROOT / pkg).rglob("*.py"))
    return sorted(files)


def test_no_services_or_database_imports_from_api_layer():
    offenders: list[str] = []

    for path in _iter_py_files():
        rel = path.relative_to(SRC_ROOT)
        # depth of this module below wisedeck: services/x.py -> 1 dot pair '..'
        parts = rel.parts
        dots_to_root = len(parts)  # chars of '.' needed to reach wisedeek root

        source = path.read_text(encoding="utf-8", errors="replace")

        for match in _FORBIDDEN.finditer(source):
            line_no = source.count("\n", 0, match.start()) + 1
            offenders.append(f"{rel}:{line_no}: {match.group(0).strip()}")

        # Also catch relative imports that resolve into wisedeck.api:
        # 'from <dots>api...' where len(dots) == dots_to_root and target is api.
        for match in _RELATIVE_API.finditer(source):
            dots = len(match.group(1))
            if dots != dots_to_root:
                continue
            tail_start = match.end()
            tail = source[tail_start : tail_start + 4]
            if tail.startswith("api"):
                line_no = source.count("\n", 0, match.start()) + 1
                offenders.append(f"{rel}:{line_no}: relative import reaches api ({tail})")

    assert not offenders, (
        "Layering violation: services/database must not import wisedeck.api.\n"
        + "\n".join(offenders)
    )


def test_schemas_package_is_self_contained_leaf():
    """schemas may not import from api/services/web layers."""
    schema_files = list((SRC_ROOT / "schemas").rglob("*.py"))
    assert schema_files, "schemas package missing"

    bad = re.compile(
        r"^\s*(?:from\s+(?:\.{1,}(?:api|services|web)|wisedeck\.(?:api|services|web))[\s.]|import\s+wisedeck\.(?:api|services|web)\b)",
        re.MULTILINE,
    )
    offenders: list[str] = []
    for path in schema_files:
        source = path.read_text(encoding="utf-8", errors="replace")
        for match in bad.finditer(source):
            line_no = source.count("\n", 0, match.start()) + 1
            offenders.append(f"{path.name}:{line_no}: {match.group(0).strip()}")
    assert not offenders, "schemas must stay a leaf package:\n" + "\n".join(offenders)
