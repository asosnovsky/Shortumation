from pathlib import Path

from src.hass_config.loader import HassConfig
from src.yaml_serializer import dump_yaml, load_yaml
from .types import ExtenededAutomationData
from .watchers.config import ConfigFileWatcher
from .db import AutomationDBConnection


class AutomationManager:
    def __init__(self, hass_config: HassConfig, db_path: Path) -> None:
        self.hass_config = hass_config
        self.db = AutomationDBConnection(db_path)
        self.config_watcher = ConfigFileWatcher(
            self.hass_config.get_configuration_path(),
            self.db.db_file,
        )
        self.config_watcher.start()

    def __del__(self):
        self.config_watcher.join()

    @property
    def is_db_loaded(self):
        return self.config_watcher.is_loaded

    def list(self, offset: int, limit: int):
        return self.db.list_automations(offset=offset, limit=limit)

    def count(self):
        return self.db.count_automations()

    def get(self, auto_id: str):
        return self.db.get_automation(auto_id)

    def update(self, automation: ExtenededAutomationData):
        if automation.source_file_type == "obj":
            raw_auto = automation.to_primitive(include_tags=False)
            automation.source_file.write_text(dump_yaml(raw_auto))
        else:
            with automation.source_file.open("r") as fp:
                objs = load_yaml(fp)
                if not isinstance(objs, list):
                    raise AssertionError(
                        f"Attemption to save automation to {automation.source_file} but encountering an invalid list yaml file. Did you modify this file prior to saving?\n{automation}"
                    )
                for i, obj in enumerate(objs):
                    if obj["id"] == automation.id:
                        objs[i] = automation.to_primitive(include_tags=False)
                        break
                automation.source_file.write_text(dump_yaml(objs))
