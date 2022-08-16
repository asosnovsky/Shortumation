from pathlib import Path
from unittest import TestCase

import yaml
from fastapi.testclient import TestClient

from src.api.app import make_app
from src.automations.types import ExtenededAutomation
from tests.utils import HA_CONFIG2_EXAMPLE, get_example_automation_loader


class BaseTestCase(TestCase):
    def setUp(self) -> None:
        (
            self.config_folder,
            self.hass_config,
            self.automation_loader,
        ) = get_example_automation_loader()
        self.client = TestClient(make_app(self.automation_loader))


class automation_list_tests(BaseTestCase):

    test_params = {"total": 32, "subtest2_found_items": 7, "subtest1_found_items": 10}

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
        self.assertEqual(d["totalItems"], self.test_params["total"])
        self.assertEqual(len(d["data"]), self.test_params["total"])

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
        self.assertEqual(d["totalItems"], self.test_params["total"])
        self.assertEqual(len(d["data"]), self.test_params["subtest1_found_items"])

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
        self.assertEqual(d["totalItems"], self.test_params["total"])
        self.assertEqual(len(d["data"]), self.test_params["subtest2_found_items"])


class automation2_lists_tests(automation_list_tests):
    test_params = {
        "total": 1,
        "subtest2_found_items": 0,
        "subtest1_found_items": 1,
    }

    def setUp(self) -> None:
        (
            self.config_folder,
            self.hass_config,
            self.automation_loader,
        ) = get_example_automation_loader(HA_CONFIG2_EXAMPLE)
        self.client = TestClient(make_app(self.automation_loader))


