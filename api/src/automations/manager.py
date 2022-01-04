from typing import Iterator, List, Optional
from src.automations.errors import FailedDeletion
from src.automations.types import AutomationData
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
        for i, auto in enumerate(self.hass_config.automations):
            if i < offset:
                continue
            if i > offset + limit:
                break
            yield from load_automation([auto])

    def get(self, index: int) -> Optional[AutomationData]:
        if index >= 0:
            for i, auto in enumerate(self.hass_config.automations):
                if i == index:
                    return next(load_automation(([auto])))
        return None

    def update(self, index: int, automation: AutomationData):
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
        self.hass_config.save_automations(automations)

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
