from typing import Dict, Generic, List, TypeVar

from pydantic import BaseModel
from pydantic.fields import Field
from pydantic.generics import GenericModel

from src.automations.types import ExtenededAutomationData

DataT = TypeVar("DataT")


class ListParams(BaseModel):
    offset: int
    limit: int


class ListData(GenericModel, Generic[DataT]):
    params: ListParams
    total_items: int = Field(alias="totalItems")
    data: List[DataT]


class UpdateAutoRequest(BaseModel):
    index: int = Field(description="Index of the automation to update")
    data: ExtenededAutomationData


class UpdateTags(BaseModel):
    automation_id: str = Field(description="Automation Id to update")
    tags: Dict[str, str]


class DeleteAutoRequest(BaseModel):
    index: int = Field(description="Index of the automation to update")
