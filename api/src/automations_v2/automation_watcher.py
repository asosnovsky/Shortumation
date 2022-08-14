import asyncio
from threading import Thread, Event
from pathlib import Path
from time import sleep
from typing import List, Optional

from watchdog.events import FileSystemEvent
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from src.logger import get_logger
from ..utils import throttle
from .db import AutomationDBConnection, DBError
from .loader import load_automation_path
from .types import ExtenededAutomationData
from .errors import FailedDeletion

logger = get_logger(__file__)


class AutomationFileEventHandler(FileSystemEventHandler):
    def __init__(self, automation_file: Path, automation_db_path: Path, file_loaded: Event) -> None:
        super().__init__()
        self.__automation_file = automation_file.absolute()
        self.__automation_db = AutomationDBConnection(automation_db_path)
        self.file_loaded = file_loaded
        self.__loaded_automations: Optional[List[ExtenededAutomationData]] = None
        asyncio.run(self.reload_file())

    @throttle(seconds=60)
    def reload_file(self):
        try:
            automations = list(load_automation_path(self.__automation_file))
            self.__automation_db.upsert_automations(automations)
            self.__loaded_automations = automations
        except Exception as err:
            logger.error(err)
            if isinstance(err, DBError):
                logger.warning(f"Failed to reload {self.__automation_file} due to {err}")
            else:
                logger.warning(f"Failed to load {self.__automation_file} due to {err}")
            if self.__loaded_automations is not None:
                try:
                    self.__automation_db.delete_automations(self.__loaded_automations)
                except DBError as err:
                    raise FailedDeletion(
                        f"failed to flush automations from database for the invalid file {self.__automation_file} due to {err}"
                    ) from err
        self.file_loaded.set()

    def on_modified(self, event: FileSystemEvent):
        logger.info(f"on_modified: {type(event)} {event.event_type} path : {event.src_path}")
        if Path(event.src_path).absolute() == self.__automation_file:
            asyncio.run(self.reload_file())

    def on_created(self, event: FileSystemEvent):
        logger.info(f"on_created: {type(event)} {event.event_type} path : {event.src_path}")
        if Path(event.src_path).absolute() == self.__automation_file:
            asyncio.run(self.reload_file())

    def on_deleted(self, event: FileSystemEvent):
        logger.info(f"on_deleted: {type(event)} {event.event_type} path : {event.src_path}")
        if Path(event.src_path).absolute() == self.__automation_file:
            asyncio.run(self.reload_file())


class AutomationFileWatcher(Thread):
    def __init__(self, automation_file: Path, automation_db_path: Path):
        self.__automation_file = automation_file
        self.__automation_db_path = automation_db_path
        self.__stop = False
        self.__file_loaded = Event()
        Thread.__init__(self)

    def run(self) -> None:
        self.__stop = False
        logger.info(f"Watching {self.__automation_file} for changes...")
        obs = Observer()
        handler = AutomationFileEventHandler(
            self.__automation_file,
            self.__automation_db_path,
            self.__file_loaded,
        )
        obs.schedule(handler, self.__automation_file)
        obs.start()

        while not self.__stop:
            sleep(1)

        obs.stop()
        logger.warning(f"Watcher for {self.__automation_file} is stopped!")

    def stop(self):
        if not self.__stop:
            logger.warning(f"Watcher for {self.__automation_file} is set to stop...")
            self.__stop = True

    def __del__(self):
        logger.warning(f"Deleting watcher for {self.__automation_file}...")
        self.join()

    def join(self, timeout: float = 10) -> None:
        logger.warning(f"Closing thread for watcher for {self.__automation_file}...")
        self.stop()
        return super().join(timeout)

    def wait_until_next_reload(self, reset_after: bool = False, *, timeout: int = 5):
        self.__file_loaded.wait(timeout)
        if reset_after:
            self.__file_loaded.clear()
