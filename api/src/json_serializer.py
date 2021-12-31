import orjson
from typing import Any, Union
from ruamel.yaml.scalarstring import ScalarString
from ruamel.yaml.scalarint import ScalarInt
from ruamel.yaml.scalarbool import ScalarBoolean
from ruamel.yaml.scalarfloat import ScalarFloat
from src.yaml_serializer.types import SecretValue
from src.yaml_serializer.types import SecretValue

# TODO: add support for these
NOT_IMPLEMENTED_SV_MSG = "SECRET VALUE NOT IMPLEMENTED"


def __default(obj: Any) -> str:
    if isinstance(obj, SecretValue):
        return NOT_IMPLEMENTED_SV_MSG
    if isinstance(obj, ScalarString):
        return str(obj)
    if isinstance(obj, ScalarBoolean):
        return bool(obj)
    if isinstance(obj, ScalarFloat):
        return float(obj)
    if isinstance(obj, ScalarInt):
        return int(obj)
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
