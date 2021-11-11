from unittest import TestCase
from src.config.AutomationLoader import (
    AutomationActionNode,
    AutomationConditionNode,
    AutomationData,
    AutomationLoader,
    AutomationMetdata,
    load_automation,
    _parse_conditions,
    _parse_actions,
)
from src.json_serializer import NOT_IMPLEMENTED_SV_MSG
from src.config.HassSafeConstructor import (
    HassConfig,
    SecretValue,
    load_hass_config,
    IncludedYaml,
)
from tests.utils import SAMPLE_HA_PATH


class config_finder_tests(TestCase):
    def test_find_sample_config(self):
        secrets, config = load_hass_config(SAMPLE_HA_PATH)
        self.assertIsInstance(config["template"], IncludedYaml)
        self.assertIsInstance(config["binary_sensor"], IncludedYaml)
        self.assertIsInstance(config["group"], IncludedYaml)
        self.assertIsInstance(config["switch"], IncludedYaml)
        self.assertEqual(secrets["myamazingpassword"], "holymoly")
        self.assertEqual(
            config["automation"].data[32]["trigger"][0]["device_id"],
            SecretValue("baby_btn_device_id", "347492ffc6b909a55ebe08745fca1bf6"),
        )

    def test_various_condition_types(self):
        raw_conditions = [
            {"condition": "template", "value_template": "silly logic here"},
            "silly logic here",
            {"condition": "time", "after": "10:00:00", "weekday": ["mon", "tue"]},
        ]
        expected_process = [
            AutomationConditionNode(
                condition="template",
                condition_data={"value_template": "silly logic here"},
            ),
            AutomationConditionNode(
                condition="template",
                condition_data={"value_template": "silly logic here"},
            ),
            AutomationConditionNode(
                condition="time",
                condition_data={"after": "10:00:00", "weekday": ["mon", "tue"]},
            ),
        ]

        for parsed, expected in zip(
            expected_process, _parse_conditions(raw_conditions)
        ):
            self.assertEqual(parsed, expected)

    def test_various_action_types(self):
        raw_conditions = [
            {"condition": "template", "value_template": "silly logic here"},
            "silly logic here",
            {"condition": "time", "after": "10:00:00", "weekday": ["mon", "tue"]},
            {
                "service": "light.turn_on",
                "target": ["light.kitchen"],
                "data": {"brightness": 10},
            },
            {"something": "is wrong"},
            {
                "alias": "Doing amazing things!",
                "repeat": {
                    "count": 1000,
                    "sequence": [
                        "conditionA",
                        {
                            "wait_template": "states('light.kitchen') == 'off",
                            "timeout": 10,
                        },
                        {
                            "type": "toggle",
                            "domain": "light",
                            "device_id": "1231412",
                        },
                    ],
                },
            },
            {"event": "custom-event", "event_data": "wow"},
            {
                "type": "toggle",
                "domain": "light",
                "device_id": "1231412",
            },
            {
                "alias": "Doing amazing things!",
                "choose": [
                    {
                        "conditions": [
                            r"{{ states('switch.plug_out_bug_lamp') == 'unavailable'}}",
                        ],
                        "sequence": [
                            "conditionA",
                            {
                                "wait_template": "states('light.kitchen') == 'off",
                                "timeout": 10,
                            },
                            {
                                "type": "toggle",
                                "domain": "light",
                                "device_id": "1231412",
                            },
                        ],
                    }
                ],
                "default": [{"event": "nope", "event_data": {}}],
            },
        ]
        expected_process = [
            AutomationConditionNode(
                condition="template",
                condition_data={"value_template": "silly logic here"},
            ),
            AutomationConditionNode(
                condition="template",
                condition_data={"value_template": "silly logic here"},
            ),
            AutomationConditionNode(
                condition="time",
                condition_data={"after": "10:00:00", "weekday": ["mon", "tue"]},
            ),
            AutomationActionNode(
                action="service",
                action_data={
                    "service": "light.turn_on",
                    "target": ["light.kitchen"],
                    "data": {"brightness": 10},
                },
            ),
            AutomationActionNode(
                action="unknown", action_data={"something": "is wrong"}
            ),
            AutomationActionNode(
                action="repeat",
                action_data={
                    "alias": "Doing amazing things!",
                    "repeat": {
                        "count": 1000,
                        "sequence": [
                            AutomationConditionNode(
                                condition="template",
                                condition_data={"value_template": "conditionA"},
                            ),
                            AutomationActionNode(
                                action="wait",
                                action_data={
                                    "wait_template": "states('light.kitchen') == 'off",
                                    "timeout": 10,
                                },
                            ),
                            AutomationActionNode(
                                action="device",
                                action_data={
                                    "type": "toggle",
                                    "domain": "light",
                                    "device_id": "1231412",
                                },
                            ),
                        ],
                    },
                },
            ),
            AutomationActionNode(
                action="event",
                action_data={"event": "custom-event", "event_data": "wow"},
            ),
            AutomationActionNode(
                action="device",
                action_data={
                    "type": "toggle",
                    "domain": "light",
                    "device_id": "1231412",
                },
            ),
            AutomationActionNode(
                action="choose",
                action_data={
                    "alias": "Doing amazing things!",
                    "choose": [
                        {
                            "conditions": [
                                AutomationConditionNode(
                                    condition="template",
                                    condition_data={
                                        "value_template": r"{{ states('switch.plug_out_bug_lamp') == 'unavailable'}}"
                                    },
                                )
                            ],
                            "sequence": [
                                AutomationConditionNode(
                                    condition="template",
                                    condition_data={"value_template": "conditionA"},
                                ),
                                AutomationActionNode(
                                    action="wait",
                                    action_data={
                                        "wait_template": "states('light.kitchen') == 'off",
                                        "timeout": 10,
                                    },
                                ),
                                AutomationActionNode(
                                    action="device",
                                    action_data={
                                        "type": "toggle",
                                        "domain": "light",
                                        "device_id": "1231412",
                                    },
                                ),
                            ],
                        }
                    ],
                    "default": [
                        AutomationActionNode(
                            action="event",
                            action_data={"event": "nope", "event_data": {}},
                        )
                    ],
                },
            ),
        ]

        for expected, parsed in zip(expected_process, _parse_actions(raw_conditions)):
            self.assertEqual(parsed, expected)

    def test_load_automation_runs(self):
        auto = list(
            load_automation(
                [
                    {
                        "id": "1616887975473",
                        "alias": "Home Assistant Off",
                        "description": "",
                        "trigger": [{"platform": "homeassistant", "event": "shutdown"}],
                        "condition": ["states(time.time) >= '10:00:00'"],
                        "action": [
                            {
                                "device_id": SecretValue("my_mobile_phone", "..."),
                                "domain": "mobile_app",
                                "type": "notify",
                                "title": "Hassio Status",
                                "message": "Hassio Is turning off...",
                            }
                        ],
                        "mode": "single",
                    }
                ]
            )
        )
        self.assertEqual(
            auto[0],
            AutomationData(
                metadata=AutomationMetdata(
                    id="1616887975473",
                    alias="Home Assistant Off",
                    description="",
                    mode="single",
                ),
                trigger=[{"platform": "homeassistant", "event": "shutdown"}],
                condition=[
                    AutomationConditionNode(
                        condition="template",
                        condition_data={
                            "value_template": "states(time.time) >= '10:00:00'"
                        },
                    )
                ],
                action=[
                    AutomationActionNode(
                        action="device",
                        action_data={
                            "device_id": NOT_IMPLEMENTED_SV_MSG,
                            "domain": "mobile_app",
                            "type": "notify",
                            "title": "Hassio Status",
                            "message": "Hassio Is turning off...",
                        },
                    )
                ],
            ),
        )

    def test_finding_with_AutomationLoader(self):
        automation_loader = AutomationLoader(load_hass_config(SAMPLE_HA_PATH))

        first_auto_with_find = list(automation_loader.find(limit=1))
        first_auto_with_get = automation_loader.get(0)
        self.assertEqual(first_auto_with_find[0], first_auto_with_get)

        kitchen_autos = list(automation_loader.find(alias="kitchen"))
        self.assertTrue(len(kitchen_autos), 3)
