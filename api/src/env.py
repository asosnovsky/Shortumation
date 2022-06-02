from pathlib import Path

from decouple import Csv, config

ROOT_FOLDER = Path(__file__).parent.parent.absolute()
BUILD_VERSION = config("BUILD_VERSION", "0.0.0")
HASSIO_TOKEN = config("HASSIO_TOKEN", "")
HASS_URL = config("HASS_URL", "/")
LOG_LEVEL = config("LOG_LEVEL", "INFO")
ORIGIN = config("ORIGIN", cast=Csv(), default="*")
