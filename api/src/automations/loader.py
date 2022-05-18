from typing import Any, Iterator, Union

from pydantic.error_wrappers import ValidationError

from src.json_serializer import normalize_obj

from .errors import InvalidAutomationFile
from .types import AutomationMetdata, ExtenededAutomationData


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
            condition=ifempty_or_null_then_list(load_conditions(auto_raw.get("condition", []))),
            sequence=ifempty_or_null_then_list(load_conditions(auto_raw.get("action", []))),
            trigger=ifempty_or_null_then_list(normalize_obj(auto_raw.get("trigger", []))),
            tags=tags,
        )
    except ValidationError as err:
        raise InvalidAutomationFile from err


def ifempty_or_null_then_list(obj: Any):
    if not isinstance(obj, list):
        return []
    else:
        return obj


def load_conditions(conditions: Union[dict, list, str]):
    if isinstance(conditions, list):
        return list(map(ensure_condition_dictionary, conditions))
    elif not conditions:
        return []
    else:
        return [ensure_condition_dictionary(conditions)]


def ensure_condition_dictionary(c: Union[str, dict]):
    c = normalize_obj(c)
    if isinstance(c, str):
        return {"condition": "template", "value_template": c}
    elif isinstance(c, dict):
        return c
    raise InvalidAutomationFile(f"Invalid type for condition object {c}")
