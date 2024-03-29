from pathlib import Path

from src.automations.errors import DBDataError, RepeatedAutomationId
from src.automations.types import ExtenededAutomation

from .utils import TestWithDB


class db_tests(TestWithDB):
    def test_insert_automations(self):
        originals = [
            ExtenededAutomation(
                id="test",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                configuration_key=["automation"],
            ),
            ExtenededAutomation(
                id="test2",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
                configuration_key=["automation"],
            ),
        ]
        self.db.insert_automations(originals)
        for original in originals:
            with self.subTest(original=original):
                self.assertEqual(self.db.get_automation(original.id), original)
        autos = list(self.db.list_automations(0, 10))
        self.assertEqual(len(autos), 2)

    def test_insert_repeat_automations(self):
        originals = [
            ExtenededAutomation(
                id="test",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                configuration_key=["automation"],
            ),
            ExtenededAutomation(
                id="test",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
                configuration_key=["automation"],
            ),
        ]
        with self.assertRaises(RepeatedAutomationId):
            self.db.insert_automations(originals)
        autos = list(self.db.list_automations(0, 10))
        self.assertEqual(len(autos), 1)
