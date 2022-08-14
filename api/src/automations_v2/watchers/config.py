from pathlib import Path
from threading import Event, Thread
from time import sleep
from typing import List, Literal

from watchdog.observers import Observer

from src.automations_v2.loader import extract_automation_paths
from src.automations_v2.db import AutomationDBConnection
from src.hass_config.loader import HassConfig
from src.logger import get_logger

from .automation import AutomationFileWatcher
from .base_handler import BaseFileEventHandler
from .base_watcher import BaseWatcher

logger = get_logger(__file__)


class ConfigEventHandler(BaseFileEventHandler):
    def __init__(self, config_path: Path, db_path: Path, **kwargs) -> None:
        self.__db = AutomationDBConnection(db_path)
        self.__config_path = config_path
        self.__hass_config = HassConfig(self.__config_path)
        self.__automation_watchers: List[AutomationFileWatcher] = []
        super().__init__(**kwargs)

    def should_reload(self, p: Path) -> bool:
        return p.absolute() == self.__config_path

    def reload_file(self):
        self.clear_automation_watchers()
        self.__db.reset()
        for p in extract_automation_paths(self.__hass_config):
            watcher = AutomationFileWatcher(automation_file=p, automation_db_path=self.__db.db_file)
            watcher.start()
            self.__automation_watchers.append(watcher)

    def clear_automation_watchers(self):
        for auto_watchers in self.__automation_watchers:
            auto_watchers.join()
        self.__automation_watchers = []

    def __del__(self):
        self.clear_automation_watchers()


class ConfigFileWatcher(BaseWatcher):
    def __init__(self, config_path: Path, automation_db_path: Path):
        self.__automation_db_path = automation_db_path
        BaseWatcher.__init__(self, file_path=config_path)

    def get_handler(self, **kwrgs) -> ConfigEventHandler:
        return ConfigEventHandler(
            config_path=self.file_path,
            db_path=self.__automation_db_path,
            **kwrgs,
        )

    def _post_stop(self, handler: ConfigEventHandler):
        handler.clear_automation_watchers()
