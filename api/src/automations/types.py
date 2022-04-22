from typing import Dict, List, Literal, Optional, Union
from pydantic.fields import Field
from pydantic import BaseModel


class AutomationConditionNode(BaseModel):
    condition: str
    condition_data: dict
    node_type: Literal["condition"] = Field(alias="$smType", default="condition")

    def to_primitive(self):
        return {
            **self.condition_data,
            "condition": self.condition,
        }


class AutomationActionNode(BaseModel):
    action: str
    action_data: dict
    node_type: Literal["action"] = Field(alias="$smType", default="action")

    def to_primitive(self):
        return self.action_data


class AutomationMetdata(BaseModel):
    id: str
    alias: Optional[str] = None
    description: Optional[str] = None
    trigger_variables: Optional[Dict[str, Union[str, int, bool, float]]] = None
    mode: Literal["single", "restart", "queued", "parallel"] = "single"


class AutomationData(BaseModel):
    metadata: AutomationMetdata
    trigger: List[dict] = []
    sequence: List[Union[AutomationConditionNode, AutomationActionNode]] = []

    def to_primitive(self):
        return {
            **self.metadata.dict(),
            "trigger": self.trigger,
            "condition": [],
            "action": [action.to_primitive() for action in self.sequence],
        }

class ExtenededAutomationData(AutomationData):
    tags: Dict[str, str] = Field(default_factory=dict)