from unittest import TestCase

from src.config.HassSafeConstructor import SecretValue, load_hass_config, IncludedYaml
from tests.utils import SAMPLE_HA_PATH


class config_finder_tests(TestCase):
    def test_find_sample_config(self):
        secrets, config = load_hass_config(SAMPLE_HA_PATH)
        self.assertIsInstance(config["template"], IncludedYaml)
        self.assertIsInstance(config["binary_sensor"], IncludedYaml)
        self.assertIsInstance(config["group"], IncludedYaml)
        self.assertIsInstance(config["switch"], IncludedYaml)
        self.assertEqual(secrets["myamazingpassword"], "holymoly")
        self.assertEqual(
            config["automation"].data[32]["trigger"][0]["device_id"],
            SecretValue("baby_btn_device_id", "347492ffc6b909a55ebe08745fca1bf6"),
        )
