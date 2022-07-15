import os
from pathlib import Path

from decouple import config

from .loader import HassConfig


def find_hass_config() -> HassConfig:
    """Try to find HASS config."""
    if config("USE_EXAMPLE_REPO", False, cast=bool):
        print("using USE_EXAMPLE_REPO")
        from tests.utils import create_copy_of_example_config, HA_CONFIG3_EXAMPLE

        path = create_copy_of_example_config(HA_CONFIG3_EXAMPLE)
        print("|-> ", path)
        return HassConfig(path)

    config_dir = Path("/config")
    if config_dir.is_dir():
        return HassConfig(config_dir)

    """Put together the default configuration directory based on the OS."""
    data_dir = Path(config("APPDATA", None) if os.name == "nt" else os.path.expanduser("~"))
    config_dir = data_dir / ".homeassistant"

    if config_dir.is_dir():
        return HassConfig(config_dir)

    raise ValueError(
        "Unable to automatically find the location of Home Assistant " "config. Please pass it in."
    )
