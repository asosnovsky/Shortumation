from src.api.app import make_app
from src.hass_config import find_hass_config

hass_config = find_hass_config()
app = make_app(hass_config)
