from typing import Protocol

from yaml.nodes import Node

from .dumper import YamlSafeDumper
from .loader import YamlSafeLoader


class Constructor(Protocol):
    @classmethod
    def to_yaml(cls, representer: YamlSafeDumper, node: "Constructor"):
        ...

    @classmethod
    def from_yaml(cls, constructor: YamlSafeLoader, node: Node):
        ...
