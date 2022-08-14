import logging

from src.env import LOG_LEVEL

logging.basicConfig(
    format="%(asctime)s|%(levelname)-4s[%(pathname)s:%(lineno)d@%(funcName)s] %(message)s",
    datefmt="%Y-%m-%d:%H:%M:%S",
    level=logging._nameToLevel.get(LOG_LEVEL, logging.INFO),
)
logger = logging.getLogger()


def get_logger(name: str):
    return logging.getLogger(name)
