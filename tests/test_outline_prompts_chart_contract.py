from wisedeck.services.prompts.outline_prompts import OutlinePrompts


def test_zh_outline_prompt_embeds_chart_contract():
    text = OutlinePrompts.get_outline_prompt_zh(
        topic="t",
        scenario_desc="s",
        target_audience="a",
        style_desc="st",
        requirements="",
        description="",
        research_section="",
        page_count_instruction="pc",
        expected_page_count=5,
        language="zh",
    )
    assert "结构化导出图表类型约束" in text


def test_en_outline_prompt_embeds_chart_contract():
    text = OutlinePrompts.get_outline_prompt_en(
        topic="t",
        scenario_desc="s",
        target_audience="a",
        style_desc="st",
        requirements="",
        description="",
        research_section="",
        page_count_instruction="pc",
        expected_page_count=5,
        language="en",
    )
    assert "Structured-export chart constraint" in text
