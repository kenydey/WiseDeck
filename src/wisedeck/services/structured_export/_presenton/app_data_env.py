"""App data directory for vendored Presenton-style asset paths (images/exports)."""

import os


def get_app_data_directory_env() -> str | None:
    return os.environ.get("WISEDECK_APP_DATA_DIRECTORY") or os.environ.get("APP_DATA_DIRECTORY")


def get_temp_directory_env() -> str | None:
    return os.environ.get("WISEDECK_TEMP_DIRECTORY") or os.environ.get("TEMP_DIRECTORY")
