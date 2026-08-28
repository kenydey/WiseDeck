"""Tests for pptxtojson → PPTist element normalization."""

from wisedeck.services.slide.pptxtojson_element_normalize import (
    normalize_chart_element,
    normalize_pptxtojson_element,
    normalize_table_element,
    rewrite_chart_cdn_in_html,
)


def test_rewrite_chart_cdn_in_html():
    html = (
        '<script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js"></script>'
        '<script src="https://cdn.bootcdn.net/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>'
    )
    out = rewrite_chart_cdn_in_html(html)
    assert "/static/vendor/echarts.min.js" in out
    assert "/static/vendor/chart.umd.min.js" in out
    assert "bootcdn" not in out


def test_normalize_chart_from_pptxtojson_series():
    el = {
        "type": "chart",
        "chartType": "barChart",
        "colors": ["#111111", "#222222"],
        "data": [
            {
                "key": "A",
                "xlabels": {"0": "Q1", "1": "Q2"},
                "values": [{"y": 10}, {"y": 20}],
            },
            {
                "key": "B",
                "xlabels": {"0": "Q1", "1": "Q2"},
                "values": [{"y": 5}, {"y": 15}],
            },
        ],
    }
    out = normalize_chart_element(
        el, theme_colors=[], left=0, top=0, width=400, height=300
    )
    assert out is not None
    assert out["type"] == "chart"
    assert out["chartType"] == "bar"
    assert out["themeColors"] == ["#111111", "#222222"]
    assert out["data"]["series"][0] == [10.0, 20.0]


def test_normalize_table_minimal():
    el = {
        "type": "table",
        "data": [[{"text": "<p>Cell</p>", "colSpan": 1, "rowSpan": 1}]],
        "colWidths": [100],
        "rowHeights": [40],
        "borders": {},
    }
    out = normalize_table_element(el, left=0, top=0, width=200, height=100)
    assert out is not None
    assert out["data"][0][0]["text"] == "Cell"


def test_normalize_table_empty_returns_none():
    assert (
        normalize_table_element(
            {"type": "table", "data": []}, left=0, top=0, width=1, height=1
        )
        is None
    )


def test_normalize_chart_empty_series_returns_minimal():
    el = {
        "type": "chart",
        "chartType": "barChart",
        "data": [],
    }
    out = normalize_chart_element(
        el, theme_colors=[], left=0, top=0, width=400, height=300
    )
    assert out is not None
    assert out["data"]["series"][0] == [0.0]
    assert out["data"]["labels"] == [""]


def test_normalize_pptxtojson_element_text_cdn():
    el = {
        "type": "text",
        "content": '<script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js"></script>',
    }
    out = normalize_pptxtojson_element(
        el, theme_colors=[], left=1, top=2, width=3, height=4
    )
    assert out is not None
    assert "/static/vendor/echarts.min.js" in out["content"]
