import json
from pathlib import Path
from typing import Iterator, Literal, NamedTuple, Optional, Union

from pydantic import BaseModel
from pydantic.fields import Field

from src.yaml_serializer import IncludedYamlDir

ConfigurationKey = list[str]


class InlineAutomation(NamedTuple):
    configuration_key: ConfigurationKey
    source_file: Path
    automations: list[dict]

    def __repr__(self) -> str:
        return f"InlineAutomation(configuration_key='{self.configuration_key}', source_file='{self.source_file}')"


class IncludedAutoamtion(NamedTuple):
    configuration_key: ConfigurationKey
    ref: IncludedYamlDir

    def __repr__(self) -> str:
        return f"InlineAutomation(configuration_key='{self.configuration_key}', ref='{self.ref}')"


ExtractedAutomation = InlineAutomation | IncludedAutoamtion
AutomationExtractedIter = Iterator[ExtractedAutomation]


class BaseAutomation(BaseModel):
    id: Optional[str]
    alias: Optional[str] = None
    description: Optional[str] = None
    trigger_variables: Optional[dict[str, Union[str, int, bool, float]]] = None
    mode: str = "single"
    trigger: list[dict] = []
    condition: list[dict] = []
    action: list[dict] = []

    def to_primitive(self, exclude_unset=True, exclude_none=True, **kwrgs):
        return BaseModel.dict(self, exclude_unset=exclude_unset, exclude_none=exclude_none, **kwrgs)

    def dict(self, **kwrgs):
        kwrgs["exclude_unset"] = True
        kwrgs["exclude_none"] = True
        return self.to_primitive(
            **kwrgs,
        )


class Automation(BaseAutomation):
    tags: dict[str, str] = Field(default_factory=dict)

    def to_primitive(self, include_tags: bool = False, **kwrgs):
        out = super().to_primitive(**kwrgs)
        if not include_tags and out.get("tags", None) is not None:
            del out["tags"]
        if include_tags and out.get("tags", None) is None:
            out["tags"] = {}
        return out

    def dict(self, **kwrgs):
        return BaseAutomation.dict(self, **kwrgs, include_tags=True)


class ExtenededAutomation(Automation):
    source_file: str
    source_file_type: Literal["list", "obj", "inline"]
    configuration_key: ConfigurationKey

    def to_primitive(self, include_tags: bool = False, **kwrgs):
        out = super().to_primitive(include_tags=include_tags, **kwrgs)
        del out["source_file"]
        del out["source_file_type"]
        del out["configuration_key"]
        return out

    def to_json(self):
        return json.loads(self.json())
