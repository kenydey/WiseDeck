import asyncio

from wisedeck.services.export_infra.html_render_service import HtmlRenderService


class _FakeConverter:
    def __init__(self):
        self.calls = []

    def is_available(self):
        return True

    async def screenshot_html(self, html_file_path: str, screenshot_path: str, **kwargs):
        self.calls.append(("screenshot_html", html_file_path, screenshot_path, kwargs))
        return True


def test_html_render_service_delegates_to_converter():
    conv = _FakeConverter()
    svc = HtmlRenderService(converter=conv)
    ok = asyncio.run(svc.screenshot_html("C:\\tmp\\in.html", "C:\\tmp\\out.png", viewport="test"))
    assert ok is True
    assert conv.calls and conv.calls[0][0] == "screenshot_html"

