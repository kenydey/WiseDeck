"""Office template convert import_mode dispatch."""

import base64
from unittest.mock import MagicMock, patch

from wisedeck.api.global_master_template_api import _convert_office_template_sync
from wisedeck.api.models import TemplateOfficeConvertRequest, TemplateOfficeConvertResponse


def _minimal_pptx_b64() -> str:
    return base64.b64encode(b"dummy").decode("ascii")


def test_import_mode_structured_dispatches_to_structured_only():
    stub = TemplateOfficeConvertResponse(
        html_template="<!doctype html><html><body>x</body></html>",
        svg_template=None,
        suggested_template_name="t",
        slide_count=0,
        export_engine_used="pptxtojson_only",
        warnings=[],
        import_summary={},
        template_contract={},
    )
    body = TemplateOfficeConvertRequest(
        filename="t.pptx",
        data=_minimal_pptx_b64(),
        import_mode="structured",
    )
    with patch(
        "wisedeck.api.global_master_template_api._convert_office_structured_only_sync",
        return_value=stub,
    ) as mock_struct:
        out = _convert_office_template_sync(body)
    mock_struct.assert_called_once()
    assert out.export_engine_used == "pptxtojson_only"


def test_prefer_libreoffice_false_forces_structured_with_svg():
    stub = TemplateOfficeConvertResponse(
        html_template="<svg></svg>",
        svg_template="<svg></svg>",
        suggested_template_name="t",
        slide_count=1,
        export_engine_used="svg_stack",
        warnings=[],
        import_summary={},
        template_contract={},
    )
    body = TemplateOfficeConvertRequest(
        filename="t.pptx",
        data=_minimal_pptx_b64(),
        prefer_libreoffice_html=False,
        import_mode="structured_with_html",
    )
    with patch(
        "wisedeck.api.global_master_template_api._convert_office_svg_stack_sync",
        return_value=stub,
    ) as mock_svg:
        out = _convert_office_template_sync(body)
    mock_svg.assert_called_once()
    assert out.export_engine_used == "svg_stack"


def test_import_mode_structured_with_svg_skips_lo_branch():
    stub = MagicMock(spec=TemplateOfficeConvertResponse)
    body = TemplateOfficeConvertRequest(
        filename="t.pptx",
        data=_minimal_pptx_b64(),
        import_mode="structured_with_svg",
    )
    with patch(
        "wisedeck.api.global_master_template_api._convert_office_svg_stack_sync",
        return_value=stub,
    ) as mock_svg:
        _convert_office_template_sync(body)
    mock_svg.assert_called_once()
    args = mock_svg.call_args[0]
    assert "structured_with_svg" in (args[2][0] or "")
