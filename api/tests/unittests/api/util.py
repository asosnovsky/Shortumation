from unittest import TestCase

from fastapi.testclient import TestClient

from src.api.app import make_app
from tests.utils import (
    HA_CONFIG_EXAMPLE,
    get_example_automation_loader,
)


class BaseTestCase(TestCase):

    source_config_path = HA_CONFIG_EXAMPLE

    def setUp(self) -> None:
        (
            self.config_folder,
            self.hass_config,
            self.automation_loader,
        ) = get_example_automation_loader(config_to_copy=self.source_config_path)
        self.client = TestClient(make_app(self.automation_loader))
