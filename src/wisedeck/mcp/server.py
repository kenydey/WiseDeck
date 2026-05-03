"""
WiseDeck MCP Server（stdio）：HTTP 调用本机 FastAPI。

环境变量：
  WISEDECK_BASE_URL — 默认 http://127.0.0.1:8000
  WISEDECK_API_KEY — 可选；与站点 WISEDECK_API_KEY / WISEDECK_API_KEYS 对齐（Bearer）。

运行：`wisedeck-mcp`（需 `pip install mcp`）。
"""

from __future__ import annotations

import os
from typing import Any

import httpx


def _base_url() -> str:
    return os.getenv("WISEDECK_BASE_URL", "http://127.0.0.1:8000").rstrip("/")


def _auth_headers() -> dict[str, str]:
    key = (os.getenv("WISEDECK_API_KEY") or "").strip()
    if not key:
        return {}
    return {"Authorization": f"Bearer {key}"}


def _client() -> httpx.Client:
    return httpx.Client(timeout=120.0, headers=_auth_headers())


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
        """PPTX 导出目录（含 editability_matrix）。"""
        with _client() as client:
            r = client.get(f"{_base_url()}/api/export/catalog")
            r.raise_for_status()
            return r.json()

    @mcp.tool()
    def chart_presets_catalog_tool() -> dict[str, Any]:
        """图表预设目录。"""
        with _client() as client:
            r = client.get(f"{_base_url()}/api/charts/presets-catalog")
            r.raise_for_status()
            return r.json()

    @mcp.tool()
    def drawingml_poc_status_tool() -> dict[str, Any]:
        """SVG→DrawingML POC 开关状态。"""
        with httpx.Client(timeout=30.0) as client:
            r = client.get(f"{_base_url()}/api/export/drawingml-poc-status")
            r.raise_for_status()
            return r.json()

    @mcp.tool()
    def workspace_navigation_urls(project_id: str) -> dict[str, str]:
        """工作台 / 编辑器 / 导出 URL 模板。"""
        base = _base_url()
        return {
            "todo_board_url": f"{base}/projects/{project_id}/todo",
            "slides_editor_url": f"{base}/projects/{project_id}/edit",
            "structured_export_url": f"{base}/api/projects/{project_id}/export/structured-pptx",
            "export_catalog_url": f"{base}/api/export/catalog",
            "chart_presets_url": f"{base}/api/charts/presets-catalog",
            "inpaint_post_hint": "POST /api/projects/{project_id}/slides/{slide_index}/inpaint-region",
        }

    @mcp.tool()
    def create_project_tool(
        topic: str,
        scenario: str = "business",
        language: str = "zh",
        target_audience: str = "普通大众",
        requirements: str = "",
        ppt_style: str = "general",
    ) -> dict[str, Any]:
        """创建项目（需 WISEDECK_API_KEY + 绑定用户存在于数据库）。"""
        payload = {
            "scenario": scenario,
            "topic": topic,
            "requirements": requirements or None,
            "network_mode": False,
            "language": language,
            "target_audience": target_audience,
            "ppt_style": ppt_style,
            "description": "",
            "use_file_content": False,
        }
        with _client() as client:
            r = client.post(f"{_base_url()}/api/projects", json=payload)
            r.raise_for_status()
            return r.json()

    @mcp.tool()
    def get_project_tool(project_id: str) -> dict[str, Any]:
        """获取项目详情（幻灯片数量、大纲是否存在）。"""
        with _client() as client:
            r = client.get(f"{_base_url()}/api/projects/{project_id}")
            r.raise_for_status()
            return r.json()

    @mcp.tool()
    def get_project_todo_tool(project_id: str) -> dict[str, Any]:
        """获取 TODO 阶段列表。"""
        with _client() as client:
            r = client.get(f"{_base_url()}/api/projects/{project_id}/todo")
            r.raise_for_status()
            return r.json()

    @mcp.tool()
    def poll_project_slides_summary_tool(project_id: str) -> dict[str, Any]:
        """轮询摘要：slides_data 长度与版本号。"""
        with _client() as client:
            r = client.get(f"{_base_url()}/api/projects/{project_id}")
            r.raise_for_status()
            data = r.json()
        slides = data.get("slides_data") or []
        return {
            "project_id": project_id,
            "slide_count": len(slides) if isinstance(slides, list) else 0,
            "version": data.get("version"),
            "has_outline_slides": bool(
                isinstance(data.get("outline"), dict) and (data["outline"].get("slides") or [])
            ),
        }

    @mcp.tool()
    def structured_export_http_hint_tool(project_id: str, mode: str = "") -> dict[str, str]:
        """返回结构化导出 GET URL（请在 HTTP 客户端携带 Authorization 下载二进制）。"""
        base = _base_url()
        q = f"?mode={mode}" if mode.strip() else ""
        return {
            "method": "GET",
            "url": f"{base}/api/projects/{project_id}/export/structured-pptx{q}",
            "note": "响应为 application/vnd.openxmlformats-officedocument...；不要用 MCP 直接吞二进制。",
        }

    mcp.run()


if __name__ == "__main__":
    main()
