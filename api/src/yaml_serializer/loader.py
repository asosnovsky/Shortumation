import yaml

from pathlib import Path
from typing import Optional, Union, TextIO


class YamlSafeLoader(yaml.SafeLoader):
    def __init__(self, stream: Union[TextIO, Path], root_path: Optional[Path] = None) -> None:
        super().__init__(stream)
        if isinstance(stream, Path) and root_path is None:
            self.root_path = stream.parent
        elif root_path is None:
            self.root_path = Path.cwd()
        else:
            self.root_path = root_path
