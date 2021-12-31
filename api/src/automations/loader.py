from itertools import chain
from typing import Iterable, Iterator
from src.json_serializer import normalize_obj
from .types import AutomationData, AutomationMetdata
from .parsers import _parse_actions

# Single loader
def load_automation(
    automations_raw_data: Iterable[dict],
) -> Iterator[AutomationData]:
    """Converts an automation dictionary loaded directly from the config into
    several python typed objects

    Args:
        automations_raw_data (Iterable[dict])

    Returns:
        Iterator[AutomationData]

    """
    for auto_raw in automations_raw_data:
        yield AutomationData(
            metadata=AutomationMetdata.parse_obj(auto_raw),
            sequence=list(
                _parse_actions(
                    chain(
                        auto_raw.get("condition", []),
                        auto_raw.get("action", []),
                    )
                )
            ),
            trigger=[normalize_obj(obj) for obj in auto_raw.get("trigger", [])],
        )
