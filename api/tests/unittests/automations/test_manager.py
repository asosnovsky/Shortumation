from unittest import TestCase

from src.automations.errors import FailedDeletion, InvalidAutomationFile
from src.automations.types import AutomationMetdata, ExtenededAutomationData
from tests.utils import (
    get_dummy_automation_loader,
    get_example_automation_loader,
)


class manager_tests(TestCase):
    def test_find_limit_and_get(self):
        _, _, loader = get_example_automation_loader()
        first_auto_with_find = list(loader.find(limit=1))
        first_auto_with_get = loader.get(0)
        self.assertEqual(first_auto_with_find[0], first_auto_with_get)

    def test_find_at_most_with_offset(self):
        _, _, loader = get_example_automation_loader()
        autos = list(loader.find(limit=10, offset=10))
        self.assertTrue(len(autos), 10)

    def test_find_invalid(self):
        _, _, loader = get_example_automation_loader()
        self.assertIsNone(loader.get(-1))
        self.assertIsNone(loader.get(1_000))
        self.assertIsNone(loader.get(33))

    def test_length(self):
        _, _, loader = get_example_automation_loader()
        self.assertEqual(loader.get_total_items(), 32)

    def test_bad_automations_file(self):
        folder, _, manager = get_dummy_automation_loader(
            [],
            automation_in_conifguration_mode="none",
        )
        (folder / "automations.yaml").write_text("bob is an uncle")
        with self.assertRaises(InvalidAutomationFile):
            manager.get(0)

    def test_create_automation(self):
        _, _, manager = get_dummy_automation_loader(
            [],
            automation_in_conifguration_mode="none",
        )
        manager.update(1, ExtenededAutomationData(metadata=AutomationMetdata(id="test1")))
        auto = manager.get(0)
        self.assertIsNotNone(auto)
        self.assertEqual(auto.metadata.id, "test1")  # type: ignore

    def test_create_automation_with_example_folder(self):
        _, _, manager = get_example_automation_loader()
        self.assertEqual(manager.get_total_items(), 32)
        manager.update(40, ExtenededAutomationData(metadata=AutomationMetdata(id="test1")))
        auto = manager.get(32)
        self.assertIsNotNone(auto)
        self.assertEqual(manager.get_total_items(), 33)
        self.assertEqual(auto.metadata.id, "test1")  # type: ignore

    def test_update_automation(self):
        _, _, manager = get_dummy_automation_loader(
            [
                ExtenededAutomationData(metadata=AutomationMetdata(id="test1")),
                ExtenededAutomationData(metadata=AutomationMetdata(id="test2")),
                ExtenededAutomationData(metadata=AutomationMetdata(id="test3")),
            ],
            automation_in_conifguration_mode="none",
        )
        auto = manager.get(0)
        self.assertEqual(auto.metadata.id, "test1")  # type: ignore
        manager.update(0, ExtenededAutomationData(metadata=AutomationMetdata(id="toaster-7")))
        auto = manager.get(0)
        self.assertEqual(auto.metadata.id, "toaster-7")  # type: ignore

    def test_delete_automation(self):
        _, _, manager = get_dummy_automation_loader(
            [
                ExtenededAutomationData(metadata=AutomationMetdata(id="test1")),
                ExtenededAutomationData(metadata=AutomationMetdata(id="test2")),
                ExtenededAutomationData(metadata=AutomationMetdata(id="test3")),
            ],
            automation_in_conifguration_mode="none",
        )
        self.assertEqual(manager.get_total_items(), 3)
        manager.delete(1)
        self.assertEqual(manager.get_total_items(), 2)
        for auto in manager.find(0, 1000):
            self.assertNotEqual(auto.metadata.id, "test2")

    def test_failed_deletion_automation(self):
        _, _, manager = get_dummy_automation_loader(
            [
                ExtenededAutomationData(metadata=AutomationMetdata(id="test1")),
                ExtenededAutomationData(metadata=AutomationMetdata(id="test2")),
                ExtenededAutomationData(metadata=AutomationMetdata(id="test3")),
            ],
            automation_in_conifguration_mode="none",
        )
        self.assertEqual(manager.get_total_items(), 3)
        with self.assertRaises(FailedDeletion):
            manager.delete(10)

    def test_save_tags(self):
        _, _, manager = get_dummy_automation_loader(
            [
                ExtenededAutomationData(metadata=AutomationMetdata(id="test1")),
                ExtenededAutomationData(metadata=AutomationMetdata(id="test2")),
                ExtenededAutomationData(metadata=AutomationMetdata(id="test3")),
            ],
            automation_in_conifguration_mode="none",
        )
        manager.update_tags("test1", {"room": "bathroom"})
        auto = manager.get(0)
        assert auto.tags == {"room": "bathroom"}
