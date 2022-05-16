from typing import Iterator, List, Optional

from src.automations.errors import FailedDeletion
from src.automations.types import AutomationData, ExtenededAutomationData
from src.hass_config.loader import HassConfig

from .loader import load_automation


class AutomationManager:
    def __init__(self, hass_config: HassConfig) -> None:
        self.hass_config = hass_config

    def find(
        self,
        offset: int = 0,
        limit: int = 10,
    ) -> Iterator[AutomationData]:
        tags = self.hass_config.automation_tags
        for i, auto in enumerate(self.hass_config.automations):
            if i < offset:
                continue
            if i >= offset + limit:
                break
            yield from load_automation(auto, tags.get(i, {}))

    def get(self, index: int) -> Optional[AutomationData]:
        tags = self.hass_config.automation_tags
        if index >= 0:
            for i, auto in enumerate(self.hass_config.automations):
                if i == index:
                    return next(load_automation(auto, tags.get(i, {})))
        return None

    def update(self, index: int, automation: ExtenededAutomationData):
        tags = self.hass_config.automation_tags
        automations: List[dict] = []
        updated = False
        for i, orig_auto in enumerate(self.hass_config.automations):
            if i == index:
                automations.append(automation.to_primitive())
                updated = True
            else:
                automations.append(orig_auto)
        if not updated:
            automations.append(automation.to_primitive())
        tags[index] = automation.tags
        self.hass_config.save_automations(automations)
        self.hass_config.save_tags(tags)

    def delete(self, index: int):
        automations: List[dict] = []
        deleted = False
        for i, orig_auto in enumerate(self.hass_config.automations):
            if i == index:
                deleted = True
            else:
                automations.append(orig_auto)
        if not deleted:
            raise FailedDeletion("No such automation found")
        self.hass_config.save_automations(automations)

    # TODO: improve on this without keeping things in memory
    def get_total_items(self) -> int:
        count = 0
        for i, _ in enumerate(self.hass_config.automations):
            count = i
        return count + 1
