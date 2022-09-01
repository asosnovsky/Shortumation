from pathlib import Path
from tempfile import mktemp
from unittest import TestCase

from src.automations.loader import (
    extract_automation_refs,
    load_automation_path,
)
from src.automations.tags import TagManager
from src.automations.types import ExtenededAutomation
from src.hass_config.loader import HassConfig
from tests.utils import (
    HA_CONFIG2_EXAMPLE,
    HA_CONFIG3_EXAMPLE,
    HA_CONFIG4_EXAMPLE,
    HA_CONFIG5_EXAMPLE,
    HA_CONFIG6_EXAMPLE,
    HA_CONFIG7_EXAMPLE,
    HA_CONFIG8_EXAMPLE,
    HA_CONFIG9_EXAMPLE,
    HA_CONFIG10_EXAMPLE,
    HA_CONFIG11_EXAMPLE,
    HA_CONFIG12_EXAMPLE,
    HA_CONFIG13_EXAMPLE,
    HA_CONFIG_EXAMPLE,
)


class loader_tests(TestCase):
    def test_load_automation_list_file(self):
        automations = list(
            load_automation_path(
                HA_CONFIG2_EXAMPLE,
                HA_CONFIG2_EXAMPLE / "automations.yaml",
                configuration_key=["automation"],
                tag_manager=TagManager({"1652069225859": {"type": "routine"}}),
            )
        )
        self.assertEqual(len(automations), 1)
        self.assertEqual(
            automations[0],
            ExtenededAutomation(
                id="1652069225859",
                source_file="automations.yaml",
                source_file_type="list",
                configuration_key=["automation"],
                alias="Climate - Pref temperature ",
                description="",
                mode="single",
                tags={"type": "routine"},
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
                HA_CONFIG4_EXAMPLE,
                HA_CONFIG4_EXAMPLE / "automations" / "notify_washer.yaml",
                configuration_key=["automation base"],
                tag_manager=TagManager({"1659114647067": {"room": "laundry"}}),
            )
        )
        self.assertEqual(len(automations), 1)
        self.assertEqual(
            automations[0],
            ExtenededAutomation(
                id="1659114647067",
                source_file="automations/notify_washer.yaml",
                source_file_type="obj",
                configuration_key=["automation base"],
                alias="Notify Washer",
                description="Example",
                mode="single",
                tags={"room": "laundry"},
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

    def test_include_in_automation(self):
        automations = list(
            load_automation_path(
                HA_CONFIG9_EXAMPLE,
                HA_CONFIG9_EXAMPLE / "automations.yaml",
                configuration_key=["automation base"],
                tag_manager=TagManager({}),
            )
        )
        self.assertEqual(len(automations), 2)
        self.assertEqual(automations[1].action, automations[0].action)

    def test_load_automation_empty_file(self):
        file_path = Path(mktemp())
        file_path.touch()
        automations = list(
            load_automation_path(
                file_path.parent,
                file_path,
                configuration_key=["automation ui"],
                tag_manager=TagManager(),
            )
        )
        self.assertEqual(len(automations), 0)

    def test_load_automation_none_existing_file(self):
        file_path = Path(mktemp())
        file_path.unlink(missing_ok=True)
        automations = list(
            load_automation_path(
                file_path.parent,
                file_path,
                configuration_key=["automation manual"],
                tag_manager=TagManager(),
            )
        )
        self.assertEqual(len(automations), 0)

    def test_extract_all_automation_files(self):
        for ha_path, expected in [
            (HA_CONFIG_EXAMPLE, 1),
            (HA_CONFIG2_EXAMPLE, 1),
            (HA_CONFIG3_EXAMPLE, 1),
            (HA_CONFIG4_EXAMPLE, 1),
            (HA_CONFIG5_EXAMPLE, 3),
            (HA_CONFIG6_EXAMPLE, 4),
            (HA_CONFIG7_EXAMPLE, 1),
            (HA_CONFIG8_EXAMPLE, 2),
            (HA_CONFIG9_EXAMPLE, 1),
            (HA_CONFIG10_EXAMPLE, 3),
            (HA_CONFIG11_EXAMPLE, 3),
            (HA_CONFIG12_EXAMPLE, 4),
            (HA_CONFIG13_EXAMPLE, 4),
        ]:
            with self.subTest(config_name=ha_path.name, expected=expected):
                hass_config = HassConfig(ha_path)
                refs = list(extract_automation_refs(hass_config))
                self.assertEqual(len(refs), expected)
