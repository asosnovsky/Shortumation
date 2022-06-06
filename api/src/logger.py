import logging

from src.env import LOG_LEVEL

if LOG_LEVEL == "DEBUG":
    logging.basicConfig(level=logging.DEBUG)
elif LOG_LEVEL == "INFO":
    logging.basicConfig(level=logging.INFO)
elif LOG_LEVEL == "WARN":
    logging.basicConfig(level=logging.WARN)
elif LOG_LEVEL == "ERROR":
    logging.basicConfig(level=logging.ERROR)
else:
    logging.basicConfig(level=logging.NOTSET)

logger = logging.getLogger()


def get_logger(name: str):
    return logging.getLogger(name)
