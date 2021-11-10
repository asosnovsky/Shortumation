from decouple import config
from pathlib import Path


ROOT_FOLDER = Path(__file__).parent.parent
BUILD_VERSION = config("BUILD_VERSION", "0.0.0")
