from pathlib import Path
from tempfile import mktemp
from unittest import TestCase

from src.automations_v2.db import AutomationDBConnection


def make_temp_db():
    return AutomationDBConnection(Path(mktemp() + ".db"))


class TestWithDB(TestCase):
    def setUp(self) -> None:
        self.db = make_temp_db()
        self.db.create_db()
        self.db_file = self.db.db_file

    def tearDown(self) -> None:
        self.db_file.unlink()
