from unittest import TestCase
from tests.utils import HA_CONFIG_EXAMPLE, create_dummy_config_folder
from src.hass_config.loader import HassConfig
from src.automations.manager import AutomationManager

example_hass_config = HassConfig(HA_CONFIG_EXAMPLE)
example_automation_loader = AutomationManager(example_hass_config)


class manager_tests(TestCase):
    def test_find_limit_and_get(self):
        first_auto_with_find = list(example_automation_loader.find(limit=1))
        first_auto_with_get = example_automation_loader.get(0)
        self.assertEqual(first_auto_with_find[0], first_auto_with_get)

    def test_find_at_most_with_offset(self):
        autos = list(example_automation_loader.find(limit=10, offset=10))
        self.assertTrue(len(autos), 10)

    def test_find_invalid(self):
        self.assertIsNone(example_automation_loader.get(-1))
        self.assertIsNone(example_automation_loader.get(1_000))
        self.assertIsNone(example_automation_loader.get(31))
