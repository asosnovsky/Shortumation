from yaml.nodes import Node
from yaml.representer import BaseRepresenter

from .manager import YamlManager

dump_yaml = YamlManager.dump_yaml
load_yaml = YamlManager.load_yaml

from typing import NamedTuple


@YamlManager.as_constructor("!include")
class IncludedYaml(NamedTuple):
    """Any time something in the yaml is specified as `include !filepath`
    this data type will represent it.
    """

    path_str: str  # original node path

    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: "IncludedYaml"):
        return representer.represent_scalar("!include", node.path_str)

    @classmethod
    def from_yaml(cls, constructor: YamlManager.Loader, node: Node):
        return cls(node.value)


# TODO: add support for these
NOT_IMPLEMENTED_SV_MSG = "SECRET VALUE NOT IMPLEMENTED"


@YamlManager.as_constructor("!secret")
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


@YamlManager.as_constructor(
    "!include_dir_list",
    "!include_dir_merge_list",
    "!include_dir_named",
    "!include_dir_merge_named",
    "!env_var",
)
class IncludedYamlDir(NamedTuple):
    original_tag: str  # original node name
    name: str  # original node name

    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: "IncludedYamlDir"):
        return representer.represent_scalar(f"!{node.original_tag}", node.name)

    @classmethod
    def from_yaml(cls, _constructor, node: Node):
        return cls(node.tag[1:], node.value)
