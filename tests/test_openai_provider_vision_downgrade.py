"""OpenAI-compatible provider: strip image_url for gateways without multimodal chat support."""

import os

os.environ["DEBUG"] = "false"

from wisedeck.ai.base import AIMessage, ImageContent, MessageRole, TextContent
from wisedeck.ai.providers import OpenAIProvider
from wisedeck.services.template.global_master_template_service import GlobalMasterTemplateService


def test_deepseek_model_name_strips_even_with_generic_proxy_host():
    """模板常用代理域名不含 deepseek；靠 model id 降级。"""
    provider = OpenAIProvider(
        {
            "api_key": "k",
            "base_url": "https://llm-gateway.internal/v1",
            "model": "deepseek-v4-pro",
        }
    )
    cfg = provider._merge_config()
    msg = AIMessage(
        role=MessageRole.USER,
        content=[
            TextContent(text="hi"),
            ImageContent(image_url={"url": "data:image/png;base64,QQ=="}),
        ],
    )
    out = provider._convert_message_to_openai(msg, cfg)
    assert all(p.get("type") == "text" for p in out["content"])


def test_openai_base_url_env_deepseek_disables_vision(monkeypatch):
    monkeypatch.setenv("OPENAI_BASE_URL", "https://api.deepseek.com/v1")
    provider = OpenAIProvider({"api_key": "k", "model": "gpt-4"})
    cfg = provider._merge_config()
    assert provider._effective_base_url_host(cfg) == "api.deepseek.com"
    msg = AIMessage(
        role=MessageRole.USER,
        content=[ImageContent(image_url={"url": "data:image/png;base64,QQ=="})],
    )
    out = provider._convert_message_to_openai(msg, cfg)
    assert all(p.get("type") == "text" for p in out["content"])


def test_deepseek_base_url_strips_image_url_parts():
    provider = OpenAIProvider(
        {"api_key": "k", "base_url": "https://api.deepseek.com/v1", "model": "deepseek-chat"}
    )
    cfg = provider._merge_config()
    msg = AIMessage(
        role=MessageRole.USER,
        content=[
            TextContent(text="hello"),
            ImageContent(image_url={"url": "data:image/png;base64,iVBORw0KGgo="}),
        ],
    )
    out = provider._convert_message_to_openai(msg, cfg)
    parts = out["content"]
    assert isinstance(parts, list)
    assert all(p.get("type") == "text" for p in parts)
    assert not any(p.get("type") == "image_url" for p in parts)
    combined = "".join(p.get("text", "") for p in parts)
    assert "不支持多模态图片输入" in combined
    assert "hello" in combined


def test_openai_base_url_keeps_image_url_parts():
    provider = OpenAIProvider(
        {"api_key": "k", "base_url": "https://api.openai.com/v1", "model": "gpt-4o-mini"}
    )
    cfg = provider._merge_config()
    msg = AIMessage(
        role=MessageRole.USER,
        content=[
            TextContent(text="hello"),
            ImageContent(image_url={"url": "data:image/png;base64,QQ=="}),
        ],
    )
    out = provider._convert_message_to_openai(msg, cfg)
    types_found = [p.get("type") for p in out["content"]]
    assert "text" in types_found
    assert "image_url" in types_found


def test_explicit_supports_vision_false_strips_even_without_deepseek_host():
    provider = OpenAIProvider(
        {
            "api_key": "k",
            "base_url": "https://example.com/v1",
            "model": "x",
            "supports_vision_in_chat_completions": False,
        }
    )
    cfg = provider._merge_config()
    msg = AIMessage(
        role=MessageRole.USER,
        content=[ImageContent(image_url={"url": "data:image/png;base64,QQ=="})],
    )
    out = provider._convert_message_to_openai(msg, cfg)
    assert all(p.get("type") == "text" for p in out["content"])
    assert "1 张参考图被省略" in out["content"][0]["text"]


def test_responses_input_strips_input_image_for_deepseek():
    provider = OpenAIProvider(
        {"api_key": "k", "base_url": "https://api.deepseek.com", "model": "deepseek-chat"}
    )
    cfg = provider._merge_config()
    msg = AIMessage(
        role=MessageRole.USER,
        content=[
            TextContent(text="x"),
            ImageContent(image_url={"url": "data:image/jpeg;base64,abcd"}),
        ],
    )
    out = provider._convert_message_to_responses_input(msg, cfg)
    parts = out["content"]
    assert isinstance(parts, list)
    assert all(p.get("type") == "input_text" for p in parts)


def test_compact_pptx_layout_truncates_large_payload():
    layout = {"schema_version": 1, "slides": [{"index": i, "shapes": [{"bbox": [0, 0, 1, 1]}]} for i in range(80)]}
    text = GlobalMasterTemplateService._compact_pptx_layout_for_prompt(layout, max_chars=800)
    assert len(text) <= 850
    assert "truncated" in text or "…(truncated)" in text
