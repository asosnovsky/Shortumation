from typing import Dict, Generic, List, TypeVar

from pydantic import BaseModel
from pydantic.fields import Field
from pydantic.generics import GenericModel

DataT = TypeVar("DataT")


class ListParams(BaseModel):
    offset: int
    limit: int


class ListData(GenericModel, Generic[DataT]):
    params: ListParams
    total_items: int = Field(alias="totalItems")
    data: List[DataT]


class UpdateTags(BaseModel):
    automation_id: str = Field(description="Automation Id to update")
    tags: Dict[str, str]
