# Project Skills

This repository includes reusable Codex skills under `skills/`.

## Available

- `wisedeck-ppt-generation`
  - Path: `skills/wisedeck-ppt-generation/SKILL.md`
  - Purpose: End-to-end WiseDeck PPT generation and post-edit operations via user API key.
  - Includes:
    - Full generation workflow runner (`scripts/run_flow.py`)
    - Project operations toolkit (`scripts/project_ops.py`)
    - Curl reference endpoints (`references/endpoints.md`)

## Usage

From Codex:

```text
[$wisedeck-ppt-generation] 生成一个 12 页、主题为人类何时毁灭的开启联网搜索的 PPT，并返回分享链接
```

Directly (if Python is available):

```bash
python skills/wisedeck-ppt-generation/scripts/run_flow.py --help
python skills/wisedeck-ppt-generation/scripts/project_ops.py --help
```

Without Python, use the curl-only endpoint sequence in:

`skills/wisedeck-ppt-generation/references/endpoints.md`
