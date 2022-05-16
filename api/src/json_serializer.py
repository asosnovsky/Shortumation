import json
from typing import Any, List


def json_dumps(obj: Any) -> str:
    """Serializes a python object into a json string

    Args:
        obj (Any)

    Returns:
        str
    """
    return json.dumps(normalize_obj(obj))


def normalize_obj(obj: Any) -> Any:
    """Converts any python object to primitive python types

    Args:
        obj (Any)

    Returns:
        Any
    """
    if hasattr(obj, "to_normalized_json"):
        return obj.to_normalized_json()
    elif isinstance(obj, dict):
        return {normalize_obj(k): normalize_obj(v) for k, v in obj.items()}
    elif isinstance(obj, list) or isinstance(obj, tuple):
        return list(map(normalize_obj, obj))
    elif (
        isinstance(obj, str)
        or isinstance(obj, int)
        or isinstance(obj, float)
        or isinstance(obj, bool)
        or obj is None
    ):
        return obj
    else:
        raise TypeError(f"Cannot normalized obj {obj}")
