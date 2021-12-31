from pathlib import Path
from typing import List

from src.yaml_serializer import load_yaml
from src.yaml_serializer.types import IncludedYaml


class HassConfig:
    def __init__(self, root_path: Path) -> None:
        self.root_path = root_path

    @property
    def configurations(self) -> dict:
        with (self.root_path / "configuration.yaml").open("r") as f:
            return dict(load_yaml(f))  # type: ignore

    @property
    def automations(self) -> List[dict]:
        automation_path = self.root_path / "automations.yaml"
        config = self.configurations
        if "automation" in config:
            automation_ref = config["automation"]
            if isinstance(automation_ref, IncludedYaml):
                automation_path = automation_ref.path
            else:
                return list(config["automation"])
        with automation_path.open("r") as f:
            return list(load_yaml(f))  # type: ignore
