from typing import Optional
from fastapi import APIRouter, HTTPException

from src.config.AutomationLoader import AutomationData, AutomationLoaderException

from ..config import automation_loader

router = APIRouter()


@router.get("/list")
def list_autos(
    offset: int = 0,
    limit: int = 10,
    alias: Optional[str] = None,
    description: Optional[str] = None,
    mode: Optional[str] = None,
):
    return list(
        automation_loader.find(
            offset=offset,
            limit=limit,
            alias=alias,
            description=description,
            mode=mode,
        )
    )


@router.get("/{index}")
def get_auto(index: int):
    if auto := automation_loader.get(index):
        return auto
    else:
        raise HTTPException(
            status_code=400,
            detail={
                "index": "out of bounds",
                "must_be": f">= 0 or < {len(automation_loader)}",
                "specified": index,
            },
        )


@router.post("/{index}")
def upsert_auto(index: int, auto: AutomationData):
    try:
        automation_loader.save(index, auto)
    except AutomationLoaderException as err:
        return HTTPException(
            status_code=500,
            detail=err.args,
        )
