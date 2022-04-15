


from pathlib import Path
from typing import Dict, List
from src.yaml_serializer import dump_yaml, load_yaml

class TagManager(Dict[str, List[str]]):
    def save(self, path: Path):
        path.write_text(dump_yaml(self))
    
    @classmethod
    def load(cls, path: Path):
        with path.open('r') as fp:
            return cls(load_yaml(fp))