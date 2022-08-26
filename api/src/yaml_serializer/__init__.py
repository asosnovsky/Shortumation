from pathlib import Path
from typing import Iterator, NamedTuple, Tuple, Union

from yaml.nodes import Node

from .manager import YamlManager

dump_yaml = YamlManager.dump_yaml
load_yaml = YamlManager.load_yaml


def load_dir_yaml(folder_or_file: Path) -> Iterator[Tuple[Path, dict | list]]:
    if folder_or_file.is_dir():
        for file in folder_or_file.iterdir():
            yield from load_dir_yaml(file)
    else:
        with folder_or_file.open("r") as fp:
            yield folder_or_file, load_yaml(fp, root_path=folder_or_file.parent)


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
    "!include_dir_merge_named",
)
class IncludedYamlDirMergedNamed(NamedTuple):
    path: Path

    @classmethod
    def to_yaml(cls, representer, node: "IncludedYamlDirMergedNamed"):
        return representer.represent_scalar(
            f"!include_dir_merge_named", str(node.path.relative_to(representer.root_path))
        )

    @classmethod
    def from_yaml(cls, constructor, node: Node):
        return cls(constructor.root_path / node.value)

    def to_normalized_json(self):
        out = {}
        for path, data in load_dir_yaml(self.path):
            overlap = set(data.keys()).intersection(set(out.keys()))
            if len(overlap) > 0:
                raise AssertionError(
                    f"The keys {overlap} were found in more than 1 file, cannot handle overlapping keys due to undefined behavior expectation. See {path}"
                )

            out = {
                **out,
                **data,
            }

        return out


@YamlManager.as_constructor(
    "!include_dir_named",
)
class IncludedYamlDirNamed(NamedTuple):
    path: Path

    @classmethod
    def to_yaml(cls, representer, node: "IncludedYamlDirNamed"):
        return representer.represent_scalar(
            f"!include_dir_named", str(node.path.relative_to(representer.root_path))
        )

    @classmethod
    def from_yaml(cls, constructor, node: Node):
        return cls(constructor.root_path / node.value)

    def to_normalized_json(self):
        out = {}
        for path, data in load_dir_yaml(self.path):
            if out.get(path.name, None) is None:
                out[path.stem] = data
            else:
                raise AssertionError(
                    f"expected {path.name} to be a unique file name but found a second file name in {path}"
                )

        return out


@YamlManager.as_constructor(
    "!include_dir_merge_list",
)
class IncludedYamlMergeListDir(NamedTuple):
    path: Path

    @classmethod
    def to_yaml(cls, representer, node: "IncludedYamlMergeListDir"):
        return representer.represent_scalar(
            f"!include_dir_merge_list", str(node.path.relative_to(representer.root_path))
        )

    @classmethod
    def from_yaml(cls, constructor, node: Node):
        return cls(constructor.root_path / node.value)

    def to_normalized_json(self):
        out = []
        for path, data in load_dir_yaml(self.path):
            if isinstance(data, list):
                out.extend(data)
            else:
                raise AssertionError(f"expected {path} to be a list but got an object")

        return out


@YamlManager.as_constructor(
    "!include_dir_list",
)
class IncludedYamlDirList(NamedTuple):
    path: Path

    @classmethod
    def to_yaml(cls, representer, node: "IncludedYamlDirList"):
        return representer.represent_scalar(
            f"!include_dir_list", str(node.path.relative_to(representer.root_path))
        )

    @classmethod
    def from_yaml(cls, constructor, node: Node):
        return cls(constructor.root_path / node.value)

    def to_normalized_json(self):
        return [data for _, data in load_dir_yaml(self.path)]


IncludedYamlDir = (
    IncludedYamlDirMergedNamed
    | IncludedYamlDirNamed
    | IncludedYamlMergeListDir
    | IncludedYamlDirList
    | IncludedYaml
)


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
