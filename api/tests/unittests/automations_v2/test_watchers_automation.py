from pathlib import Path
from time import sleep
from src.automations_v2.watchers.automation import AutomationFileWatcher
from tests.utils import HA_CONFIG6_EXAMPLE, HA_CONFIG_EXAMPLE, create_copy_of_example_config
from .utils import TestWithDB


class automation_watcher_tests(TestWithDB):
    def make_safe_watcher(self, automation_file: Path):
        self.watcher = AutomationFileWatcher(automation_file, self.db_file)
        return self.watcher

    def tearDown(self) -> None:
        if hasattr(self, "watcher"):
            getattr(self, "watcher").join()
        super().tearDown()

    def test_bad_file(self):
        example_folder = create_copy_of_example_config()
        watcher = self.make_safe_watcher(example_folder / "automations.yaml")

        total = self.db.count_automations()
        self.assertEqual(total, 0)

        watcher.start()
        self.assertEqual(watcher.wait_until_next_event(True), "loaded")
        self.assertEqual(self.db.count_automations(), 32)

        (example_folder / "automations.yaml").write_text("haha!")
        watcher.wait_until_next_reload(True, timeout=60 * 10)
        self.assertEqual(self.db.count_automations(), 0)
        watcher.join()

    def test_load_empty_file(self):
        example_folder = create_copy_of_example_config()
        (example_folder / "automations.yaml").write_text("")
        watcher = self.make_safe_watcher(example_folder / "automations.yaml")
        total = self.db.count_automations()
        self.assertEqual(total, 0)

        watcher.start()
        self.assertEqual(watcher.wait_until_next_event(True), "loaded")
        self.assertEqual(self.db.count_automations(), 0)
        watcher.join()

    def test_watch_folder(self):
        example_folder = create_copy_of_example_config(HA_CONFIG6_EXAMPLE)
        watcher = self.make_safe_watcher(example_folder / "automations")
        watcher.start()
        self.assertEqual(watcher.wait_until_next_event(True), "loaded")
        self.assertEqual(self.db.count_automations(), 12)
        watcher.join()

    def test_rapid_changes(self):
        example_folder = create_copy_of_example_config()
        watcher = self.make_safe_watcher(example_folder / "automations.yaml")
        watcher.start()
        self.assertEqual(watcher.wait_until_next_event(True), "loaded")
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
        sleep(60)
        self.assertEqual(self.db.count_automations(), 32)
        watcher.join()
