from fastapi import APIRouter
from datetime import datetime

from src.hass_config import HassConfig
from src.env import BUILD_VERSION



def make_details_router(hass_config: HassConfig) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def read_ping():
        return {
            "version": BUILD_VERSION,
            "config": hass_config.get_configuration_path(),
            "tags": hass_config.get_automation_tags_path(),
            "autos": hass_config.get_automation_path(),
        }

    return router