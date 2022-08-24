import io
from pathlib import Path
from typing import Any, TextIO, Type, TypeVar, Union

from .dumper import YamlSafeDumper
from .loader import YamlSafeLoader
from .types import Constructor

ConstructorT = TypeVar("ConstructorT", bound=Type[Constructor])


class YamlManager:
    Loader = YamlSafeLoader
    Dumper = YamlSafeDumper

    @classmethod
    def as_constructor(cls, *tags: str):
        def wrapper(constructor: ConstructorT) -> ConstructorT:
            for tag in tags:
                cls.Loader.add_constructor(tag, constructor.from_yaml)
            cls.Dumper.add_representer(constructor, constructor.to_yaml)
            return constructor

        return wrapper

    @classmethod
    def load_yaml(cls, yaml_stream: TextIO, root_path: Path) -> Union[dict, list]:
        """Load yaml from string using some hass-compliant yaml strings

        Args:
            yaml_stream (io.StringIO)

        Returns:
            Union[dict, list]
        """
        loader = cls.Loader(yaml_stream, root_path=root_path)
        try:
            return loader.get_single_data()
        finally:
            loader.dispose()

    @classmethod
    def dump_yaml(cls, obj: Any, root_path: Path) -> str:
        """Convert a python object to a hass-compliant yaml string

        Args:
            obj (Any)

        Returns:
            str
        """
        stream = io.StringIO()
        dumper = cls.Dumper(stream, root_path=root_path)
        try:
            dumper.open()
            dumper.represent(obj)
            dumper.close()
        finally:
            dumper.dispose()
        stream.seek(0)
        return stream.read()
