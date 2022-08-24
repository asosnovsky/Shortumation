from pathlib import Path
from typing import Optional, TextIO

import yaml


class YamlSafeLoader(yaml.SafeLoader):
    def __init__(self, stream: TextIO, root_path: Optional[Path] = None) -> None:
        super().__init__(stream)
        if root_path is None:
            self.root_path = Path.cwd()
        else:
            self.root_path = root_path
