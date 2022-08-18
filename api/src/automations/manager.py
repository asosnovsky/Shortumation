from enum import auto
from pathlib import Path
from tempfile import mktemp
from typing import Dict, Optional, Union

from src.hass_config.loader import HassConfig
from src.yaml_serializer import dump_yaml, load_yaml

from ..errors import ErrorSet
from ..logger import get_logger
from .db import AutomationDBConnection
from .errors import (
    AttemptingToOverwriteAnIncompatibleFileError,
    DBError,
    InvalidAutomationFile,
)
from .loader import extract_automation_paths, get_base_automation_key, load_automation_path
from .tags import TagManager
from .types import Automation, ExtenededAutomation

logger = get_logger(__file__)


class AutomationManager:
    def __init__(
        self,
        hass_config: HassConfig,
        db_path: Optional[Path] = None,
    ) -> None:
        if db_path is None:
            db_path = Path(mktemp())
        self.hass_config = hass_config
        self.db = AutomationDBConnection(db_path)
        self.tag_path = hass_config.get_automation_tags_path()
        self.tag_manager = TagManager()
        self.reload_tags()

    def reload_tags(self):
        if self.tag_path.exists():
            self.tag_manager = TagManager.load(self.tag_path)

    def reload(self):
        self.db.reset()
        self.reload_tags()
        errors = []
        for config_key, p in extract_automation_paths(self.hass_config):
            try:
                automations = list(
                    load_automation_path(
                        self.hass_config.root_path,
                        self.hass_config.root_path / p,
                        config_key,
                        self.tag_manager,
                    )
                )
                self.db.insert_automations(automations)
            except InvalidAutomationFile as e:
                logger.warning(e)
                errors.append(e)
            except DBError as e:
                logger.warning(e)
                errors.append(e)
        if len(errors) > 0:
            raise ErrorSet(*errors)

    def list(self, offset: int, limit: int):
        return self.db.list_automations(offset=offset, limit=limit)

    def count(self):
        return self.db.count_automations()

    def get(self, auto_id: str):
        return self.db.get_automation(auto_id)

    def create(self, automation: Automation):
        config_key, config_path = get_base_automation_key(self.hass_config)
        return self.update(
            ExtenededAutomation(
                **automation.dict(),
                configuration_key=config_key,
                source_file=config_path,
                source_file_type="list",
            ),
            create_if_not_found=True,
        )

    def update(self, automation: ExtenededAutomation, create_if_not_found: bool = False):
        automation_path = self.hass_config.root_path / automation.source_file
        if not automation_path.parent.exists():
            automation_path.parent.mkdir(parents=True)

        objs: Optional[Union[list, dict]] = None
        if automation_path.exists():
            with automation_path.open("r") as fp:
                objs = load_yaml(fp)

        if automation.source_file_type == "obj":
            if isinstance(objs, list):
                raise AttemptingToOverwriteAnIncompatibleFileError(
                    f"{automation_path} is a list, but expected a obj for {automation}"
                )
            raw_auto = automation.to_primitive(include_tags=False)
            automation_path.write_text(dump_yaml(raw_auto))
        else:
            if isinstance(objs, dict):
                raise AttemptingToOverwriteAnIncompatibleFileError(
                    f"{automation_path} is a list, but expected a obj for {automation}"
                )
            elif objs is None:
                objs = []
            if not isinstance(objs, list):
                raise AssertionError(
                    f"Attemption to save automation to {automation_path} but encountering an invalid list yaml file. Did you modify this file prior to saving?\n{automation}"
                )
            found = False
            for i, obj in enumerate(objs):
                if obj["id"] == automation.id:
                    objs[i] = automation.to_primitive(include_tags=False)
                    found = True
                    break
            if not found:
                if create_if_not_found:
                    objs.append(automation.to_primitive(include_tags=False))
                else:
                    raise InvalidAutomationFile(
                        "Could not update automations, not found in source file."
                    )
            automation_path.write_text(dump_yaml(objs))
        self.update_tags(automation.id, automation.tags)

    def update_tags(self, automation_id: str, tags: Dict[str, str]):
        self.reload_tags()
        self.tag_manager[automation_id] = tags
        self.tag_manager.save(self.tag_path)

    def delete_tags(self, automation_id: str):
        self.reload_tags()
        if automation_id in self.tag_manager:
            del self.tag_manager[automation_id]
            self.tag_manager.save(self.tag_path)

    def delete(self, automation: ExtenededAutomation):
        automation_path = self.hass_config.root_path / automation.source_file
        if automation.source_file_type == "obj":
            automation_path.unlink(missing_ok=True)
        else:
            with automation_path.open("r") as fp:
                objs = load_yaml(fp)
                if not isinstance(objs, list):
                    raise AssertionError(
                        f"Attemption to save automation to {automation_path} but encountering an invalid list yaml file. Did you modify this file prior to saving?\n{automation}"
                    )
                kept = []
                for i, obj in enumerate(objs):
                    if obj["id"] != automation.id:
                        kept.append(obj)
                automation_path.write_text(dump_yaml(kept))
        self.delete_tags(automation.id)
