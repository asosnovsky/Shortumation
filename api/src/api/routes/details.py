from fastapi import APIRouter

from src.env import BUILD_VERSION, HASS_URL, HASSIO_TOKEN
from src.hass_config import HassConfig


def make_details_router(hass_config: HassConfig) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def read_details():
        return {
            "version": BUILD_VERSION,
            "hassio_token": HASSIO_TOKEN,
            "hass_url": HASS_URL,
            "config": hass_config.get_configuration_path(),
            "tags": hass_config.get_automation_tags_path(),
            "autos": hass_config.get_automation_path(),
        }

    return router
