from typing import Literal

from pydantic import BaseModel

from src.hass_config import HassConfig
from src.yaml_serializer import dump_yaml, load_yaml


class UserProfile(BaseModel):
    theme: Literal["dark", "light"] = "dark"
    lang: str = "eng"

    @classmethod
    def from_hass_config(cls, hass_config: HassConfig):
        path = hass_config.get_profile_path()
        if path.exists():
            with hass_config.get_profile_path().open("r") as fp:
                return cls(**load_yaml(fp, hass_config.root_path))  # type: ignore
        else:
            return cls()

    def save(self, hass_config: HassConfig):
        with hass_config.get_profile_path().open("w") as fp:
            fp.write(dump_yaml(self.dict(), hass_config.root_path))
