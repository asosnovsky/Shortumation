import base64
import json
from typing import Iterable

from src.logger import get_logger

from .errors import (
    DBNoAutomationFound,
    RepeatedAutomationId,
)
from .types import ExtenededAutomation

logger = get_logger(__file__)

automations_tbl = "autos"


def encode_auto(auto: ExtenededAutomation) -> str:
    return base64.b64encode(
        json.dumps(auto.to_primitive(include_tags=True)).encode("utf-8")
    ).decode("utf-8")


def encode_obj(auto: dict | list) -> str:
    return base64.b64encode(json.dumps(auto).encode("utf-8")).decode("utf-8")


def decode_auto(
    auto_str: str, source_file: str, source_file_type: str, configuration_key: str
) -> ExtenededAutomation:
    return ExtenededAutomation(
        source_file=source_file,
        source_file_type=source_file_type,
        configuration_key=decode_obj(configuration_key),  # type: ignore
        **decode_obj(auto_str),
    )


def decode_obj(obj_str: str) -> dict | list:
    return json.loads(base64.b64decode(obj_str.encode("utf-8")).decode("utf-8"))


class AutomationDBConnection:
    def __init__(self) -> None:
        self.db: dict[str, ExtenededAutomation] = {}

    def reset(self):
        self.db = {}

    def insert_automations(self, automations: list[ExtenededAutomation]):
        repeated_automations = []
        for automation in automations:
            if self.db.get(automation.id, None) is None:
                self.db[automation.id] = automation
            else:
                repeated_automations.append(
                    f"automation id '{automation.id}' in '{automation.source_file}' was already seen before. Please check for duplicate automation ids in your files."
                )
        if len(repeated_automations) > 0:
            raise RepeatedAutomationId(repeated_automations)

    def get_automation(self, automation_id: str) -> ExtenededAutomation:
        if a := self.db.get(automation_id, None):
            return a
        raise DBNoAutomationFound(automation_id)

    def list_automations(self, offset: int, limit: int) -> Iterable[ExtenededAutomation]:
        for i, auto in enumerate(self.db.values()):
            if i >= offset and i < limit + offset:
                yield auto

    def count_automations(self) -> int:
        return len(self.db)
