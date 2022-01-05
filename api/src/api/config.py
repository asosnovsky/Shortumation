from src.automations.manager import AutomationManager
from src.hass_config import find_hass_config

hass_config = find_hass_config()
automations = AutomationManager(hass_config)
