from wisedeck.services.layout_package.validate import (
    collect_layout_package_issues,
    should_raise_on_layout_issues,
)


def test_collect_issues_empty_when_no_package():
    assert collect_layout_package_issues(None, {"slides": [{"chart_config": {"type": "radar"}}]}) == []


def test_strict_chart_flags_unknown(monkeypatch):
    monkeypatch.setenv("WISEDECK_LAYOUT_PACKAGE_STRICT_CHARTS", "true")
    lp = {"schema_version": 1, "layout_id": "t:test", "data_schema": {}, "sample_data": {}}
    outline = {"slides": [{"chart_config": {"type": "radar"}}]}
    issues = collect_layout_package_issues(lp, outline)
    assert issues and "radar" in issues[0]


def test_should_raise_toggle(monkeypatch):
    monkeypatch.delenv("WISEDECK_LAYOUT_PACKAGE_STRICT", raising=False)
    assert should_raise_on_layout_issues() is False
    monkeypatch.setenv("WISEDECK_LAYOUT_PACKAGE_STRICT", "1")
    assert should_raise_on_layout_issues() is True
