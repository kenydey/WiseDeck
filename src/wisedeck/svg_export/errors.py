from __future__ import annotations

from typing import Optional


class SVGExportError(RuntimeError):
    """Base for SVG native export failures; carries optional page_index for observability."""

    def __init__(
        self,
        message: str,
        *,
        page_index: Optional[int] = None,
        details: Optional[str] = None,
    ) -> None:
        super().__init__(message)
        self.page_index = page_index
        self.details = details


class SVGPlaceholdersError(SVGExportError):
    pass


class SVGQualityGateError(SVGExportError):
    pass


class SVGFinalizeError(SVGExportError):
    pass


class SVGConversionError(SVGExportError):
    pass
