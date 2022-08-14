from time import sleep
from src.hass_config.loader import HassConfig
from src.automations_v2.manager import AutomationManager

from tests.utils import HA_CONFIG6_EXAMPLE, create_copy_of_example_config
from .utils import TestWithDB


class manager_tests(TestWithDB):
    def test_load_complex_read_modify_delete(self):
        config_path = create_copy_of_example_config(HA_CONFIG6_EXAMPLE)
        automation_manager = AutomationManager(
            HassConfig(config_path),
            self.db_file,
        )
        self.assertEqual(automation_manager.config_watcher.wait_until_next_event(True), "loaded")
        self.assertEqual(automation_manager.count(), 12)
        automation = automation_manager.get("sublist3-mlist2")
        self.assertEqual(automation.description, "That was correct!")
        self.assertEqual(
            automation.action,
            [
                {
                    "service": "switch.turn_off",
                    "target": {"entity_id": "switch.bathroom"},
                    "data": None,
                }
            ],
        )
        automation.trigger.append(
            {"platform": "zone", "entity_id": "person.thor", "zone": "zone.azguard"}
        )
        automation_manager.update(automation)
        sleep(2)
        automation = automation_manager.get("sublist3-mlist2")
        self.assertEqual(
            automation.trigger,
            [
                {
                    "platform": "zone",
                    "entity_id": "person.thor",
                    "zone": "zone.azguard",
                }
            ],
        )
