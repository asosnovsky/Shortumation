from unittest import TestCase
from src.automations.types import AutomationData, AutomationMetdata
from src.hass_config.loader import HassConfig
from tests.utils import HA_CONFIG_EXAMPLE, create_dummy_config_folder

example_hass_config = HassConfig(HA_CONFIG_EXAMPLE)


class loader_tests(TestCase):
    def test_load_automation_from_config_yaml(self):
        folder = create_dummy_config_folder(
            [AutomationData(metadata=AutomationMetdata(id="test"))],
            automation_in_conifguration_mode="inline",
        )
        hass_config = HassConfig(folder)
        self.assertIsInstance(hass_config.configurations, dict)
        self.assertTrue("automation" in hass_config.configurations)
        self.assertEqual(hass_config.automations[0]["id"], "test")

    def test_load_automation_from_config_yaml_inclue(self):
        folder = create_dummy_config_folder(
            [AutomationData(metadata=AutomationMetdata(id="test"))],
            automation_in_conifguration_mode="include",
        )
        hass_config = HassConfig(folder)
        self.assertIsInstance(hass_config.configurations, dict)
        self.assertTrue("automation" in hass_config.configurations)
        self.assertEqual(hass_config.automations[0]["id"], "test")

    def test_load_automation_from_infer(self):
        folder = create_dummy_config_folder(
            [AutomationData(metadata=AutomationMetdata(id="test"))],
            automation_in_conifguration_mode="none",
        )
        hass_config = HassConfig(folder)
        self.assertIsInstance(hass_config.configurations, dict)
        self.assertFalse("automation" in hass_config.configurations)
        self.assertEqual(hass_config.automations[0]["id"], "test")
