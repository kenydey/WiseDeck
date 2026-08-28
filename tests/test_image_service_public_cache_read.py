"""Regression: public_* cache keys must stay readable when viewer is logged in."""

import asyncio

import pytest
from pathlib import Path

from wisedeck.core.request_context import current_user_id
from wisedeck.services.image.image_service import ImageService, _cache_image_entry_readable_by_requester
from wisedeck.services.image.models import (
    ImageFormat,
    ImageInfo,
    ImageMetadata,
    ImageProvider,
    ImageSourceType,
)


def _minimal_png_info(*, image_id: str, owner_user_id):
    return ImageInfo(
        image_id=image_id,
        owner_user_id=owner_user_id,
        source_type=ImageSourceType.LOCAL_STORAGE,
        provider=ImageProvider.USER_UPLOAD,
        local_path="/tmp/wisedeck-test.png",
        filename="test.png",
        metadata=ImageMetadata(width=1, height=1, format=ImageFormat.PNG, file_size=1),
    )


def test_cache_image_entry_readable_public_prefix_with_mismatched_owner_none():
    info = _minimal_png_info(image_id="public_abcd", owner_user_id=None)
    assert _cache_image_entry_readable_by_requester("public_abcd", info, effective_user_id=99) is True


def test_cache_image_entry_readable_owner_match():
    info = _minimal_png_info(image_id="u5_deadbeef", owner_user_id=5)
    assert _cache_image_entry_readable_by_requester("u5_deadbeef", info, effective_user_id=5) is True


def test_cache_image_entry_denied_other_user_private_scope():
    info = _minimal_png_info(image_id="u5_deadbeef", owner_user_id=5)
    assert _cache_image_entry_readable_by_requester("u5_deadbeef", info, effective_user_id=99) is False


def test_get_image_returns_public_cached_entry_when_logged_in():
    async def _run():
        service = ImageService({"cache": {}})
        public_id = "public_" + "a" * 64
        fake_info = _minimal_png_info(image_id=public_id, owner_user_id=None)

        class _FakeCM:
            _cache_index = {}

            async def get_cached_image(self, key: str):
                if key == public_id:
                    return fake_info, Path("/tmp/wisedeck-test.png")
                return None

        original_cm = service.cache_manager
        original_init = service.initialized
        token = current_user_id.set(42)
        try:
            service.initialized = True
            service.cache_manager = _FakeCM()

            result = await service.get_image(public_id)
            assert result is not None
            assert result.image_id == public_id
        finally:
            current_user_id.reset(token)
            service.cache_manager = original_cm
            service.initialized = original_init

    asyncio.run(_run())


def test_get_image_denies_other_users_scoped_cache_when_logged_in():
    async def _run():
        service = ImageService({"cache": {}})
        scoped_id = "u7_" + "b" * 64
        fake_info = _minimal_png_info(image_id=scoped_id, owner_user_id=7)

        class _FakeCM:
            _cache_index = {}

            async def get_cached_image(self, key: str):
                if key == scoped_id:
                    return fake_info, Path("/tmp/wisedeck-test.png")
                return None

        original_cm = service.cache_manager
        original_init = service.initialized
        token = current_user_id.set(99)
        try:
            service.initialized = True
            service.cache_manager = _FakeCM()

            result = await service.get_image(scoped_id)
            assert result is None
        finally:
            current_user_id.reset(token)
            service.cache_manager = original_cm
            service.initialized = original_init

    asyncio.run(_run())
