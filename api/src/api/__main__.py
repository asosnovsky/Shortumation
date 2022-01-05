from src.automations.manager import AutomationManager
from src.hass_config import find_hass_config
from .app import make_app

hass_config = find_hass_config()
app = make_app(AutomationManager(hass_config))
