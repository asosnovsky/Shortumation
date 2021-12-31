import os
from decouple import config
from pathlib import Path


def find_hass_config() -> Path:
    """Try to find HASS config."""
    if "HASSIO_TOKEN" in os.environ:
        return Path("/config")

    """Put together the default configuration directory based on the OS."""
    data_dir = Path(config("APPDATA", None) if os.name == "nt" else os.path.expanduser("~"))
    config_dir = data_dir / ".homeassistant"

    if config_dir.is_dir():
        return config_dir

    raise ValueError(
        "Unable to automatically find the location of Home Assistant " "config. Please pass it in."
    )
