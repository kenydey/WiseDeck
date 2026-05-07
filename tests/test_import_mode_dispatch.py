"""Office template convert import_mode dispatch."""

import base64
import os
from unittest.mock import MagicMock, patch

import pytest

pytest.importorskip("fastapi")

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


def test_lo_svg_supplement_disabled_by_default_adds_warning():
    stub = TemplateOfficeConvertResponse(
        html_template="<!doctype html><html><body>x</body></html>",
        svg_template=None,
        suggested_template_name="t",
        slide_count=2,
        export_engine_used="libreoffice_html",
        warnings=[],
        import_summary={},
        template_contract={},
    )
    body = TemplateOfficeConvertRequest(
        filename="t.pptx",
        data=_minimal_pptx_b64(),
        import_mode="structured_with_html",
        prefer_libreoffice_html=True,
    )

    # Ensure supplement env var is not enabled for this test.
    os.environ.pop("WISEDECK_ENABLE_LO_SVG_SUPPLEMENT", None)

    with patch(
        "wisedeck.api.global_master_template_api.materialize_office_upload_to_pptx",
        return_value=(MagicMock(), MagicMock(), "t.pptx"),
    ), patch(
        "wisedeck.api.global_master_template_api._resolve_soffice",
        return_value="soffice",
    ), patch(
        "wisedeck.api.global_master_template_api.export_presentation_html_bundle",
        return_value=("<!doctype html><html><body><div>p1</div></body></html>", 1, []),
    ), patch(
        "wisedeck.api.global_master_template_api.split_lo_merged_html_slide_fragments",
        return_value=["<div>p1</div>", "<div>p2</div>"],
    ), patch(
        "wisedeck.api.global_master_template_api._layout_hints_from_pptx_path",
        return_value={"schema_version": 1, "slides": [{}, {}]},
    ), patch(
        "wisedeck.api.global_master_template_api._template_import_service",
    ) as mock_importer_factory, patch(
        "wisedeck.api.global_master_template_api.build_template_contract_from_manifest",
        return_value={"slide_count": 2},
    ), patch(
        "wisedeck.api.global_master_template_api.placeholder_markers_from_template_contract",
        return_value=["PAGE_TITLE"],
    ), patch(
        "wisedeck.api.global_master_template_api.inject_hidden_placeholder_slots",
        side_effect=lambda h, markers: h,
    ), patch(
        "wisedeck.api.global_master_template_api.build_import_summary",
        return_value={"slide_count": 2},
    ), patch(
        "wisedeck.api.global_master_template_api.merge_import_summary_with_template_contract",
        side_effect=lambda imp, contract: dict(imp, template_contract=contract),
    ), patch(
        "wisedeck.api.global_master_template_api.collect_office_import_alignment_warnings",
        return_value=[],
    ), patch(
        "wisedeck.api.global_master_template_api.merge_warnings_unique",
        side_effect=lambda w, add: w.extend(add),
    ), patch(
        "wisedeck.api.global_master_template_api.wrap_lo_slide_fragment_html",
        side_effect=lambda frag, title: frag,
    ), patch(
        "wisedeck.api.global_master_template_api._convert_office_svg_stack_sync",
        return_value=stub,
    ):
        importer = MagicMock()
        importer.build_lightweight_structured_manifest.return_value = {"pptx_readable": {}, "pptx_layout": {}}
        mock_importer_factory.return_value = importer
        out = _convert_office_template_sync(body)

    assert out.export_engine_used == "libreoffice_html"
    assert any("已跳过 SVG 补充" in w for w in (out.warnings or []))
