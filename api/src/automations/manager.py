from typing import Iterator, Optional
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
