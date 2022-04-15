from email.policy import default
from decouple import config, Csv
from pathlib import Path


ROOT_FOLDER = Path(__file__).parent.parent.absolute()
BUILD_VERSION = config("BUILD_VERSION", "0.0.0")
LOG_LEVEL = config("LOG_LEVEL", "INFO")
ORIGIN = config("ORIGIN", cast=Csv(), default="*")