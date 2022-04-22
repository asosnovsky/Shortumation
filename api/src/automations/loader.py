from itertools import chain
from typing import Iterable, Iterator
from pydantic.error_wrappers import ValidationError
from src.automations.tags import TagManager
from src.json_serializer import normalize_obj
from .types import AutomationData, AutomationMetdata, ExtenededAutomationData
from .parsers import _parse_actions
from .errors import InvalidAutomationFile

# Single loader
def load_automation(
    auto_raw: dict,
    tags: dict,
) -> Iterator[ExtenededAutomationData]:
    """Converts an automation dictionary loaded directly from the config into
    several python typed objects

    Args:
        automations_raw_data (Iterable[dict])

    Returns:
        Iterator[ExtenededAutomationData]

    """
    try:
        yield ExtenededAutomationData(
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
            tags=tags,
        )
    except ValidationError as err:
        raise InvalidAutomationFile from err
