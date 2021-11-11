from src.env import ROOT_FOLDER
from src.db.connection import HassDatabase
from src.config.AutomationLoader import AutomationLoader
from src.yaml_serializer import load_hass_config

hass_config = load_hass_config(ROOT_FOLDER / "tests/samples")

db_connection = HassDatabase(
    f"sqlite:///{ROOT_FOLDER / 'tests/samples'}/home-assistant_v2.db"
)

automation_loader = AutomationLoader(hass_config)
