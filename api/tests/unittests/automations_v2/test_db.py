from src.automations_v2.types import ExtenededAutomationData
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
            ExtenededAutomationData(
                id="test",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
            ),
            ExtenededAutomationData(
                id="test2",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
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
            ExtenededAutomationData(
                id="test",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
            ),
            ExtenededAutomationData(
                id="test",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
            ),
        ]
        self.db.upsert_automations(originals)
        autos = list(self.db.list_automations(0, 10))
        self.assertEqual(len(autos), 1)
        self.assertTrue(autos[0] == originals[1])

    def test_delete_automations(self):
        originals = [
            ExtenededAutomationData(
                id="test",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
            ),
            ExtenededAutomationData(
                id="test2",
                alias="test",
                source_file="automation.yaml",
                source_file_type="obj",
                action=[{"event": {"nice": "one"}, "event_type": "custom"}],
            ),
        ]
        self.assertEqual(self.db.count_automations(), 0)
        self.db.upsert_automations(originals)
        self.assertEqual(self.db.count_automations(), 2)
        self.db.delete_automations(originals)
        self.assertEqual(self.db.count_automations(), 0)
