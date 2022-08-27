from fastapi import APIRouter

from src.automations.loader import extract_automation_refs
from src.env import BUILD_VERSION, HASSIO_TOKEN, HASSIO_WS
from src.hass_config import HassConfig


def make_details_router(hass_config: HassConfig) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def read_details():
        return {
            "version": BUILD_VERSION,
            "hassio_token": HASSIO_TOKEN,
            "hassio_url": HASSIO_WS,
            "config": hass_config.get_configuration_path(),
            "tags": hass_config.get_automation_tags_path(),
            "autos": {
                config_key: auto_file
                for config_key, auto_file in extract_automation_refs(hass_config)
            },
        }

    return router
