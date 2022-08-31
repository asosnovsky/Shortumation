from typing import Iterable

from src.logger import get_logger

from .errors import DBNoAutomationFound, RepeatedAutomationId
from .types import ExtenededAutomation

logger = get_logger(__file__)


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
