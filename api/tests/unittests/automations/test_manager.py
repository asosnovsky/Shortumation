from pathlib import Path

from src import yaml_serializer
from src.automations.errors import (
    AttemptingToOverwriteAnIncompatibleFileError,
    DBNoAutomationFound,
    InvalidAutomationFile,
)
from src.automations.manager import AutomationManager
from src.automations.types import ExtenededAutomation
from src.errors import ErrorSet
from src.hass_config.loader import HassConfig
from tests.utils import (
    HA_CONFIG6_EXAMPLE,
    HA_CONFIG8_EXAMPLE,
    HA_CONFIG_EXAMPLE,
    create_copy_of_example_config,
)

from .utils import TestWithDB


class manager_tests(TestWithDB):
    def get_manager(self, ha_config_example: Path):
        self.config_path = create_copy_of_example_config(ha_config_example)
        self.automation_manager = AutomationManager(
            HassConfig(self.config_path),
            self.db_file,
        )
        return self.config_path, self.automation_manager

    def test_load_complex_read_modify_delete(self):
        _, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        self.assertEqual(automation_manager.count(), 0)
        automation_manager.reload()
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
        self.assertEqual(automation.configuration_key, "automation cools")
        automation.trigger.append(
            {"platform": "zone", "entity_id": "person.thor", "zone": "zone.azguard"}
        )
        automation_manager.update(automation)
        self.assertEqual(
            automation_manager.get("sublist3-mlist2").trigger,
            [],
        )
        automation_manager.reload()
        self.assertEqual(
            automation_manager.get("sublist3-mlist2").trigger,
            [
                {
                    "platform": "zone",
                    "entity_id": "person.thor",
                    "zone": "zone.azguard",
                }
            ],
        )

    def test_find_invalid(self):
        _, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        automation_manager.reload()
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("invalid")

    def test_bad_automations_file(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG_EXAMPLE)
        (config_path / "automations.yaml").write_text("bob is an uncle")
        with self.assertRaises(ErrorSet) as err:
            automation_manager.reload()
        self.assertEqual(len(err.exception.errors), 1)
        self.assertIsInstance(err.exception.errors[0], InvalidAutomationFile)
        self.assertEqual(automation_manager.count(), 0)

    def test_one_bad_automations_file(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        (config_path / "automations" / "ui.yaml").write_text("bob is an uncle")
        with self.assertRaises(ErrorSet) as err:
            automation_manager.reload()
        self.assertEqual(len(err.exception.errors), 1)
        self.assertIsInstance(err.exception.errors[0], InvalidAutomationFile)
        self.assertEqual(automation_manager.count(), 10)

    def test_delete_automation_in_single_file(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        self.assertTrue((config_path / "automations/include_dir_list/home/down.yaml").exists())
        automation_manager.reload()
        automation = automation_manager.get("1659114822642")
        self.assertEqual(automation.configuration_key, "automation manual")
        automation_manager.delete(automation)
        automation_manager.reload()
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("1659114822642")
        self.assertFalse((config_path / "automations/include_dir_list/home/down.yaml").exists())

    def test_delete_automation_in_list(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        self.assertTrue(
            (config_path / "automations/include_dir_merge_list/sub/list2.yaml").exists()
        )
        automation_manager.reload()
        automation = automation_manager.get("mlist2")
        self.assertEqual(automation.configuration_key, "automation cools")
        automation_manager.delete(automation)
        automation_manager.reload()
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("mlist2")
        self.assertTrue(
            (config_path / "automations/include_dir_merge_list/sub/list2.yaml").exists()
        )

    def test_create_new_in_single_file(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        automation_manager.reload()
        self.assertFalse((config_path / "automations/include_dir_list/home/left.yaml").exists())
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("newlymade")
        automation_manager.update(
            ExtenededAutomation(
                id="newlymade",
                configuration_key="automation manual",
                source_file="automations/include_dir_list/home/left.yaml",
                source_file_type="obj",
            )
        )
        self.assertTrue((config_path / "automations/include_dir_list/home/left.yaml").exists())
        automation_manager.reload()
        self.assertEqual(
            automation_manager.get("newlymade"),
            ExtenededAutomation(
                id="newlymade",
                configuration_key="automation manual",
                source_file="automations/include_dir_list/home/left.yaml",
                source_file_type="obj",
            ),
        )

    def test_create_new_in_existing_list_file(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        automation_manager.reload()
        self.assertTrue(
            (config_path / "automations/include_dir_merge_list/sub/list2.yaml").exists()
        )
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("newlymade")
        automation_manager.update(
            ExtenededAutomation(
                id="newlymade",
                configuration_key="automation cools",
                source_file="automations/include_dir_merge_list/sub/list2.yaml",
                source_file_type="list",
            ),
            create_if_not_found=True,
        )
        self.assertTrue(
            (config_path / "automations/include_dir_merge_list/sub/list2.yaml").exists()
        )
        automation_manager.reload()
        self.assertEqual(
            automation_manager.get("newlymade"),
            ExtenededAutomation(
                id="newlymade",
                configuration_key="automation cools",
                source_file="automations/include_dir_merge_list/sub/list2.yaml",
                source_file_type="list",
            ),
        )

    def test_create_new_in_new_list_file(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        automation_manager.reload()
        self.assertFalse(
            (config_path / "automations/include_dir_merge_list/sub/list4.yaml").exists()
        )
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("newlymade")
        automation_manager.update(
            ExtenededAutomation(
                id="newlymade",
                configuration_key="automation cools",
                source_file="automations/include_dir_merge_list/sub/list4.yaml",
                source_file_type="list",
            ),
            create_if_not_found=True,
        )
        self.assertTrue(
            (config_path / "automations/include_dir_merge_list/sub/list4.yaml").exists()
        )
        automation_manager.reload()
        self.assertEqual(
            automation_manager.get("newlymade"),
            ExtenededAutomation(
                id="newlymade",
                configuration_key="automation cools",
                source_file="automations/include_dir_merge_list/sub/list4.yaml",
                source_file_type="list",
            ),
        )

    def test_save_improper_types_list_to_obj(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        automation_manager.reload()
        self.assertTrue(
            (config_path / "automations/include_dir_merge_list/sub/list2.yaml").exists()
        )
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("newlymade")
        with self.assertRaises(AttemptingToOverwriteAnIncompatibleFileError):
            automation_manager.update(
                ExtenededAutomation(
                    id="newlymade",
                    configuration_key="automation cools",
                    source_file="automations/include_dir_merge_list/sub/list2.yaml",
                    source_file_type="obj",
                ),
                create_if_not_found=True,
            )
        automation_manager.reload()
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("newlymade")

        data = yaml_serializer.load_yaml(
            (config_path / "automations/include_dir_merge_list/sub/list2.yaml").open("r"),
            root_path=config_path,
        )
        self.assertIsInstance(data, list)

    def test_save_improper_types_obj_to_list(self):
        config_path, automation_manager = self.get_manager(HA_CONFIG6_EXAMPLE)
        automation_manager.reload()
        self.assertTrue((config_path / "automations/include_dir_list/home/down.yaml").exists())
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("newlymade")
        with self.assertRaises(AttemptingToOverwriteAnIncompatibleFileError):
            automation_manager.update(
                ExtenededAutomation(
                    id="newlymade",
                    configuration_key="automation cools",
                    source_file="automations/include_dir_list/home/down.yaml",
                    source_file_type="list",
                ),
                create_if_not_found=True,
            )
        automation_manager.reload()
        with self.assertRaises(DBNoAutomationFound):
            automation_manager.get("newlymade")

        data = yaml_serializer.load_yaml(
            (config_path / "automations/include_dir_list/home/down.yaml").open("r"),
            config_path,
        )
        self.assertIsInstance(data, dict)

    def test_update_tags_through_automation_update(self):
        _, automation_manager = self.get_manager(HA_CONFIG_EXAMPLE)
        automation_manager.reload()
        auto = automation_manager.get("1619371298367")
        self.assertDictEqual(
            auto.tags,
            {
                "Room": "Living",
                "Type": "Button",
            },
        )
        auto.tags["Room"] = "Bathroom"
        automation_manager.update(auto)
        del auto
        automation_manager.reload()
        auto = automation_manager.get("1619371298367")
        self.assertDictEqual(
            auto.tags,
            {
                "Room": "Bathroom",
                "Type": "Button",
            },
        )

    def test_update_tags_through_tags(self):
        _, automation_manager = self.get_manager(HA_CONFIG_EXAMPLE)
        automation_manager.reload()
        auto = automation_manager.get("1619371298367")
        self.assertDictEqual(
            auto.tags,
            {
                "Room": "Living",
                "Type": "Button",
            },
        )
        auto.tags["Room"] = "Bathroom"
        automation_manager.update_tags(auto.id, auto.tags)
        del auto
        automation_manager.reload()
        auto = automation_manager.get("1619371298367")
        self.assertDictEqual(
            auto.tags,
            {
                "Room": "Bathroom",
                "Type": "Button",
            },
        )

    def test_delete_tags(self):
        _, automation_manager = self.get_manager(HA_CONFIG_EXAMPLE)
        automation_manager.reload()
        auto = automation_manager.get("1619371298367")
        self.assertDictEqual(
            auto.tags,
            {
                "Room": "Living",
                "Type": "Button",
            },
        )
        automation_manager.delete_tags(auto.id)
        del auto
        automation_manager.reload()
        auto = automation_manager.get("1619371298367")
        self.assertDictEqual(
            auto.tags,
            {},
        )

    def test_load_pacakges(self):
        _, automation_manager = self.get_manager(HA_CONFIG8_EXAMPLE)
        automation_manager.reload()
        auto = automation_manager.get("package-sub")
        self.assertEqual(auto.configuration_key, "pacakage2")
