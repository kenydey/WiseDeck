"""
Historical checker for obsolete Presenton render-service env vars.

WiseDeck no longer ships or calls the Next.js ``render-service``. Structured PPTX uses
Playwright + same-origin ``slides-html`` in the FastAPI process.

Environment variables below are ignored at runtime (may still appear in old ``.env`` files):

- ``WISEDECK_RENDER_SERVICE_URL`` — obsolete
- ``WISEDECK_ALLOW_LEGACY_RENDER_SERVICE`` — obsolete (legacy modes ``render`` / ``stable``
  always alias to ``homomorphic_editable`` at the HTTP layer)

See ``STRUCTURED_EXPORT_VENDOR.md`` and ``docs/render-service-decommission.md``.
"""

from __future__ import annotations

import os


def main() -> None:
    rs_url = (os.environ.get("WISEDECK_RENDER_SERVICE_URL") or "").strip()
    legacy_flag = (os.environ.get("WISEDECK_ALLOW_LEGACY_RENDER_SERVICE") or "").strip().lower() in (
        "1",
        "true",
        "yes",
    )
    src = (os.environ.get("WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE") or "").strip().lower()

    print("obsolete_env_present:")
    print("  WISEDECK_RENDER_SERVICE_URL", bool(rs_url))
    print("  WISEDECK_ALLOW_LEGACY_RENDER_SERVICE", legacy_flag)
    print()
    print("WISEDECK_STRUCTURED_PPTX_MEASUREMENT_SOURCE", src or "homomorphic-editable (default)")
    print()
    print(
        "Production observability: grep application logs for "
        "`structured_export` and legacy raw_mode `render`/`stable` "
        "(still accepted as aliases; check volume drops over 30 days)."
    )


if __name__ == "__main__":
    main()
