import abc
import asyncio
import nest_asyncio

from threading import Event
from pathlib import Path

from watchdog.events import FileSystemEvent
from watchdog.events import FileSystemEventHandler

from src.logger import get_logger
from src.utils import throttle

nest_asyncio.apply()
logger = get_logger(__file__)


class BaseFileEventHandler(FileSystemEventHandler, abc.ABC):
    def __init__(self, event_loaded: Event, event_errored: Event) -> None:
        self.event_loaded = event_loaded
        self.event_errored = event_errored
        super().__init__()
        asyncio.run(self._reload_file())

    def should_reload(self, p: Path) -> bool:
        raise NotImplementedError

    def reload_file(self):
        raise NotImplementedError

    def handle_failure(self, error: Exception):
        logger.error(error)
        raise error from error

    @throttle(seconds=60)
    def _reload_file(self):
        try:
            self.reload_file()
        except Exception as err:
            self.event_errored.set()
            self.handle_failure(err)
        self.event_loaded.set()

    def on_modified(self, event: FileSystemEvent):
        logger.info(f"on_modified: {event.event_type} path : {event.src_path}")
        if self.should_reload(Path(event.src_path)):
            asyncio.run(self._reload_file())

    def on_created(self, event: FileSystemEvent):
        logger.info(f"on_created: {event.event_type} path : {event.src_path}")
        if self.should_reload(Path(event.src_path)):
            asyncio.run(self._reload_file())

    def on_deleted(self, event: FileSystemEvent):
        logger.info(f"on_deleted: {event.event_type} path : {event.src_path}")
        if self.should_reload(Path(event.src_path)):
            asyncio.run(self._reload_file())
