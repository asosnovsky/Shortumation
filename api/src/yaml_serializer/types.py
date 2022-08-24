from typing import Protocol, TypeVar

from yaml.nodes import Node
from yaml.representer import BaseRepresenter


class Constructor(Protocol):
    @classmethod
    def to_yaml(cls, representer: BaseRepresenter, node: "Constructor"):
        ...

    @classmethod
    def from_yaml(cls, _constructor, node: Node):
        ...
