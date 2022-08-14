from pathlib import Path
from unittest import TestCase
from tempfile import mktemp

from src.automations_v2.db import AutomationDBConnection


class TestWithDB(TestCase):
    def setUp(self) -> None:
        self.db_file = Path(mktemp() + ".db")
        self.db = AutomationDBConnection(self.db_file)
        self.db.create_db()

    def tearDown(self) -> None:
        self.db_file.unlink()
