from typing import Optional
from fastapi import APIRouter
from pydantic.main import BaseModel
from src.db import entities
from ..config import db_connection

router = APIRouter()


class EntityRequest(BaseModel):
    domain: Optional[str] = None
    attributes: Optional[dict] = None


@router.post("/entity_id")
def search(
    search_text: str,
    offset: int = 0,
    limit: int = 30,
    filter_objects: Optional[EntityRequest] = EntityRequest(),
):

    return entities.search(
        db_connection,
        search_text=search_text,
        domain_filter=filter_objects.domain,
        attributes_filter=filter_objects.attributes,
        offset=offset,
        limit=limit,
    )
