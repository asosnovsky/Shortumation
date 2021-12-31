from typing import List, Optional
from src.yaml_serializer.types import IncludedYaml
from src.yaml_serializer import load_yaml, dump_yaml
from .types import AutomationData, AutomationMetdata
from .parsers import _parse_actions
from .errors import AutomationLoaderException

# Global Loader
class AutomationLoader:
    def __init__(self, hass_config: HassConfig) -> None:
        self.hass_config = hass_config
        self.automation_ref = hass_config.config.get("automation", None)

        if isinstance(self.automation_ref, IncludedYaml):
            self.automation_raw_data: list = self.automation_ref.data
        else:
            self.automation_raw_data: list = self.automation_ref
            self.automation_ref = None

        if not isinstance(self.automation_raw_data, list):
            raise AutomationLoaderException(
                f"Invalid automation file, expected it to be a 'list' instead it's a '{type(self.automation_raw_data)}' --> `automation: {self.automation_raw_data}`"
            )

        self.automations_data = list(load_automation(self.automation_raw_data))

    def find(
        self,
        offset: int = 0,
        limit: int = 10,
        alias: Optional[str] = None,
        description: Optional[str] = None,
        mode: Optional[str] = None,
    ):
        for auto in self.automations_data[offset : (offset + limit)]:
            if alias is not None:
                if auto.metadata.alias.lower().count(alias.lower()) <= 0:
                    continue
            if description is not None:
                if auto.metadata.description.lower().count(description.lower()) <= 0:
                    continue
            if mode is not None:
                if auto.metadata.mode.lower().count(mode.lower()) <= 0:
                    continue
            yield auto

    def get(self, index: int):
        if (index < 0) or (len(self.automations_data) <= index):
            return None
        return self.automations_data[index]

    def __len__(self):
        return len(self.automations_data)

    def save(self, index: int, auto: AutomationData):
        """Save or create automation on disk and in-memory

        Args:
            index (int): index of the automation
            auto (AutomationData): automation data

        """
        # Update in-memory store
        if len(self) <= index:
            self.automations_data.append(auto)
        else:
            self.automations_data[index] = auto
        # Load a simple version of the latest data on disk
        if not isinstance(self.automation_ref, IncludedYaml):
            with self.hass_config.root_config_path.open("r") as f:
                hass_config_yaml = load_yaml(f)
            original_yaml_path = f"{self.hass_config.root_config_path}>automation"
            if "automation" not in hass_config_yaml:
                raise AutomationLoaderException(
                    f'missing "automation" key in {self.hass_config.root_config_path}'
                )
            original_yaml = hass_config_yaml["automation"]
        else:
            with self.automation_ref.original_path.open("r") as f:
                original_yaml = load_yaml(f)
            original_yaml_path = f"{self.automation_ref.original_path}"

        if not isinstance(original_yaml, list):
            raise AutomationLoaderException(
                f"Invalid data received from {original_yaml_path} expected a list"
            )
        # Upsert automation
        if len(original_yaml) <= index:
            original_yaml.append(auto.to_primitive())
        else:
            original_yaml[index] = auto.to_primitive()

        # Save back to disk
        if isinstance(self.automation_ref, IncludedYaml):
            with self.automation_ref.original_path.open("w") as f:
                f.write(dump_yaml(original_yaml))
        else:
            hass_config_yaml["automation"] = original_yaml
            with self.hass_config.root_config_path.open("w") as f:
                f.write(dump_yaml(hass_config_yaml))
