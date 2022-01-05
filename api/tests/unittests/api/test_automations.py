from unittest import TestCase
from fastapi.testclient import TestClient
from src.api.app import make_app
from src.automations.types import AutomationData, AutomationMetdata
from tests.utils import get_example_automation_loader


class BaseTestCase(TestCase):
    def setUp(self) -> None:
        (
            self.config_folder,
            self.hass_config,
            self.automation_loader,
        ) = get_example_automation_loader()
        self.client = TestClient(make_app(self.automation_loader))


class automation_list_tests(BaseTestCase):
    def test_get_list_of_everything(self):
        data = self.client.post(
            "/automations/list",
            json={
                "offset": 0,
                "limit": 50,
            },
        )
        self.assertEqual(data.status_code, 200)
        d = data.json()
        self.assertEqual(
            d["params"],
            {
                "offset": 0,
                "limit": 50,
            },
        )
        self.assertEqual(d["totalItems"], 31)
        self.assertEqual(len(d["data"]), 31)

    def test_subset1(self):
        data = self.client.post(
            "/automations/list",
            json={
                "offset": 0,
                "limit": 10,
            },
        )
        self.assertEqual(data.status_code, 200)
        d = data.json()
        self.assertEqual(
            d["params"],
            {
                "offset": 0,
                "limit": 10,
            },
        )
        self.assertEqual(d["totalItems"], 31)
        self.assertEqual(len(d["data"]), 10)

    def test_subset2(self):
        data = self.client.post(
            "/automations/list",
            json={
                "offset": 25,
                "limit": 10,
            },
        )
        self.assertEqual(data.status_code, 200)
        d = data.json()
        self.assertEqual(
            d["params"],
            {
                "offset": 25,
                "limit": 10,
            },
        )
        self.assertEqual(d["totalItems"], 31)
        self.assertEqual(len(d["data"]), 6)


class automation_update_tests(BaseTestCase):
    def test_insert_new(self):
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 0})
        self.assertEqual(resp.json()["totalItems"], 31)
        resp = self.client.post(
            "/automations",
            json={
                "index": 33,
                "data": AutomationData(metadata=AutomationMetdata(id="testme")).dict(),
            },
        )
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 31})
        data = resp.json()
        self.assertEqual(data["totalItems"], 32)
        self.assertEqual(data["data"][0]["metadata"]["id"], "testme")

    def test_update_some(self):
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 20})
        original_auto = resp.json()["data"][0]
        resp = self.client.post(
            "/automations",
            json={
                "index": 20,
                "data": AutomationData(metadata=AutomationMetdata(id="testme")).dict(),
            },
        )
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 20})
        new_auto = resp.json()["data"][0]
        self.assertNotEqual(original_auto, new_auto)
        self.assertEqual(AutomationData(metadata=AutomationMetdata(id="testme")).dict(), new_auto)


class automation_delete_tests(BaseTestCase):
    def test_delete_some(self):
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 0})
        self.assertEqual(resp.json()["totalItems"], 31)
        resp = self.client.delete(
            "/automations",
            json={
                "index": 20,
            },
        )
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 0})
        self.assertEqual(resp.json()["totalItems"], 30)
