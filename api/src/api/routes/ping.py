from fastapi import APIRouter
from datetime import datetime

from src.env import BUILD_VERSION

router = APIRouter()


@router.get("/")
def read_ping():
    return {
        "version": BUILD_VERSION,
        "current_time": datetime.now(),
    }
