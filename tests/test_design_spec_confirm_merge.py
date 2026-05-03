"""Regression: design_spec fields from requirements confirm merge into project dict."""

from wisedeck.services.design_spec_schema import deep_merge_design_spec, validate_design_spec_dict


def test_validate_design_spec_accepts_requirement_confirm_presets():
    spec = {
        "tone": "专业严谨",
        "density": "平衡适中",
        "language_style": "简体书面",
    }
    out = validate_design_spec_dict(spec)
    assert out["tone"] == "专业严谨"


def test_deep_merge_preserves_other_keys_when_overlay_triplet():
    base = {"palette": {"primary": "#111"}, "tone": "简洁直接"}
    overlay = {"tone": "专业严谨", "density": "高信息密度"}
    merged = deep_merge_design_spec(base, overlay)
    validate_design_spec_dict(merged)
    assert merged["tone"] == "专业严谨"
    assert merged["density"] == "高信息密度"
    assert merged["palette"]["primary"] == "#111"
