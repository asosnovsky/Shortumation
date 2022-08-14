from src.automations_v2.watcher import AutomationFileWatcher
from tests.utils import create_copy_of_example_config
from .utils import TestWithDB


class watcher_tests(TestWithDB):
    def test_bad_file(self):
        example_folder = create_copy_of_example_config()
        watcher = AutomationFileWatcher(example_folder / "automations.yaml", self.db_file)

        total = self.db.count_automations()
        self.assertEqual(total, 0)

        watcher.start()
        watcher.wait_until_next_reload(True)
        self.assertEqual(self.db.count_automations(), 32)

        (example_folder / "automations.yaml").write_text("haha!")
        watcher.wait_until_next_reload(True, timeout=60 * 10)
        self.assertEqual(self.db.count_automations(), 0)
        watcher.join()

    def test_load_empty_file(self):
        example_folder = create_copy_of_example_config()
        (example_folder / "automations.yaml").write_text("")
        watcher = AutomationFileWatcher(example_folder / "automations.yaml", self.db_file)
        total = self.db.count_automations()
        self.assertEqual(total, 0)

        watcher.start()
        watcher.wait_until_next_reload(True)
        self.assertEqual(self.db.count_automations(), 0)

    # def test_valid_changes(self):
    #     example_folder = create_copy_of_example_config()
    #     watcher = AutomationFileWatcher(example_folder / "automations.yaml", self.db_file)

    #     total = self.db.count_automations()
    #     self.assertEqual(total, 0)

    #     watcher.start()
    #     watcher.wait_until_next_reload(True)
    #     self.assertEqual(self.db.count_automations(), 32)

    #     autos = self.db.list_automations(0, 32)

    #     (example_folder / "automations.yaml").write_text("haha!")
    #     watcher.wait_until_next_reload(True, timeout=60 * 10)
    #     self.assertEqual(self.db.count_automations(), 0)
    #     watcher.join()
