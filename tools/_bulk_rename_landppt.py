"""One-off bulk text replace after renaming src/landppt -> src/wisedeck. Not for general use."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
SKIP_DIRS = {
    ".venv",
    "node_modules",
    ".git",
    "__pycache__",
    ".next",
    ".pytest_cache",
    "render-service",
}
SKIP_FILES = {"_bulk_rename_landppt.py", "uv.lock"}


def should_process(p: pathlib.Path) -> bool:
    if any(x in p.parts for x in SKIP_DIRS):
        return False
    if p.name in SKIP_FILES:
        return False
    suf = p.suffix.lower()
    if suf in (
        ".py",
        ".toml",
        ".yml",
        ".yaml",
        ".md",
        ".sh",
        ".js",
        ".html",
        ".tsx",
        ".ts",
        ".json",
        ".example",
    ):
        return True
    if p.name in ("Dockerfile", "docker-healthcheck.sh", "docker-entrypoint.sh", "run.py", "check.py"):
        return True
    return False


def main() -> None:
    for path in ROOT.rglob("*"):
        if not path.is_file() or not should_process(path):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        orig = text
        text = text.replace("from landppt.", "from wisedeck.")
        text = text.replace("import landppt.", "import wisedeck.")
        text = text.replace("src.landppt.", "src.wisedeck.")
        text = text.replace("'landppt.", "'wisedeck.")
        text = text.replace('"landppt.', '"wisedeck.')
        text = text.replace("/api/landppt/", "/api/wisedeck/")
        text = text.replace("window.landpptEditorConfig", "window.wisedeckEditorConfig")
        text = text.replace("landppt_data:", "wisedeck_data:")
        text = text.replace("landppt_uploads:", "wisedeck_uploads:")
        text = text.replace("landppt_reports:", "wisedeck_reports:")
        text = text.replace("landppt_cache:", "wisedeck_cache:")
        text = text.replace("landppt_lib:", "wisedeck_lib:")
        text = text.replace("landppt_network", "wisedeck_network")
        text = text.replace("container_name: landppt", "container_name: wisedeck")
        text = text.replace("container_name: landppt-postgres", "container_name: wisedeck-postgres")
        text = text.replace("landppt:", "wisedeck:")
        # docker-compose service id (first occurrence per line handled by replace)
        text = text.replace("\n  landppt:\n", "\n  wisedeck:\n")
        text = text.replace("landppt_db", "wisedeck_db")
        text = text.replace("depends_on:\n\n      postgres:", "depends_on:\n\n      postgres:")  # no-op
        if text != orig:
            path.write_text(text, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
