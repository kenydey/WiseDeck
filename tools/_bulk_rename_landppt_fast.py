from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
DIRS = [ROOT / "src" / "wisedeck", ROOT / "tests", ROOT / "skills"]
ROOT_FILES = [
    ROOT / "run.py",
    ROOT / "check.py",
    ROOT / "pyproject.toml",
    ROOT / "Dockerfile",
    ROOT / "docker-compose.yml",
    ROOT / "docker-compose-dev.yaml",
    ROOT / "STRUCTURED_EXPORT_VENDOR.md",
]
GITHUB = ROOT / ".github" / "workflows"


def repl(text: str) -> str:
    text = text.replace("from wisedeck.", "from wisedeck.")
    text = text.replace("import wisedeck.", "import wisedeck.")
    text = text.replace("src.wisedeck.", "src.wisedeck.")
    text = text.replace("'wisedeck.", "'wisedeck.")
    text = text.replace('"wisedeck.', '"wisedeck.')
    text = text.replace("/api/wisedeck/", "/api/wisedeck/")
    text = text.replace("window.wisedeckEditorConfig", "window.wisedeckEditorConfig")
    text = text.replace("\n  wisedeck:\n", "\n  wisedeck:\n")
    text = text.replace("wisedeck_data:", "wisedeck_data:")
    text = text.replace("wisedeck_uploads:", "wisedeck_uploads:")
    text = text.replace("wisedeck_reports:", "wisedeck_reports:")
    text = text.replace("wisedeck_cache:", "wisedeck_cache:")
    text = text.replace("wisedeck_lib:", "wisedeck_lib:")
    text = text.replace("wisedeck_network:", "wisedeck_network:")
    text = text.replace("container_name: wisedeck", "container_name: wisedeck")
    text = text.replace("container_name: wisedeck-postgres", "container_name: wisedeck-postgres")
    text = text.replace("LANDPPT_", "WISEDECK_")
    return text


def walk_dir(d: pathlib.Path) -> None:
    if not d.is_dir():
        return
    for path in d.rglob("*"):
        if path.is_dir() or "__pycache__" in path.parts:
            continue
        if path.suffix.lower() not in (
            ".py",
            ".html",
            ".js",
            ".md",
            ".yaml",
            ".yml",
            ".toml",
            ".json",
            ".sh",
        ):
            continue
        try:
            t = path.read_text(encoding="utf-8")
        except OSError:
            continue
        n = repl(t)
        if n != t:
            path.write_text(n, encoding="utf-8", newline="\n")


def main() -> None:
    for d in DIRS:
        walk_dir(d)
    for f in ROOT_FILES:
        if not f.is_file():
            continue
        t = f.read_text(encoding="utf-8")
        n = repl(t)
        if n != t:
            f.write_text(n, encoding="utf-8", newline="\n")
    if GITHUB.is_dir():
        walk_dir(GITHUB)


if __name__ == "__main__":
    main()
