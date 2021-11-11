from pathlib import Path
from typing import Any, NamedTuple
from ruamel.yaml.nodes import Node
from ruamel.yaml.representer import BaseRepresenter


class IncludedYaml(NamedTuple):
    """Any time something in the yaml is specified as `include !filepath`
    this data type will represent it.
    """

    name: str  # original node name
    original_path: Path  # path to location of original file
    data: Any  # the parsed data

    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: "IncludedYaml"):
        return representer.represent_scalar("!include", node.name)


class SecretValue(NamedTuple):
    name: str
    value: str

    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: Node):
        return representer.represent_scalar("!secret", node.name)


class HassConfig(NamedTuple):
    """The final output for load_hass_config"""

    secrets: dict  # the secrets file content
    config: dict  # the complete configration.yaml tree