class automation_update_tests(BaseTestCase):
    def test_insert_new(self):
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 0})
        autos = resp.json()["data"]
        self.assertEqual(resp.json()["totalItems"], 32)
        resp = self.client.post(
            "/automations/item",
            json=ExtenededAutomation(
                id="i am new",
                configuration_key="",
                source_file_type="list",
                source_file=autos[0]["source_file"],
            ).to_json(),
        )
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 32})
        data = resp.json()
        self.assertEqual(data["totalItems"], 33)
        self.assertEqual(data["data"][0]["id"], "i am new")

    def test_update_some(self):
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 20})
        original_auto = resp.json()["data"][0]
        changed_to = ExtenededAutomation(
            id=original_auto["id"],
            alias="I have been modified",
            configuration_key=original_auto["configuration_key"],
            source_file_type=original_auto["source_file_type"],
            source_file=original_auto["source_file"],
        )
        resp = self.client.post(
            "/automations/item",
            json=changed_to.to_json(),
        )
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 20})
        new_auto = resp.json()["data"][0]
        self.assertNotEqual(original_auto, new_auto)
        self.assertEqual(
            changed_to.to_json(),
            new_auto,
        )

    def test_consistent_standard_1(self):
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 15})
        original_auto = resp.json()["data"][0]
        original_auto["alias"] = "I CHANGED!"
        resp = self.client.post(
            "/automations/item",
            json=original_auto,
        )
        self.assertEqual(resp.status_code, 200)
        with (self.config_folder / "automations.yaml").open("r") as fp:
            disk_data = dict(yaml.safe_load(fp)[15])
        trigger = list(map(dict, disk_data.pop("trigger")))
        condition = disk_data.pop("condition")
        action = list(map(dict, disk_data.pop("action")))
        self.assertDictEqual(
            disk_data,
            {"id": "1629422438707", "alias": "I CHANGED!", "description": "", "mode": "single"},
        )
        self.assertListEqual(
            trigger, [{"platform": "time", "at": "input_datetime.vita_night_pump_time"}]
        )
        self.assertListEqual(
            condition,
            [
                {
                    "conditions": [
                        {
                            "condition": "time",
                            "after": "input_datetime.vita_night_pump_time",
                            "before": "00:00:00",
                        },
                        {"condition": "time", "after": "00:00:00", "before": "06:00:00"},
                    ],
                    "condition": "and",
                },
            ],
        )
        self.assertListEqual(
            action,
            [
                {
                    "service": "light.turn_on",
                    "target": {"entity_id": "light.bulb_staircase", "area_id": "living_room"},
                    "data": {"brightness_pct": 40, "transition": 15},
                }
            ],
        )

    def test_consistent_standard_2(self):
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 27})
        original_auto = resp.json()["data"][0]
        original_auto["alias"] = "I CHANGED!"
        resp = self.client.post(
            "/automations/item",
            json=original_auto,
        )
        self.assertEqual(resp.status_code, 200)
        with (self.config_folder / "automations.yaml").open("r") as fp:
            disk_data = dict(yaml.safe_load(fp)[27])
        trigger = list(map(dict, disk_data.pop("trigger")))
        condition = disk_data.pop("condition")
        action = list(map(dict, disk_data.pop("action")))
        self.assertDictEqual(
            disk_data,
            {"id": "1649947692702", "alias": "I CHANGED!", "description": "", "mode": "single"},
        )
        self.assertListEqual(
            trigger,
            [
                {
                    "device_id": "das2qdasdasdasadaasd",
                    "domain": "zha",
                    "platform": "device",
                    "type": "remote_button_short_press",
                    "subtype": "turn_on",
                    "id": "turn_on",
                },
                {
                    "device_id": "das2qdasdasdasadaasd",
                    "domain": "zha",
                    "platform": "device",
                    "type": "remote_button_short_press",
                    "subtype": "turn_off",
                    "id": "turn_off",
                },
                {
                    "device_id": "das2qdasdasdasadaasd",
                    "domain": "zha",
                    "platform": "device",
                    "type": "remote_button_short_press",
                    "subtype": "dim_up",
                    "id": "dim_up",
                },
                {
                    "device_id": "das2qdasdasdasadaasd",
                    "domain": "zha",
                    "platform": "device",
                    "type": "remote_button_short_press",
                    "subtype": "dim_down",
                    "id": "dim_down",
                },
                {
                    "device_id": "das2qdasdasdasadaasd",
                    "domain": "zha",
                    "platform": "device",
                    "type": "remote_button_double_press",
                    "subtype": "turn_on",
                    "id": "up_dbclk",
                },
            ],
        )
        self.assertListEqual(condition, [])
        self.assertListEqual(
            action,
            [
                {
                    "choose": [
                        {
                            "conditions": [{"condition": "trigger", "id": "turn_off"}],
                            "sequence": [
                                {
                                    "type": "turn_off",
                                    "device_id": "das2qdasdasdasadaasd",
                                    "entity_id": "light.bulb_ari_lamp",
                                    "domain": "light",
                                }
                            ],
                        },
                        {
                            "conditions": [{"condition": "trigger", "id": "turn_on"}],
                            "sequence": [
                                {
                                    "service": "light.turn_on",
                                    "data": {"color_temp": 153, "brightness_pct": 100},
                                    "target": {"device_id": "das2qdasdasdasadaasd"},
                                }
                            ],
                        },
                        {
                            "conditions": [{"condition": "trigger", "id": "dim_up"}],
                            "sequence": [
                                {
                                    "device_id": "das2qdasdasdasadaasd",
                                    "domain": "light",
                                    "entity_id": "light.bulb_ari_lamp",
                                    "type": "brightness_increase",
                                }
                            ],
                        },
                        {
                            "conditions": [{"condition": "trigger", "id": "dim_down"}],
                            "sequence": [
                                {
                                    "device_id": "das2qdasdasdasadaasd",
                                    "domain": "light",
                                    "entity_id": "light.bulb_ari_lamp",
                                    "type": "brightness_decrease",
                                }
                            ],
                        },
                        {
                            "conditions": [{"condition": "trigger", "id": "up_dbclk"}],
                            "sequence": [
                                {
                                    "service": "light.turn_on",
                                    "data": {"color_temp": 500, "brightness_pct": 100},
                                    "target": {"device_id": "das2qdasdasdasadaasd"},
                                }
                            ],
                        },
                    ],
                    "default": [],
                }
            ],
        )


class automation_delete_tests(BaseTestCase):
    def test_delete_some(self):
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 0})
        autos = resp.json()["data"]
        self.assertEqual(resp.json()["totalItems"], 32)
        resp = self.client.delete(
            "/automations/item",
            json=autos[0],
        )
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post("/automations/list", json={"limit": 1, "offset": 0})
        self.assertEqual(resp.json()["totalItems"], 31)
