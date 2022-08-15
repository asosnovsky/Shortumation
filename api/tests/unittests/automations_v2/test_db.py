from pathlib import Path

from src.automations_v2.types import ExtenededAutomation

from .utils import TestWithDB


class db_tests(TestWithDB):
    def test_db_creation(self):
        with self.db.get_cur() as cur:
            cur.execute("SELECT name FROM  sqlite_schema WHERE type ='table'")
            tables = cur.fetchall()
            self.assertListEqual(tables, [("autos",)])
        self.db.create_db()
        with self.db.get_cur() as cur:
            cur.execute("SELECT name FROM  sqlite_schema WHERE type ='table'")
            tables = cur.fetchall()
            self.assertListEqual(tables, [("autos",)])

    def test_insert_automations(self):
        originals = [
            ExtenededAutomation(
                id="test",
                alias="test",
                source_file=Path("automation.yaml").absolute(),
                source_file_type="obj",
                configuration_key="automation",
            ),
            ExtenededAutomation(
                id="test2",
                alias="test",
                source_file=Path("automation.yaml").absolute(),
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
                configuration_key="automation",
            ),
        ]
        self.db.upsert_automations(originals)
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
                source_file=Path("automation.yaml").absolute(),
                source_file_type="obj",
                configuration_key="automation",
            ),
            ExtenededAutomation(
                id="test",
                alias="test",
                source_file=Path("automation.yaml").absolute(),
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
                configuration_key="automation",
            ),
        ]
        self.db.upsert_automations(originals)
        autos = list(self.db.list_automations(0, 10))
        self.assertEqual(len(autos), 1)
        self.assertTrue(autos[0] == originals[1])

    def test_delete_automations(self):
        originals = [
            ExtenededAutomation(
                id="test",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                configuration_key="automation",
            ),
            ExtenededAutomation(
                id="test2",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
                configuration_key="automation",
            ),
        ]
        self.assertEqual(self.db.count_automations(), 0)
        self.db.upsert_automations(originals)
        self.assertEqual(self.db.count_automations(), 2)
        self.db.delete_automations(originals)
        self.assertEqual(self.db.count_automations(), 0)

    def test_delete_automations_by_source_type(self):
        originals = [
            ExtenededAutomation(
                id="test",
                alias="test",
                source_file="automation2.yaml",
                source_file_type="obj",
                configuration_key="automation",
            ),
            ExtenededAutomation(
                id="test2",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
                configuration_key="automation",
            ),
        ]
        self.assertEqual(self.db.count_automations(), 0)
        self.db.upsert_automations(originals)
        self.assertEqual(self.db.count_automations(), 2)
        self.db.delete_automations_in_source_file(Path("automation2.yaml"))
        self.assertEqual(self.db.count_automations(), 1)
        [auto] = self.db.list_automations(0, 10)
        self.assertEqual(auto.id, "test2")
