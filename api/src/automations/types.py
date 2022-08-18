import json
from pathlib import Path
from typing import Dict, List, Literal, Optional, Union

from pydantic import BaseModel
from pydantic.fields import Field


class BaseAutomation(BaseModel):
    id: str
    alias: Optional[str] = None
    description: Optional[str] = None
    trigger_variables: Optional[Dict[str, Union[str, int, bool, float]]] = None
    mode: str = "single"
    trigger: List[dict] = []
    condition: List[dict] = []
    action: List[dict] = []

    def to_primitive(self):
        return self.dict(exclude_unset=True, exclude_none=True)


class Automation(BaseAutomation):
    tags: Dict[str, str] = Field(default_factory=dict)

    def to_primitive(self, include_tags: bool = False):
        out = super().to_primitive()
        if not include_tags and out.get("tags", None) is not None:
            del out["tags"]
        return out


class ExtenededAutomation(Automation):
    source_file: str
    source_file_type: Literal["list", "obj"]
    configuration_key: str

    def to_primitive(self, include_tags: bool = False):
        out = super().to_primitive(include_tags=include_tags)
        del out["source_file"]
        del out["source_file_type"]
        del out["configuration_key"]
        return out

    def to_json(self):
        return json.loads(self.json())
