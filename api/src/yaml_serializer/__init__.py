import io
from pathlib import Path
from typing import Any, List
from src.yaml_serializer.base_yaml import yaml
from src.yaml_serializer.HassYaml import HassYaml
from src.yaml_serializer.types import HassConfig, SecretValue, IncludedYaml


def load_hass_config(file_path: Path) -> HassConfig:
    HAY = HassYaml()
    data = HAY.load(file_path / "configuration.yaml")
    return HassConfig(HAY.secrets, data)


def dump_yaml(obj: Any) -> str:
    stream = io.StringIO()
    yaml.dump(obj, stream)
    stream.seek(0)
    return stream.read()
