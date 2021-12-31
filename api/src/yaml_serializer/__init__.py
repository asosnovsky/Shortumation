import io
from typing import Any, Union, TextIO
from src.yaml_serializer.base_yaml import yaml


def dump_yaml(obj: Any) -> str:
    """Convert a python object to a hass-compliant yaml string

    Args:
        obj (Any)

    Returns:
        str
    """
    stream = io.StringIO()
    yaml.dump(obj, stream)
    stream.seek(0)
    return stream.read()


def load_yaml(yaml_stream: TextIO) -> Union[dict, list]:
    """Load yaml from string using some hass-compliant yaml strings

    Args:
        yaml_stream (io.StringIO)

    Returns:
        List[dict, list]
    """
    return yaml.load(yaml_stream)
