from src.automations_v2.automation_watcher import AutomationFileWatcher
from tests.utils import HA_CONFIG6_EXAMPLE, HA_CONFIG_EXAMPLE, create_copy_of_example_config
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
        watcher.join()

    def test_watch_folder(self):
        example_folder = create_copy_of_example_config(HA_CONFIG6_EXAMPLE)
        watcher = AutomationFileWatcher(example_folder / "automations", self.db_file)
        watcher.start()
        watcher.wait_until_next_reload(True)
        self.assertEqual(self.db.count_automations(), 12)
        watcher.join()

    def test_rapid_changes(self):
        example_folder = create_copy_of_example_config()
        watcher = AutomationFileWatcher(example_folder / "automations.yaml", self.db_file)
        watcher.start()
        watcher.wait_until_next_reload(True)
        self.assertEqual(self.db.count_automations(), 32)
        (example_folder / "automations.yaml").write_text("")
        (example_folder / "automations.yaml").write_text(
            (HA_CONFIG_EXAMPLE / "automations.yaml").read_text()
        )
        (example_folder / "automations.yaml").write_text("")
        (example_folder / "automations.yaml").write_text(
            (HA_CONFIG_EXAMPLE / "automations.yaml").read_text()
        )
        (example_folder / "automations.yaml").write_text("")
        (example_folder / "automations.yaml").write_text(
            (HA_CONFIG_EXAMPLE / "automations.yaml").read_text()
        )
        watcher.wait_until_next_reload(True)
        self.assertEqual(self.db.count_automations(), 32)
        watcher.join()

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
