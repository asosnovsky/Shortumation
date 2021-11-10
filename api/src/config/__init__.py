import os
from pathlib import Path
from .globals import CONFIGURATION_PATH
from .configuration_parser import load_hass_config


def find_hass_config() -> Path:
    """Try to find HASS config."""
    if "HASSIO_TOKEN" in os.environ:
        return Path("/config")

    """Put together the default configuration directory based on the OS."""
    data_dir = Path(
        os.getenv("APPDATA") if os.name == "nt" else os.path.expanduser("~")
    )
    config_dir = data_dir / ".homeassistant"

    if config_dir.is_dir():
        return config_dir

    raise ValueError(
        "Unable to automatically find the location of Home Assistant "
        "config. Please pass it in."
    )


def db_url_from_hass_config(path: Path):
    """Find the recorder database url from a HASS config dir."""
    global CONFIGURATION_PATH
    CONFIGURATION_PATH = path.resolve()
    config = load_hass_config(path)

    recorder = config.get("recorder")

    if recorder:
        db_url = recorder.get("db_url")
        if db_url is not None:
            return db_url

    default_path = path / "home-assistant_v2.db"
    default_url = f"sqlite:///{default_path.absolute()}"

    if not os.path.isfile(default_path):
        raise ValueError(
            "Unable to determine DB url from hass config at {}".format(path)
        )

    return default_url
