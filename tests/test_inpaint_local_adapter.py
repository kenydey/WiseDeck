import base64
from io import BytesIO

from PIL import Image

from wisedeck.services.slide.inpaint_local_adapter import blur_bbox_region


def _tiny_png_b64():
    buf = BytesIO()
    Image.new("RGB", (100, 80), color=(200, 100, 50)).save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("ascii")


def test_blur_bbox_smoke():
    b64 = _tiny_png_b64()
    ok, err, out = blur_bbox_region(image_base64=b64, bbox={"x": 0.2, "y": 0.2, "w": 0.4, "h": 0.4})
    assert ok is True
    assert err is None
    assert out and len(out) > 40
