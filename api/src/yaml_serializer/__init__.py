import io
from typing import Any, TextIO, Union

import yaml

from src.yaml_serializer.dumper import YamlSafeDumper
from src.yaml_serializer.loader import YamlSafeLoader


def dump_yaml(obj: Any) -> str:
    """Convert a python object to a hass-compliant yaml string

    Args:
        obj (Any)

    Returns:
        str
    """
    stream = io.StringIO()
    yaml.dump(  # nosec
        obj,
        stream,
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
        Dumper=YamlSafeDumper,
    )
    stream.seek(0)
    return stream.read()


def load_yaml(yaml_stream: TextIO) -> Union[dict, list]:
    """Load yaml from string using some hass-compliant yaml strings

    Args:
        yaml_stream (io.StringIO)

    Returns:
        Union[dict, list]
    """
    return yaml.load(yaml_stream, Loader=YamlSafeLoader)  # nosec
