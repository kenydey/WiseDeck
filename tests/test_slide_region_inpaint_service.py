from wisedeck.services.slide.slide_region_inpaint_service import (
    bbox_normalized_guard,
    build_inpaint_poc_response,
)


def test_bbox_guard_ok():
    ok, err = bbox_normalized_guard({"x": 0.1, "y": 0.2, "w": 0.3, "h": 0.4})
    assert ok is True
    assert err is None


def test_bbox_guard_rejects_oob():
    ok, err = bbox_normalized_guard({"x": 0, "y": 0, "w": 1.5, "h": 0.2})
    assert ok is False


def test_poc_deferred_without_env(monkeypatch):
    monkeypatch.delenv("WISEDECK_INPAINT_PROVIDER", raising=False)
    r = build_inpaint_poc_response(
        project_id="p1",
        slide_index=0,
        prompt="fix logo",
        bbox={"x": 0.1, "y": 0.1, "w": 0.2, "h": 0.2},
    )
    assert r["status"] == "deferred"


def test_poc_not_implemented_when_provider_set(monkeypatch):
    monkeypatch.setenv("WISEDECK_INPAINT_PROVIDER", "gemini_flash_image")
    r = build_inpaint_poc_response(
        project_id="p1",
        slide_index=0,
        prompt="x",
        bbox={"x": 0.1, "y": 0.1, "w": 0.2, "h": 0.2},
    )
    assert r["status"] == "not_implemented"
