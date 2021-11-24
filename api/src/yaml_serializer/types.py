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

    @classmethod
    def from_yaml(cls, _constructor, node: Node):
        return cls(node.value, Path("/"), "n/a")


class SecretValue(NamedTuple):
    name: str
    value: str

    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: Node):
        return representer.represent_scalar("!secret", node.name)

    @classmethod
    def from_yaml(cls, _constructor, node: Node):
        return cls(node.value, "n/a")


class IncludedYamlDir(NamedTuple):
    """
    This is a stub for when we see, still need to add support!
        - !include_dir_list
        - !include_dir_merge_list
        - !include_dir_named
        - !include_dir_merge_named
    """

    original_tag: str  # original node name
    name: str  # original node name

    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: "IncludedYaml"):
        return representer.represent_scalar(f"!{node.original_tag}", node.name)

    @classmethod
    def from_yaml(cls, _constructor, node: Node):
        return cls(node.tag[1:], node.value)


class HassConfig(NamedTuple):
    """The final output for load_hass_config"""

    secrets: dict  # the secrets file content
    config: dict  # the complete configration.yaml tree
    root_config_path: Path  # where the root 'configuration.yaml' lives