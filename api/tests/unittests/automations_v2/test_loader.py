from pathlib import Path
from tempfile import mktemp
from unittest import TestCase

from src.automations_v2.loader import extract_automation_paths, load_automation_path
from src.automations_v2.types import ExtenededAutomation
from src.hass_config.loader import HassConfig
from tests.utils import (
    HA_CONFIG2_EXAMPLE,
    HA_CONFIG3_EXAMPLE,
    HA_CONFIG4_EXAMPLE,
    HA_CONFIG5_EXAMPLE,
    HA_CONFIG6_EXAMPLE,
    HA_CONFIG_EXAMPLE,
)


class loader_tests(TestCase):
    def test_load_automation_list_file(self):
        automations = list(
            load_automation_path(
                HA_CONFIG2_EXAMPLE / "automations.yaml", configuration_key="automation"
            )
        )
        self.assertEqual(len(automations), 1)
        self.assertEqual(
            automations[0],
            ExtenededAutomation(
                id="1652069225859",
                source_file=str(HA_CONFIG2_EXAMPLE / "automations.yaml"),
                source_file_type="list",
                configuration_key="automation",
                alias="Climate - Pref temperature ",
                description="",
                mode="single",
                trigger=[
                    {
                        "platform": "state",
                        "entity_id": "input_number.preferred_temperature",
                    }
                ],
                condition=[],
                action=[
                    {
                        "service": "climate.set_temperature",
                        "data": {
                            "temperature": {
                                "[object Object]": None,
                            }
                        },
                        "target": {
                            "entity_id": "climate.main_floor",
                        },
                    }
                ],
            ),
        )

    def test_load_automation_obj_file(self):
        automations = list(
            load_automation_path(
                HA_CONFIG4_EXAMPLE / "automations" / "notify_washer.yaml",
                configuration_key="automation base",
            )
        )
        self.assertEqual(len(automations), 1)
        self.assertEqual(
            automations[0],
            ExtenededAutomation(
                id="1659114647067",
                source_file=str(HA_CONFIG4_EXAMPLE / "automations" / "notify_washer.yaml"),
                source_file_type="obj",
                configuration_key="automation base",
                alias="Notify Washer",
                description="Example",
                mode="single",
                trigger=[
                    {
                        "platform": "homeassistant",
                        "event": "start",
                    }
                ],
                condition=[],
                action=[
                    {
                        "service": "counter.increment",
                        "data": {},
                        "target": {"entity_id": "counter.up_times"},
                    }
                ],
            ),
        )

    def test_load_automation_empty_file(self):
        file_path = Path(mktemp())
        file_path.touch()
        automations = list(load_automation_path(file_path, configuration_key="automation ui"))
        self.assertEqual(len(automations), 0)

    def test_load_automation_none_existing_file(self):
        file_path = Path(mktemp())
        file_path.unlink(missing_ok=True)
        automations = list(load_automation_path(file_path, configuration_key="automation manual"))
        self.assertEqual(len(automations), 0)

    def test_extract_all_automation_files(self):
        for ha_path, expected in [
            (HA_CONFIG_EXAMPLE, 1),
            (HA_CONFIG2_EXAMPLE, 1),
            (HA_CONFIG3_EXAMPLE, 1),
            (HA_CONFIG4_EXAMPLE, 1),
            (HA_CONFIG5_EXAMPLE, 3),
            (HA_CONFIG6_EXAMPLE, 4),
        ]:
            with self.subTest(ha_path=ha_path, expected=expected):
                hass_config = HassConfig(ha_path)
                paths = list(extract_automation_paths(hass_config))
                self.assertEqual(len(paths), expected)
