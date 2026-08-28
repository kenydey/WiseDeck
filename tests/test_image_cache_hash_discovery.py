"""Cross-scope cache discovery by content hash suffix."""

import asyncio

from wisedeck.services.image.cache.image_cache import ImageCacheManager


def test_discover_cache_key_by_content_hash_finds_u_scoped_file(tmp_path):
    cache = ImageCacheManager({"cache_root": str(tmp_path)})
    content_hash = "a" * 64
    user_dir = tmp_path / "local_storage" / "user_uploads"
    file_path = user_dir / f"u42_{content_hash}.png"
    file_path.write_bytes(b"\x89PNG\r\n\x1a\n")

    found = asyncio.run(cache.discover_cache_key_by_content_hash(content_hash))
    assert found == f"u42_{content_hash}"
