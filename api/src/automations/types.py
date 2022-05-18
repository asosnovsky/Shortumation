from typing import Dict, List, Literal, Optional, Union

from pydantic import BaseModel
from pydantic.fields import Field


class AutomationMetdata(BaseModel):
    id: str
    alias: Optional[str] = None
    description: Optional[str] = None
    trigger_variables: Optional[Dict[str, Union[str, int, bool, float]]] = None
    mode: str = "single"


class AutomationData(BaseModel):
    metadata: AutomationMetdata
    trigger: List[dict] = []
    condition: List[dict] = []
    sequence: List[dict] = []

    def to_primitive(self):
        return {
            **self.metadata.dict(exclude_unset=True, exclude_none=True),
            "trigger": self.trigger,
            "condition": self.condition,
            "action": self.sequence,
        }


class ExtenededAutomationData(AutomationData):
    tags: Dict[str, str] = Field(default_factory=dict)
