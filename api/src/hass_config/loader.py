from pathlib import Path
from typing import Optional

from src.automations.tags import TagManager
from src.yaml_serializer import IncludedYaml, IncludedYamlDir, load_yaml


class HassConfig:
    def __init__(self, root_path: Path) -> None:
        self.root_path = root_path

    @property
    def configurations(self) -> dict:
        with self.get_configuration_path().open("r") as f:
            return dict(load_yaml(f, root_path=self.root_path))  # type: ignore

    @property
    def homeassistant(self) -> dict:
        if homeassistant_config := self.configurations.get("homeassistant", None):
            if isinstance(homeassistant_config, IncludedYamlDir):  # type: ignore
                homeassistant_config = homeassistant_config.to_normalized_json()
            if isinstance(homeassistant_config, dict):
                return homeassistant_config
            else:
                raise AssertionError("configurations.homeassistant must be a dictionary!")
        return {}

    @property
    def pacakges(self) -> dict:
        if packages_config := self.homeassistant.get("packages", None):
            if isinstance(packages_config, IncludedYamlDir):  # type: ignore
                packages_config = packages_config.to_normalized_json()
            if isinstance(packages_config, dict):
                return packages_config
            else:
                raise AssertionError("configurations.homeassistant.packages must be a dictionary!")

        return {}

    @property
    def automation_tags(self) -> TagManager:
        tag_path = self.get_automation_tags_path()
        if not tag_path.exists():
            return TagManager()
        else:
            return TagManager.load(tag_path)

    def get_backup_automation_file_path(self) -> Path:
        return self.get_shortumations_path() / "automations.yaml"

    def get_default_automation_path(self) -> Optional[Path]:
        """Get Automation Path (if not included in configuration.yaml, in this case the return value is None)

        Returns:
            Optional[Path]
        """
        config = self.configurations
        if "automation" in config:
            automation_ref = config["automation"]
            if isinstance(automation_ref, IncludedYaml):
                return automation_ref.path
            else:
                return None
        return self.root_path / "automations.yaml"

    def get_shortumations_path(self) -> Path:
        shortumations_path = self.root_path / ".shortumations"
        if not shortumations_path.exists():
            shortumations_path.mkdir(parents=True, exist_ok=True)
        return shortumations_path

    def get_automation_tags_path(self) -> Path:
        return self.get_shortumations_path() / "tags.yaml"

    def get_configuration_path(self) -> Path:
        return self.root_path / "configuration.yaml"
