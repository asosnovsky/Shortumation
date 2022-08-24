import yaml

from pathlib import Path
from typing import Optional, TextIO


class YamlSafeDumper(yaml.SafeDumper):
    def __init__(self, stream: TextIO, root_path: Optional[Path] = None) -> None:
        if root_path is None:
            self.root_path = Path.cwd()
        else:
            self.root_path = root_path

        super().__init__(
            stream,
            default_flow_style=False,
            allow_unicode=True,
            sort_keys=False,
        )
