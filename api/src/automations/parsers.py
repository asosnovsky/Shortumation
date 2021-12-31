from typing import Iterable, Union
from src.json_serializer import NOT_IMPLEMENTED_SV_MSG, json_dumps, normalize_obj
from src.yaml_serializer.types import SecretValue
from .types import AutomationActionNode, AutomationConditionNode


def _parse_actions(
    raw_actions: Iterable[Union[dict, str]]
) -> Iterable[Union[AutomationActionNode, AutomationConditionNode]]:
    for raw_c in raw_actions:
        action_type = "unknown"
        if isinstance(raw_c, str):
            yield from _parse_conditions([raw_c])
            continue
        elif isinstance(raw_c, dict):
            if raw_c.get("condition"):
                yield from _parse_conditions([raw_c])
                continue
            elif raw_c.get("service"):
                action_type = "service"
                action_data = normalize_obj(raw_c)
            elif raw_c.get("repeat"):
                action_type = "repeat"
                repeat_data = raw_c.pop("repeat")
                action_data = {
                    **raw_c,
                    "repeat": {
                        "count": repeat_data.get("count", 0),
                        "sequence": list(_parse_actions(repeat_data.get("sequence", []))),
                    },
                }
            elif raw_c.get("wait_template"):
                action_type = "wait"
                action_data = normalize_obj(raw_c)
            elif raw_c.get("event"):
                action_type = "event"
                action_data = normalize_obj(raw_c)
            elif raw_c.get("type") and raw_c.get("device_id"):
                action_type = "device"
                action_data = normalize_obj(raw_c)
            elif raw_c.get("choose"):
                action_type = "choose"
                choose_data = raw_c.pop("choose")
                default_data = raw_c.pop("default", [])
                action_data = {
                    **raw_c,
                    "choose": [
                        {
                            "conditions": list(_parse_conditions(option.get("conditions", []))),
                            "sequence": list(_parse_actions(option.get("sequence", []))),
                        }
                        for option in choose_data
                    ],
                    "default": list(_parse_actions(default_data)),
                }
            else:
                action_data = normalize_obj(raw_c)
            yield AutomationActionNode(
                action=action_type,
                action_data=action_data,
            )


def _parse_conditions(
    raw_conditions: Iterable[Union[dict, str]]
) -> Iterable[AutomationConditionNode]:
    for raw_c in raw_conditions:
        if isinstance(raw_c, str):
            yield AutomationConditionNode(
                condition="template",
                condition_data={"value_template": raw_c},
            )
        elif isinstance(raw_c, SecretValue):
            yield AutomationConditionNode(
                condition="template",
                condition_data={"value_template": NOT_IMPLEMENTED_SV_MSG},
            )
        elif isinstance(raw_c, dict):
            condition = raw_c.pop("condition")
            yield AutomationConditionNode(
                condition=condition,
                condition_data=normalize_obj(raw_c),
            )
        else:
            yield AutomationConditionNode(
                condition="template",
                condition_data=json_dumps(raw_c),
            )
