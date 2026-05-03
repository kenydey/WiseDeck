"""Validate and merge design_spec JSON payloads."""

from __future__ import annotations

from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field


class DesignSpecModel(BaseModel):
    """Known keys are optional; unknown keys allowed for forward compatibility."""

    model_config = ConfigDict(extra="allow")

    palette: Optional[Any] = None
    typography: Optional[Any] = None
    tone: Optional[str] = None
    density: Optional[str] = None
    forbidden_elements: Optional[Any] = None
    language_style: Optional[str] = None


def validate_design_spec_dict(data: Any) -> Dict[str, Any]:
    if data is None:
        return {}
    if not isinstance(data, dict):
        raise ValueError("design_spec must be a JSON object")
    DesignSpecModel.model_validate(data)
    return data


def deep_merge_design_spec(base: Dict[str, Any], overlay: Dict[str, Any]) -> Dict[str, Any]:
    out = dict(base or {})
    for k, v in (overlay or {}).items():
        if (
            k in out
            and isinstance(out[k], dict)
            and isinstance(v, dict)
        ):
            out[k] = deep_merge_design_spec(out[k], v)
        else:
            out[k] = v
    return out
