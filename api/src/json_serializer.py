import orjson
from typing import Any, Union
from src.config.HassSafeConstructor import SecretValue

# TODO: add support for these
NOT_IMPLEMENTED_SV_MSG = "SECRET VALUE NOT IMPLEMENTED"


def __default(obj: Any) -> str:
    if isinstance(obj, SecretValue):
        return NOT_IMPLEMENTED_SV_MSG
    raise TypeError


def json_dumps(obj: Any) -> str:
    """Serializes a python object into a json string

    Args:
        obj (Any)

    Returns:
        str
    """
    return orjson.dumps(obj, default=__default).decode("utf-8")


def normalize_obj(obj: Any) -> Union[list, dict]:
    """Converts any python object to primitive python types

    Args:
        obj (Any)

    Returns:
        Union[list, dict]
    """
    return orjson.loads(json_dumps(obj))
