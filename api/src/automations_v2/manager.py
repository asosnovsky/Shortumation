from enum import auto
from pathlib import Path
from tempfile import mktemp
from typing import Optional, Union

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
from .loader import extract_automation_paths, load_automation_path
from .tags import TagManager
from .types import ExtenededAutomation

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
                automations = list(load_automation_path(p, config_key, self.tag_manager))
                self.db.upsert_automations(automations)
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

    def upsert(self, automation: ExtenededAutomation):
        if not automation.source_file.parent.exists():
            automation.source_file.parent.mkdir(parents=True)

        objs: Optional[Union[list, dict]] = None
        if automation.source_file.exists():
            with automation.source_file.open("r") as fp:
                objs = load_yaml(fp)

        if automation.source_file_type == "obj":
            if isinstance(objs, list):
                raise AttemptingToOverwriteAnIncompatibleFileError(
                    f"{automation.source_file} is a list, but expected a obj for {automation}"
                )
            raw_auto = automation.to_primitive(include_tags=False)
            automation.source_file.write_text(dump_yaml(raw_auto))
        else:
            if isinstance(objs, dict):
                raise AttemptingToOverwriteAnIncompatibleFileError(
                    f"{automation.source_file} is a list, but expected a obj for {automation}"
                )
            elif objs is None:
                objs = []
            if not isinstance(objs, list):
                raise AssertionError(
                    f"Attemption to save automation to {automation.source_file} but encountering an invalid list yaml file. Did you modify this file prior to saving?\n{automation}"
                )
            found = False
            for i, obj in enumerate(objs):
                if obj["id"] == automation.id:
                    objs[i] = automation.to_primitive(include_tags=False)
                    found = True
                    break
            if not found:
                objs.append(automation.to_primitive(include_tags=False))
            automation.source_file.write_text(dump_yaml(objs))
        self.update_tags(automation)

    def update_tags(self, automation: ExtenededAutomation):
        self.reload_tags()
        self.tag_manager[automation.id] = automation.tags
        self.tag_manager.save(self.tag_path)

    def delete_tags(self, automation_id: str):
        self.reload_tags()
        if automation_id in self.tag_manager:
            del self.tag_manager[automation_id]
            self.tag_manager.save(self.tag_path)

    def delete(self, automation: ExtenededAutomation):
        if automation.source_file_type == "obj":
            automation.source_file.unlink(missing_ok=True)
        else:
            with automation.source_file.open("r") as fp:
                objs = load_yaml(fp)
                if not isinstance(objs, list):
                    raise AssertionError(
                        f"Attemption to save automation to {automation.source_file} but encountering an invalid list yaml file. Did you modify this file prior to saving?\n{automation}"
                    )
                kept = []
                for i, obj in enumerate(objs):
                    if obj["id"] != automation.id:
                        kept.append(obj)
                automation.source_file.write_text(dump_yaml(kept))
        self.delete_tags(automation.id)
