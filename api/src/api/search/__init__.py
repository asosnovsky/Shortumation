from typing import Dict, Optional
from fastapi import APIRouter
from pydantic.main import BaseModel
from src.db import entities, connection

router = APIRouter()

db_connection = connection.HassDatabase(
    "sqlite:////home/asosnovsky/LinuxProjects/random/Shortumation/api/tests/samples/home-assistant_v2.db"
)


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
