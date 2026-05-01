from wisedeck.services.slide.layout_scorer import score_slide_layout_html


def test_scorer_detects_overflow_hidden():
    html = """<!DOCTYPE html><html><head></head><body>
    <div style="overflow:hidden;width:100px;height:20px;"><p>x</p></div>
    </body></html>"""
    r = score_slide_layout_html(html)
    assert r["metrics"]["overflow_hidden_occurrences"] >= 1
    assert r["score"] < 100


def test_scorer_reasonable_on_minimal():
    html = "<html><body><h1 style=\"font-size:32px\">T</h1><p style=\"font-size:14px\">Hi</p></body></html>"
    r = score_slide_layout_html(html)
    assert r["score"] >= 70
