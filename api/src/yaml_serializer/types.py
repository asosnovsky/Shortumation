from typing import NamedTuple

from ruamel.yaml.nodes import Node
from ruamel.yaml.representer import BaseRepresenter


class IncludedYaml(NamedTuple):
    """Any time something in the yaml is specified as `include !filepath`
    this data type will represent it.
    """

    path_str: str  # original node path

    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: "IncludedYaml"):
        return representer.represent_scalar("!include", node.path_str)

    @classmethod
    def from_yaml(cls, _constructor, node: Node):
        return cls(node.value)


# TODO: add support for these
NOT_IMPLEMENTED_SV_MSG = "SECRET VALUE NOT IMPLEMENTED"


class SecretValue(NamedTuple):
    name: str
    value: str

    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: "SecretValue"):
        return representer.represent_scalar("!secret", node.name)

    @classmethod
    def from_yaml(cls, _constructor, node: Node):
        return cls(node.value, "n/a")

    def to_normalized_json(self):
        return NOT_IMPLEMENTED_SV_MSG


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
    def to_yaml(cls, representer: BaseRepresenter, node: "IncludedYamlDir"):
        return representer.represent_scalar(f"!{node.original_tag}", node.name)

    @classmethod
    def from_yaml(cls, _constructor, node: Node):
        return cls(node.tag[1:], node.value)
