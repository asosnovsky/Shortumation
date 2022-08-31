from typing import Optional, Union

from src.errors import ErrorSet, FormattedError
from src.hass_config.loader import HassConfig
from src.logger import get_logger
from src.yaml_serializer import dump_yaml, load_yaml

from .db import AutomationDBConnection
from .errors import (
    AttemptingToOverwriteAnIncompatibleFileError,
    DBError,
    InvalidAutomationFile,
)
from .loader import get_base_automation_key, load_and_iter_automations
from .tags import TagManager
from .types import Automation, ExtenededAutomation

logger = get_logger(__file__)


class AutomationManager:
    def __init__(
        self,
        hass_config: HassConfig,
    ) -> None:
        self.hass_config = hass_config
        self.db = AutomationDBConnection()
        self.tag_path = hass_config.get_automation_tags_path()
        self.tag_manager = TagManager()
        self.reload_tags()

    def reload_tags(self):
        if self.tag_path.exists():
            self.tag_manager = TagManager.load(self.tag_path)

    def reload(self, batch_size: int = 100):
        self.db.reset()
        self.reload_tags()
        errors = []
        auto_it = load_and_iter_automations(self.hass_config, self.tag_manager)
        batch: list[ExtenededAutomation] = []
        stop = False
        while not stop:
            try:
                batch.append(next(auto_it))
                if len(batch) >= batch_size:
                    self.db.insert_automations(batch)
                    batch = []
            except StopIteration:
                if stop:
                    break
                stop = True
            except DBError as e:
                logger.warning(e)
                errors.append(e)
        try:
            if len(batch) >= 0:
                self.db.insert_automations(batch)
        except DBError as e:
            logger.warning(FormattedError.from_error(e))
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
                objs = load_yaml(fp, self.hass_config.root_path)

        if automation.source_file_type == "obj":
            if isinstance(objs, list):
                raise AttemptingToOverwriteAnIncompatibleFileError(
                    f"{automation_path} is a list, but expected a obj for {automation}"
                )
            raw_auto = automation.to_primitive(include_tags=False)
            automation_path.write_text(dump_yaml(raw_auto, self.hass_config.root_path))
        elif automation.source_file_type == "list":
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
            update_or_append_to_automation_list(
                objs=objs,
                automation=automation,
                create_if_not_found=create_if_not_found,
            )
            automation_path.write_text(dump_yaml(objs, self.hass_config.root_path))
        elif automation.source_file_type == "inline":
            if not isinstance(objs, dict):
                raise AssertionError(
                    f"expected {automation.source_file} to be a dict instead found {type(objs)}"
                )
            update_obj = objs
            for key in automation.configuration_key:
                update_obj = update_obj[key]
            if not isinstance(update_obj, list):
                raise AssertionError(
                    f"expected {automation.source_file}@{automation.configuration_key} to be a list instead found {type(update_obj)}"
                )
            update_or_append_to_automation_list(
                objs=update_obj,
                automation=automation,
                create_if_not_found=create_if_not_found,
            )
            automation_path.write_text(dump_yaml(objs, self.hass_config.root_path))

        self.update_tags(automation.id, automation.tags)

    def update_tags(self, automation_id: str, tags: dict[str, str]):
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
                objs = load_yaml(fp, self.hass_config.root_path)
                if not isinstance(objs, list):
                    raise AssertionError(
                        f"Attemption to save automation to {automation_path} but encountering an invalid list yaml file. Did you modify this file prior to saving?\n{automation}"
                    )
                kept = []
                for i, obj in enumerate(objs):
                    if obj["id"] != automation.id:
                        kept.append(obj)
                automation_path.write_text(dump_yaml(kept, self.hass_config.root_path))
        self.delete_tags(automation.id)


def update_or_append_to_automation_list(
    objs: list[dict],
    automation: ExtenededAutomation,
    create_if_not_found: bool = False,
):
    for i, obj in enumerate(objs):
        if obj["id"] == automation.id:
            objs[i] = automation.to_primitive(include_tags=False)
            return True
    if create_if_not_found:
        objs.append(automation.to_primitive(include_tags=False))
    else:
        raise InvalidAutomationFile("Could not update automations, not found in source file.")
    return False
