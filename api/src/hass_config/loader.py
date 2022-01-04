from pathlib import Path
from typing import List, Optional

from src.yaml_serializer import load_yaml, dump_yaml
from src.yaml_serializer.types import IncludedYaml
from .errors import MissingFile


class HassConfig:
    def __init__(self, root_path: Path) -> None:
        self.root_path = root_path

    @property
    def configurations(self) -> dict:
        with self.get_configuration_path().open("r") as f:
            return dict(load_yaml(f))  # type: ignore

    @property
    def automations(self) -> List[dict]:
        if automation_path := self.get_automation_path():
            try:
                with automation_path.open("r") as f:
                    return load_yaml(f)  # type: ignore
            except FileNotFoundError as err:
                raise MissingFile("automations.yaml") from err
        return self.configurations["automation"]

    def get_configuration_path(self) -> Path:
        return self.root_path / "configuration.yaml"

    def get_automation_path(self) -> Optional[Path]:
        """Get Automation Path (if not included in configuration.yaml, in this case the return value is None)

        Returns:
            Optional[Path]
        """
        config = self.configurations
        if "automation" in config:
            automation_ref = config["automation"]
            if isinstance(automation_ref, IncludedYaml):
                return self.root_path / automation_ref.path_str
            else:
                return None
        return self.root_path / "automations.yaml"

    def save_automations(self, automations: List[dict]):
        if automation_path := self.get_automation_path():
            automation_path.write_text(dump_yaml(automations))
        else:
            self.get_configuration_path().write_text(
                dump_yaml({**self.configurations, "automation": automations})
            )
