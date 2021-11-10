import json
from pydantic import BaseModel
from typing import Dict, Iterable, List, Optional, Union
from .connection import HassDatabase


class Entity(BaseModel):
    entity_id: str
    domain: str
    attributes: dict


def search(
    db_connection: HassDatabase,
    search_text: str,
    offset: int = 0,
    limit: int = 100,
    domain_filter: Optional[str] = None,
    attributes_filter: Optional[Dict[str, Union[str, bool, int, float]]] = None,
) -> Iterable[Entity]:
    filter_sql = f"entity_id like '%%{search_text}%%' AND old_state_id is NULL"
    if domain_filter:
        filter_sql += f" AND `domain` like '%%{domain_filter}%%'"
    for entity_id, domain, attributes_str in db_connection.execute_sql(
        f"""
        SELECT 
            entity_id,
            `domain` ,
            `attributes` 
        FROM 
            states
        WHERE 
        {filter_sql}
        LIMIT {offset}, {limit}
"""
    ):
        attributes: dict = json.loads(attributes_str)
        if attributes_filter:
            if not _compare_attr(attributes, attributes_filter):
                continue
        yield Entity(
            entity_id=entity_id,
            domain=domain,
            attributes=attributes,
        )


def _compare_attr(attributes: dict, attributes_filter: dict) -> bool:
    for attr_name, attr_value in attributes_filter.items():
        if attr_name not in attributes:
            return False
        if not type(attributes[attr_name]) == type(attr_value):
            return False
        if isinstance(attr_value, str):
            if attributes[attr_name].find(attr_value) < 0:
                return False
        if attributes[attr_name] != attr_value:
            return False
    return True
