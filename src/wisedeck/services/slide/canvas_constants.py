"""
PPTist viewport constants — keep in sync with:
  src/PPTist/src/store/slides.ts (viewportSize, viewportRatio)
  src/PPTist/src/configs/wisedeckCanvas.ts (duplicate for frontend bundler)
"""

# PPTist default store: viewportSize=1000, viewportRatio=16:9 height multiplier
VIEWPORT_WIDTH = 1000
VIEWPORT_RATIO = 0.5625  # 9/16
VIEWPORT_HEIGHT = VIEWPORT_WIDTH * VIEWPORT_RATIO

DEFAULT_MARGIN = 48

SLIDE_DOCUMENT_SCHEMA_VERSION = 1
