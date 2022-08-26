from pathlib import Path

from src.yaml_serializer import dump_yaml, load_yaml


class TagManager(dict[str, dict[str, str]]):
    def save(self, path: Path):
        if not path.parent.exists():
            path.parent.mkdir(parents=True)
        path.write_text(dump_yaml(dict(self), root_path=path.parent))

    @classmethod
    def load(cls, path: Path):
        with path.open("r") as fp:
            return cls(load_yaml(fp, root_path=path.parent))
