"""Train 风格：骨架 JSON → 扩写为合法单页 wds_aippt_v1（仅 JSON，可有围栏）。"""

from __future__ import annotations

import json
from typing import Dict, List, Optional


def build_wds_aippt_json_system_prompt() -> str:
    return """你是 WiseDeck 演示文稿结构化页生成器。你的输出将用于 PPTist 模板渲染（wds_aippt_v1）。

硬性规则：
1. 只输出一页幻灯片的 JSON 对象，必须符合 wds_aippt_v1：根对象含 \"type\" 与 \"data\"（以及可选 \"images\"）。
2. type 必须是以下之一：cover | contents | transition | content | end | reference。
3. 不要输出 HTML、Markdown 解释或多余文本；可使用 ```json ... ``` 围栏包裹 JSON。
4. 在输入骨架基础上扩写文案：保持 type 不变或仅在明显错误时修正为最接近的一种；丰富 title、条目文本，使之简洁、专业、中文优先（除非用户材料为其他语言）。
5. data 字段形状必须与类型匹配：
   - cover: { \"title\", \"text\" }
   - contents: { \"items\": string[] }
   - transition: { \"title\", \"text\" }
   - content: { \"title\", \"items\": [ bullet | text | chart | image 条目 ] }
   - end: 同 cover
   - reference: { \"title\", \"items\": [ { \"title\", \"text\" } ] }
6. content 条目中普通要点用 { \"title\", \"text\" }；段落用 { \"kind\":\"text\", \"title\", \"text\" }；图表用 { \"kind\":\"chart\", \"chartType\", \"labels\", \"series\" }。"""


def build_wds_aippt_json_user_prompt(
    skeleton: Dict[str, Any],
    slide_outline: Dict[str, Any],
    confirmed_requirements: Optional[Dict[str, Any]],
    page_number: int,
    total_pages: int,
    all_slides: Optional[List[Dict[str, Any]]],
) -> str:
    deck_title = ""
    if confirmed_requirements:
        deck_title = str(confirmed_requirements.get("topic") or confirmed_requirements.get("title") or "").strip()
    sk_compact = json.dumps(skeleton, ensure_ascii=False, separators=(",", ":"))
    outline_compact = json.dumps(slide_outline, ensure_ascii=False, separators=(",", ":"))[:8000]
    ctx = {"deck_title": deck_title, "page": page_number, "total": total_pages}
    if all_slides:
        titles = [str(s.get("title") or "") for s in all_slides[:30]]
        ctx["outline_titles"] = titles

    return f"""上下文：{json.dumps(ctx, ensure_ascii=False, separators=(",", ":"))}

大纲当前页（摘录）：{outline_compact}

下列骨架 JSON 请扩写为完整、可直接解析的一页 wds_aippt_v1（保留 type，充实 data）：
{skeleton_compact}
"""