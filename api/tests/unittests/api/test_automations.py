from pathlib import Path
from unittest import TestCase

import yaml
from fastapi.testclient import TestClient

from src.api.app import make_app
from src.automations.types import Automation, ExtenededAutomation
from tests.utils import (
    HA_CONFIG2_EXAMPLE,
    HA_CONFIG6_EXAMPLE,
    HA_CONFIG10_EXAMPLE,
    get_example_automation_loader,
)


class BaseTestCase(TestCase):
    def setUp(self) -> None:
        (
            self.config_folder,
            self.hass_config,
            self.automation_loader,
        ) = get_example_automation_loader()
        self.client = TestClient(make_app(self.automation_loader))


class automation_pagination_tests(BaseTestCase):

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


class automation_pagination_tests_2(automation_pagination_tests):
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
    test_params = {
        "total": 32,
        "modify_item": 20,
        "consitency_tests": {
            1: {
                "offset": 15,
                "file_offset": 15,
                "expected_change": {
                    "metadata": {
                        "id": "1629422438707",
                        "alias": "I CHANGED!",
                        "description": "",
                        "mode": "single",
                    },
                    "trigger": [{"platform": "time", "at": "input_datetime.vita_night_pump_time"}],
                    "condition": [
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
                    "action": [
                        {
                            "service": "light.turn_on",
                            "target": {
                                "entity_id": "light.bulb_staircase",
                                "area_id": "living_room",
                            },
                            "data": {"brightness_pct": 40, "transition": 15},
                        }
                    ],
                },
            },
            2: {
                "offset": 27,
                "file_offset": 27,
                "expected_change": {
                    "metadata": {
                        "id": "1649947692702",
                        "alias": "I CHANGED!",
                        "description": "",
                        "mode": "single",
                    },
                    "trigger": [
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
                    "condition": [],
                    "action": [
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
                },
            },
        },
    }

    def test_insert_new(self):
        resp = self.client.post(
            "/automations/list", json={"limit": self.test_params["total"] + 1, "offset": 0}
        )
        autos = resp.json()["data"]
        self.assertEqual(resp.json()["totalItems"], self.test_params["total"])
        self.assertNotIn("i am new", set([a["id"] for a in autos]))
        resp = self.client.post(
            "/automations/item",
            json=Automation(
                id="i am new",
            ).dict(),
        )
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post(
            "/automations/list", json={"limit": self.test_params["total"] + 1, "offset": 0}
        )
        data = resp.json()
        self.assertEqual(data["totalItems"], self.test_params["total"] + 1)
        self.assertIn("i am new", set([a["id"] for a in data["data"]]))

    def test_update_some(self):
        resp = self.client.post(
            "/automations/list", json={"limit": 1, "offset": self.test_params["modify_item"]}
        )
        original_auto = resp.json()["data"][0]
        changed_to = ExtenededAutomation(
            id=original_auto["id"],
            alias="I have been modified",
            configuration_key=original_auto["configuration_key"],
            source_file_type=original_auto["source_file_type"],
            source_file=original_auto["source_file"],
        )
        resp = self.client.put(
            "/automations/item",
            json=changed_to.to_json(),
        )
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post(
            "/automations/list", json={"limit": 1, "offset": self.test_params["modify_item"]}
        )
        new_auto = resp.json()["data"][0]
        self.assertNotEqual(original_auto, new_auto)
        self.assertEqual(
            changed_to.to_json(),
            new_auto,
        )

    def test_consistent_standard_1(self):
        for test_id, test_params in self.test_params["consitency_tests"].items():
            with self.subTest(test_id=test_id):
                resp = self.client.post(
                    "/automations/list",
                    json={"limit": 1, "offset": test_params["offset"]},
                )
                original_auto = resp.json()["data"][0]
                original_auto["alias"] = "I CHANGED!"
                resp = self.client.post(
                    "/automations/item",
                    json=original_auto,
                )
                self.assertEqual(resp.status_code, 200)
                with (self.config_folder / original_auto["source_file"]).open("r") as fp:
                    disk_data = dict(yaml.safe_load(fp)[test_params["file_offset"]])
                trigger = list(map(dict, disk_data.pop("trigger")))
                condition = disk_data.pop("condition")
                action = list(map(dict, disk_data.pop("action")))
                self.assertDictEqual(
                    disk_data,
                    test_params["expected_change"]["metadata"],
                )
                self.assertListEqual(
                    trigger,
                    test_params["expected_change"]["trigger"],
                )
                self.assertListEqual(
                    condition,
                    test_params["expected_change"]["condition"],
                )
                self.assertListEqual(
                    action,
                    test_params["expected_change"]["action"],
                )


class automation_update_split_config_tests(automation_update_tests):
    test_params = {
        "total": 12,
        "modify_item": 3,
        "consitency_tests": {
            1: {
                "offset": 3,
                "file_offset": 0,
                "expected_change": {
                    "metadata": {
                        "alias": "I CHANGED!",
                        "description": "Example",
                        "id": "ui1",
                        "mode": "single",
                    },
                    "trigger": [{"platform": "homeassistant", "event": "start"}],
                    "condition": [],
                    "action": [
                        {
                            "service": "counter.increment",
                            "data": {},
                            "target": {"entity_id": "counter.up_times"},
                        }
                    ],
                },
            },
        },
    }

    def setUp(self) -> None:
        (
            self.config_folder,
            self.hass_config,
            self.automation_loader,
        ) = get_example_automation_loader(HA_CONFIG6_EXAMPLE)
        self.client = TestClient(make_app(self.automation_loader))


class automation_update_split_config_and_inline_config_tests(automation_update_tests):
    test_params = {
        "total": 4,
        "modify_item": 0,
        "consitency_tests": {},
    }

    def setUp(self) -> None:
        (
            self.config_folder,
            self.hass_config,
            self.automation_loader,
        ) = get_example_automation_loader(HA_CONFIG10_EXAMPLE)
        self.client = TestClient(make_app(self.automation_loader))


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
