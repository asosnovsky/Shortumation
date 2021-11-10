from fastapi import APIRouter
from datetime import datetime

from ..env import BUILD_VERSION

router = APIRouter()


@router.get("/ping")
def read_ping():
    return {
        "version": BUILD_VERSION,
        "current_time": datetime.now(),
    }
