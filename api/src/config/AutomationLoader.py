from typing import Dict, Iterable, List, Literal, Optional, Union
from pydantic.fields import Field
from src.json_serializer import NOT_IMPLEMENTED_SV_MSG, json_dumps, normalize_obj
from src.yaml_serializer import HassConfig, IncludedYaml, SecretValue
from pydantic import BaseModel

# errors
class AutomationLoaderException(Exception):
    pass


# types
class AutomationConditionNode(BaseModel):
    condition: str
    condition_data: dict
    node_type: Literal["condition"] = Field(alias="$smType", default="condition")


class AutomationActionNode(BaseModel):
    action: str
    action_data: dict
    node_type: Literal["action"] = Field(alias="$smType", default="action")


class AutomationMetdata(BaseModel):
    id: str
    alias: Optional[str] = None
    description: Optional[str] = None
    trigger_variables: Optional[Dict[str, Union[str, int, bool, float]]] = None
    mode: Literal["single", "restart", "queued", "parallel"] = "single"


class AutomationData(BaseModel):
    metadata: AutomationMetdata
    trigger: List[dict] = []
    condition: List[AutomationConditionNode] = []
    action: List[Union[AutomationConditionNode, AutomationActionNode]] = []


# Single loader
def load_automation(
    automations_raw_data: List[dict],
) -> Iterable[AutomationData]:
    """Converts an automation dictionary loaded directly from the config into
    several python typed objects

    Args:
        automations_raw_data (List[dict])

    Returns:
        Iterable[AutomationData]

    """
    for auto_raw in automations_raw_data:
        yield AutomationData(
            metadata=AutomationMetdata.parse_obj(auto_raw),
            condition=list(_parse_conditions(auto_raw.get("condition", []))),
            action=list(_parse_actions(auto_raw.get("action", []))),
            trigger=[normalize_obj(obj) for obj in auto_raw.get("trigger", [])],
        )


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
        yield AutomationActionNode(action=action_type, action_data=action_data)


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


# Global Loader
class AutomationLoader:
    def __init__(self, loaded_yaml: HassConfig) -> None:
        self.automation_ref = loaded_yaml.config.get("automation", None)

        if isinstance(self.automation_ref, IncludedYaml):
            self.automation_raw_data: list = self.automation_ref.data
        else:
            self.automation_raw_data: list = self.automation_ref
            self.automation_ref = None

        if not isinstance(self.automation_raw_data, list):
            raise AutomationLoaderException(
                f"Invalid automation file, expected it to be a 'list' instead it's a '{type(self.automation_raw_data)}' --> `automation: {self.automation_raw_data}`"
            )

        self.automations_data = list(load_automation(self.automation_raw_data))

    def find(
        self,
        offset: int = 0,
        limit: int = 10,
        alias: Optional[str] = None,
        description: Optional[str] = None,
        mode: Optional[str] = None,
    ):
        for auto in self.automations_data[offset : (offset + limit)]:
            if alias is not None:
                if auto.metadata.alias.lower().count(alias.lower()) <= 0:
                    continue
            if description is not None:
                if auto.metadata.description.lower().count(description.lower()) <= 0:
                    continue
            if mode is not None:
                if auto.metadata.mode.lower().count(mode.lower()) <= 0:
                    continue
            yield auto

    def get(self, index: int):
        if (index < 0) or (len(self.automations_data) <= index):
            return None
        return self.automations_data[index]

    def __len__(self):
        return len(self.automations_data)

    def save(self, index: int, auto: AutomationData):
        if isinstance(self.automation_ref, IncludedYaml):
            self.automation_ref.original_path
