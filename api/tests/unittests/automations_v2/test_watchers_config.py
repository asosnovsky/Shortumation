from src.automations_v2.watchers.config import ConfigFileWatcher
from src.hass_config.loader import HassConfig

from .utils import TestWithDB, make_temp_db
from tests.utils import (
    HA_CONFIG_EXAMPLE,
    HA_CONFIG2_EXAMPLE,
    HA_CONFIG3_EXAMPLE,
    HA_CONFIG4_EXAMPLE,
    HA_CONFIG5_EXAMPLE,
    HA_CONFIG6_EXAMPLE,
    create_copy_of_example_config,
)


class config_watcher_tests(TestWithDB):
    def test_simple_config_loading(self):
        for p, count in [
            (HA_CONFIG_EXAMPLE, 32),
            (HA_CONFIG2_EXAMPLE, 1),
            (HA_CONFIG3_EXAMPLE, 1032),
            (HA_CONFIG4_EXAMPLE, 3),
            (HA_CONFIG5_EXAMPLE, 10),
            (HA_CONFIG6_EXAMPLE, 12),
        ]:
            with self.subTest(config=p.name):
                db = make_temp_db()
                db.reset()
                config_path = create_copy_of_example_config(p)
                config_watcher = ConfigFileWatcher(
                    config_path=HassConfig(config_path).get_configuration_path(),
                    automation_db_path=db.db_file,
                )
                self.assertEqual(db.count_automations(), 0)
                config_watcher.start()
                self.assertEqual(config_watcher.wait_until_next_event(True), "loaded")
                self.assertEqual(db.count_automations(), count)
                config_watcher.join()
