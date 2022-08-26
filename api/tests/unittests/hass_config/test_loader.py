from unittest import TestCase

from src.automations.types import BaseAutomation
from src.hass_config.loader import HassConfig
from tests.utils import HA_CONFIG8_EXAMPLE, SAMPLES_FOLDER, create_dummy_config_folder


class loader_tests(TestCase):
    def test_load_automation_from_config_yaml(self):
        folder = create_dummy_config_folder(
            [BaseAutomation(id="test")],
            automation_in_conifguration_mode="inline",
        )
        hass_config = HassConfig(folder)
        self.assertIsInstance(hass_config.configurations, dict)
        self.assertTrue("automation" in hass_config.configurations)

    def test_load_automation_from_config_yaml_include(self):
        folder = create_dummy_config_folder(
            [BaseAutomation(id="test")],
            automation_in_conifguration_mode="include",
        )
        hass_config = HassConfig(folder)
        self.assertIsInstance(hass_config.configurations, dict)
        self.assertTrue("automation" in hass_config.configurations)

    def test_load_automation_from_infer(self):
        folder = create_dummy_config_folder(
            [BaseAutomation(id="test")],
            automation_in_conifguration_mode="none",
        )
        hass_config = HassConfig(folder)
        self.assertIsInstance(hass_config.configurations, dict)
        self.assertFalse("automation" in hass_config.configurations)

    def test_missing_automations(self):
        folder = create_dummy_config_folder(
            [BaseAutomation(id="test")],
            automation_in_conifguration_mode="none",
        )
        (folder / "automations.yaml").unlink()
        hass_config = HassConfig(folder)
        self.assertIsInstance(hass_config.configurations, dict)

    def test_load_homeassitant(self):
        for folder in SAMPLES_FOLDER.iterdir():
            with self.subTest(name=folder.name):
                hass_config = HassConfig(folder)
                assert isinstance(hass_config.homeassistant, dict)

    def test_load_packages(self):
        for folder in SAMPLES_FOLDER.iterdir():
            with self.subTest(name=folder.name):
                hass_config = HassConfig(folder)
                assert isinstance(hass_config.pacakges, dict)
