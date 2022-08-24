from pathlib import Path

from yaml.nodes import Node

from .manager import YamlManager

dump_yaml = YamlManager.dump_yaml
load_yaml = YamlManager.load_yaml

from typing import NamedTuple


@YamlManager.as_constructor("!include")
class IncludedYaml(NamedTuple):
    """Any time something in the yaml is specified as `include !filepath`
    this data type will represent it.
    """

    path: Path  # original node path

    @classmethod
    def to_yaml(cls, representer, node: "IncludedYaml"):
        return representer.represent_scalar(
            "!include", str(node.path.relative_to(representer.root_path))
        )

    @classmethod
    def from_yaml(cls, constructor, node: Node):
        return cls(constructor.root_path / node.value)

    def to_normalized_json(self):
        with self.path.open("r") as fp:
            return load_yaml(fp, root_path=self.path.parent)


# TODO: add support for these
NOT_IMPLEMENTED_SV_MSG = "SECRET VALUE NOT IMPLEMENTED"


@YamlManager.as_constructor("!secret")
class SecretValue(NamedTuple):
    name: str
    value: str

    @classmethod
    def to_yaml(cls, representer, node: "SecretValue"):
        return representer.represent_scalar("!secret", node.name)

    @classmethod
    def from_yaml(cls, constructor, node: Node):
        return cls(node.value, "n/a")

    def to_normalized_json(self):
        return NOT_IMPLEMENTED_SV_MSG


@YamlManager.as_constructor(
    "!include_dir_list",
    "!include_dir_merge_list",
    "!include_dir_named",
    "!include_dir_merge_named",
)
class IncludedYamlDir(NamedTuple):
    original_tag: str  # original node name
    path: Path  # original node name

    @classmethod
    def to_yaml(cls, representer, node: "IncludedYamlDir"):
        return representer.represent_scalar(
            f"!{node.original_tag}", str(node.path.relative_to(representer.root_path))
        )

    @classmethod
    def from_yaml(cls, constructor, node: Node):
        return cls(node.tag[1:], constructor.root_path / node.value)


@YamlManager.as_constructor(
    "!env_var",
)
class EnvVar(NamedTuple):
    value: str  # original node name

    @classmethod
    def to_yaml(cls, representer, node: "EnvVar"):
        return representer.represent_scalar("!env_var", node.value)

    @classmethod
    def from_yaml(cls, constructor, node: Node):
        return cls(node.value)
