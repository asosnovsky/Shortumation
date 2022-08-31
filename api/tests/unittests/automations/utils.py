from unittest import TestCase

from src.automations.db import AutomationDBConnection


class TestWithDB(TestCase):
    def setUp(self) -> None:
        self.db = AutomationDBConnection()
