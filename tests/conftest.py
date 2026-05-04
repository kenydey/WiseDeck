import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC = os.path.join(ROOT, "src")
if SRC not in sys.path:
    sys.path.insert(0, SRC)

# 悬空测试：主干已移除/裁剪对应实现，或 fixture/路径缺失。见 docs / CI 说明。
collect_ignore = [
    "test_admin_bootstrap.py",
    "test_api_key_auth.py",
    "test_user_deactivation_revokes_session.py",
    "test_auth_oauth_visibility.py",
    "test_minimax_provider.py",
    "test_header_footer_extraction.py",
    "test_dom_to_pptx_formula_smoke.py",
    "test_dom_to_pptx_inline_complex_smoke.py",
    "test_cleanup_excess_slides_security.py",
    "test_comfyui_tts_workflow_builder.py",
]

