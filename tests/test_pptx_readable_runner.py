import shutil
from pathlib import Path
from unittest.mock import patch

import pytest

from wisedeck.services.template.pptx_readable_runner import parse_pptx_to_readable_json


def test_parse_strict_raises_when_node_missing(tmp_path: Path):
    fake = tmp_path / "x.pptx"
    fake.write_bytes(b"PK\x03\x04")
    with patch("wisedeck.services.template.pptx_readable_runner._node_binary", return_value=""):
        with pytest.raises(RuntimeError, match="pptx_readable required"):
            parse_pptx_to_readable_json(fake, strict=True)


@pytest.mark.skipif(not shutil.which("node"), reason="node not installed")
def test_parse_non_strict_returns_error_dict_when_node_missing(tmp_path: Path):
    fake = tmp_path / "y.pptx"
    fake.write_bytes(b"PK\x03\x04")
    with patch("wisedeck.services.template.pptx_readable_runner._node_binary", return_value=""):
        out = parse_pptx_to_readable_json(fake, strict=False)
        assert out.get("error") == "node_not_found"
