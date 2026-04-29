from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional


def build_hosted_slides_html_document(
    *,
    slides_data: List[Any],
    base_url: str,
    contract_version: str,
    page: Optional[int] = None,
) -> str:
    """
    Build a same-origin HTML document that hosts editor `slides_data[].html_content`.

    `page` is 1-based. When provided, only that slide is rendered.
    """
    if not isinstance(slides_data, list):
        slides_data = []

    if page is not None:
        if not isinstance(page, int) or page <= 0 or page > len(slides_data):
            raise ValueError("invalid page")
        rows: Iterable[Dict[str, Any]] = [slides_data[page - 1]]  # type: ignore[list-item]
        page_offset = page - 1
    else:
        rows = slides_data  # type: ignore[assignment]
        page_offset = 0

    hosted = []
    for i, row in enumerate(rows):
        if not isinstance(row, dict):
            continue
        html = str(row.get("html_content") or "")
        title = str(row.get("title") or "")
        page_number = (page_offset + i) + 1
        hosted.append(
            f"""
            <section class="wisedeck-slide-page" data-page="{page_number}">
              <div class="wisedeck-slide-root">
                {html}
              </div>
              <div class="wisedeck-slide-meta" aria-hidden="true">
                <span class="wisedeck-slide-number">{page_number}</span>
                <span class="wisedeck-slide-title">{title}</span>
              </div>
            </section>
            """
        )

    hosted_html = "\n".join(hosted)
    base_url = str(base_url or "").rstrip("/")
    contract_version = str(contract_version or "")

    return f"""<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="wisedeck-slide-contract-version" content="{contract_version}" />
    <base href="{base_url}/" />
    <title>WiseDeck slides_html hosted</title>
    <style>
      html, body {{
        margin: 0;
        padding: 0;
      }}
      .wisedeck-slide-page {{
        width: 100%;
        min-height: 100vh;
        position: relative;
        page-break-after: always;
      }}
      .wisedeck-slide-root {{
        width: 100%;
        height: 100%;
      }}
      .wisedeck-slide-meta {{
        position: absolute;
        left: 8px;
        bottom: 8px;
        font-size: 12px;
        opacity: 0.5;
        user-select: none;
        pointer-events: none;
      }}
    </style>
  </head>
  <body>
    {hosted_html}
  </body>
</html>
"""

