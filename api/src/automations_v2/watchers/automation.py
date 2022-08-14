from pathlib import Path
from typing import List, Optional

from src.logger import get_logger
from ...utils import extract_files

from ..db import AutomationDBConnection, DBError
from ..loader import load_automation_path
from ..types import ExtenededAutomationData
from ..errors import FailedDeletion
from .base_handler import BaseFileEventHandler
from .base_watcher import BaseWatcher

logger = get_logger(__file__)


class AutomationEventHandler(BaseFileEventHandler):
    def __init__(self, automation_file: Path, automation_db_path: Path, **kwrgs) -> None:
        self.__automation_file = automation_file.absolute()
        self.__automation_db = AutomationDBConnection(automation_db_path)
        super().__init__(**kwrgs)

    def reload_file(self, file_path: Optional[Path], deleted: bool):
        if file_path is None:
            file_path = self.__automation_file

        self.clear_automations(file_path)

        if not deleted:
            automations = list(load_automation_path(file_path))
            self.__automation_db.upsert_automations(automations)

    def clear_automations(self, file_path: Path):
        if file_path.is_dir():
            for f in extract_files(file_path):
                self.__automation_db.delete_automations_in_source_file(f)
        else:
            self.__automation_db.delete_automations_in_source_file(file_path)

    def handle_failure(self, error: Exception):
        logger.error(error)
        if isinstance(error, DBError):
            logger.warning(f"Failed to reload {self.__automation_file} due to {repr(error)}")
        else:
            logger.warning(f"Failed to load {self.__automation_file} due to {repr(error)}")
        try:
            self.clear_automations(self.__automation_file)
        except DBError as err:
            raise FailedDeletion(
                f"failed to flush automations from database for the invalid file {self.__automation_file} due to {repr(err)}"
            ) from err


class AutomationFileWatcher(BaseWatcher):
    def __init__(self, automation_file: Path, automation_db_path: Path):
        self.__automation_db_path = automation_db_path
        BaseWatcher.__init__(self, file_path=automation_file)

    def get_handler(self, **kwrgs) -> BaseFileEventHandler:
        return AutomationEventHandler(
            automation_file=self.file_path,
            automation_db_path=self.__automation_db_path,
            **kwrgs,
        )
