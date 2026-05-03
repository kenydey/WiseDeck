"""
本地可复现的「区域修改」适配层 POC：对 bbox 内像素做模糊处理（无需外部 inpainting API）。
"""

from __future__ import annotations

import base64
import io
from typing import Any, Dict, Tuple

from PIL import Image, ImageFilter


def _decode_image(data_url_or_b64: str) -> Image.Image:
    raw = (data_url_or_b64 or "").strip()
    if raw.startswith("data:"):
        comma = raw.find(",")
        if comma >= 0:
            raw = raw[comma + 1 :]
    blob = base64.b64decode(raw, validate=False)
    return Image.open(io.BytesIO(blob)).convert("RGBA")


def blur_bbox_region(
    *,
    image_base64: str,
    bbox: Dict[str, Any],
    radius: float = 12.0,
) -> Tuple[bool, str | None, str | None]:
    """
    bbox 为相对坐标 x,y,w,h ∈ [0,1]。返回 (ok, error, output_png_base64)。
    """
    try:
        im = _decode_image(image_base64)
    except Exception as e:
        return False, f"decode_image_failed:{e}", None

    w, h = im.size
    try:
        x = float(bbox["x"])
        y = float(bbox["y"])
        bw = float(bbox["w"])
        bh = float(bbox["h"])
    except (KeyError, TypeError, ValueError) as e:
        return False, f"bbox_invalid:{e}", None

    x0 = max(0, int(x * w))
    y0 = max(0, int(y * h))
    x1 = min(w, int((x + bw) * w))
    y1 = min(h, int((y + bh) * h))
    if x1 <= x0 or y1 <= y0:
        return False, "bbox_pixel_empty", None

    crop = im.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(radius=radius))
    im.paste(crop, (x0, y0))
    buf = io.BytesIO()
    im.convert("RGB").save(buf, format="PNG")
    return True, None, base64.b64encode(buf.getvalue()).decode("ascii")


def png_data_url_from_base64(b64: str) -> str:
    return f"data:image/png;base64,{b64}"
