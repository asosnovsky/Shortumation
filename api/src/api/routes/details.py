from fastapi import APIRouter

from src.automations.loader import extract_automation_refs
from src.env import BUILD_VERSION, HASSIO_TOKEN, HASSIO_WS
from src.hass_config import HassConfig
from src.user_profile import UserProfile


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
            "profile": hass_config.get_profile_path(),
            "autos": list(map(repr, extract_automation_refs(hass_config))),
        }

    @router.get("/profile")
    def read_profile():
        return UserProfile.from_hass_config(hass_config)

    @router.put("/profile")
    def save_profile(user_profile: UserProfile):
        user_profile.save(hass_config)
        return {"saved": hass_config.get_profile_path()}

    return router
