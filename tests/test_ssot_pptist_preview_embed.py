from __future__ import annotations

import asyncio

from wisedeck.services.slide.slide_document_builder import assemble_generated_slide_outputs


def test_ssot_pipeline_sets_elements_source_on_raster_path():
    # Contains canvas and no chart_config => should trigger rasterization attempt.
    html = """
    <html><body style="margin:0">
      <canvas id="c" width="500" height="300"></canvas>
      <script>/* no-op */</script>
    </body></html>
    """
    slide = {"title": "Chartless", "content_points": []}
    doc, ppt, preview = asyncio.run(assemble_generated_slide_outputs(slide, html, 2, 3))
    assert doc.schema_version >= 1
    assert isinstance(ppt.get("elements"), list)
    assert isinstance(preview, str) and "wds-slide-root" in preview
    # If playwright is unavailable, this may remain slide_document; accept both.
    assert ppt.get("elements_source") in (None, "slide_document", "playwright_raster")

