class SVGExportError(RuntimeError):
    pass


class SVGPlaceholdersError(SVGExportError):
    pass


class SVGQualityGateError(SVGExportError):
    pass


class SVGFinalizeError(SVGExportError):
    pass


class SVGConversionError(SVGExportError):
    pass

