"""
WiseDeck MCP Server（stdio）：通过 HTTP 读取本机已运行的 FastAPI 实例的开放目录接口。

环境变量：
  WISEDECK_BASE_URL — 默认 http://127.0.0.1:8000

运行：在已 `pip install mcp`（或 `pip install wisedeck[mcp]`）后执行 `wisedeck-mcp`。

注意：项目级受保护 API 仍需浏览器会话或后续 API-Key 方案；此处仅提供目录/链接类工具。
"""

from __future__ import annotations

import os
from typing import Any

import httpx


def _base_url() -> str:
    return os.getenv("WISEDECK_BASE_URL", "http://127.0.0.1:8000").rstrip("/")


def main() -> None:
    try:
        from mcp.server.fastmcp import FastMCP
    except ImportError as e:
        raise SystemExit(
            "缺少 mcp 依赖，请执行：pip install mcp 或 pip install wisedeck[mcp]"
        ) from e

    mcp = FastMCP("WiseDeck")

    @mcp.tool()
    def export_modes_catalog_tool() -> dict[str, Any]:
        """WiseDeck PPTX 导出模式目录（可编辑优先 vs 栅格兜底）。"""
        with httpx.Client(timeout=30.0) as client:
            r = client.get(f"{_base_url()}/api/export/catalog")
            r.raise_for_status()
            return r.json()

    @mcp.tool()
    def chart_presets_catalog_tool() -> dict[str, Any]:
        """官方图表类型、别名与示例 chart_config（与大纲字段对齐）。"""
        with httpx.Client(timeout=30.0) as client:
            r = client.get(f"{_base_url()}/api/charts/presets-catalog")
            r.raise_for_status()
            return r.json()

    @mcp.tool()
    def workspace_navigation_urls(project_id: str) -> dict[str, str]:
        """工作台 / 编辑器 / 开放 API 的路径模板（需在浏览器登录后访问页面）。"""
        base = _base_url()
        return {
            "todo_board_url": f"{base}/projects/{project_id}/todo",
            "slides_editor_url": f"{base}/projects/{project_id}/edit",
            "export_catalog_url": f"{base}/api/export/catalog",
            "chart_presets_url": f"{base}/api/charts/presets-catalog",
            "inpaint_poc_endpoint": "POST /api/projects/{project_id}/slides/{slide_index}/inpaint-region",
        }

    mcp.run()


if __name__ == "__main__":
    main()
