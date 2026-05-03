from wisedeck.services.structured_export.chart_mapper import chart_config_to_native_model
from wisedeck.services.structured_export.chart_presets import (
    CHART_TYPE_ALIASES,
    official_chart_sample_payload,
)
from wisedeck.services.structured_export.schemas import ChartConfigModel


def test_funnel_aliases_to_bar():
    assert CHART_TYPE_ALIASES["漏斗图"] == "bar"
    sample = official_chart_sample_payload("漏斗图")
    assert sample["type"] == "bar"


def test_chart_mapper_normalizes_alias():
    cfg = ChartConfigModel.model_validate({"type": "漏斗", "data": {"labels": ["a"], "datasets": [{"data": [1]}]}})
    model = chart_config_to_native_model(cfg)
    assert model.chart_type == "bar"
