from typing import Optional
from fastapi import APIRouter, HTTPException

from ..config import automation_loader

router = APIRouter()


@router.get("/list")
def read_ping(
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
def read_ping(index: int):
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
