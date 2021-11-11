import io
from pathlib import Path
from typing import Any, Union
from src.yaml_serializer.base_yaml import yaml
from src.yaml_serializer.HassYaml import HassYaml
from src.yaml_serializer.types import HassConfig, SecretValue, IncludedYaml, IncludedYamlDir


## TODO: consider deprecating this and using 'simple_load_yaml' for consistency
def load_hass_config(file_path: Path) -> HassConfig:
    """Load all Hass configrations from the root config folder
    **highly opinionated**

    Args:
        file_path (Path)

    Returns:
        HassConfig
    """
    HAY = HassYaml()
    data = HAY.load(file_path / "configuration.yaml")
    return HassConfig(HAY.secrets, data)


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


def simple_load_yaml(yaml_stream: io.StringIO) -> Union[dict, list]:
    """Load yaml from string using some hass-compliant yaml strings

    Args:
        yaml_stream (io.StringIO)

    Returns:
        List[dict, list]
    """
    return yaml.load(yaml_stream)
