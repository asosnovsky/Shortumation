import abc
from pathlib import Path
from threading import Event
from time import sleep
from typing import Generic, Literal, Optional, TypeVar

from watchdog.observers import Observer

from src.logger import get_logger

from .base_handler import BaseFileEventHandler

logger = get_logger(__file__)

BaseFileEventHandlerT = TypeVar("BaseFileEventHandlerT", bound=BaseFileEventHandler)


class BaseWatcher(Observer, abc.ABC, Generic[BaseFileEventHandlerT]):
    def __init__(self, file_path: Path):
        self.file_path = file_path
        self.__event_file_loaded = Event()
        self.__event_errored = Event()
        Observer.__init__(self)
        self.handler: Optional[BaseFileEventHandlerT] = None

    def start(self):
        self.handler = self.get_handler(
            event_errored=self.__event_errored,
            event_loaded=self.__event_file_loaded,
        )
        self.schedule(self.handler, self.file_path)
        return super().start()

    def get_handler(self, event_loaded: Event, event_errored: Event) -> BaseFileEventHandlerT:
        raise NotImplementedError

    def _post_stop(self, handler: BaseFileEventHandlerT):
        return

    def __del__(self):
        logger.warning(f"Deleting watcher for {self.file_path}...")
        self.join()

    def join(self, timeout: float = 30) -> None:
        logger.warning(f"Closing thread for watcher for {self.file_path}...")
        super().stop()
        super().join(timeout)
        if self.is_alive():
            raise AssertionError(f"TIMEOUT! Failed to terminate watcher for {self.file_path}")
        logger.warning(f"Watcher for {self.file_path} is stopped!")
        if self.handler is not None:
            self._post_stop(self.handler)

    def wait_until_next_reload(self, reset_after: bool = False, *, timeout: int = 5):
        self.__event_file_loaded.wait(timeout)
        if reset_after:
            self.__event_file_loaded.clear()

    def wait_until_next_error(self, reset_after: bool = False, *, timeout: int = 5):
        self.__event_errored.wait(timeout)
        if reset_after:
            self.__event_errored.clear()

    def wait_until_next_event(
        self,
        reset_after: bool = False,
        *,
        timeout: int = 5,
    ) -> Literal["error", "loaded"]:
        out = ""
        while True:
            if self.__event_file_loaded.is_set():
                out = "loaded"
                break
            elif self.__event_errored.is_set():
                out = "error"
                break
            else:
                sleep(timeout)
        if reset_after:
            self.__event_file_loaded.clear()
            self.__event_errored.clear()
        return out
