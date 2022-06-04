from pathlib import Path

from decouple import Csv, config

ROOT_FOLDER = Path(__file__).parent.parent.absolute()
BUILD_VERSION = config("BUILD_VERSION", "0.0.0")
HASSIO_TOKEN = config("SUPERVISOR_TOKEN", "")
HASSIO_WS = config("HASSIO_WS", "ws://supervisor/core/websocket")
LOG_LEVEL = config("LOG_LEVEL", "INFO")
ORIGIN = config("ORIGIN", cast=Csv(), default="*")
