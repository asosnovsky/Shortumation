from unittest import TestCase
from src.automations.types import (
    AutomationActionNode,
    AutomationConditionNode,
)
from src.automations.parsers import (
    _parse_conditions,
    _parse_actions,
)
from src.json_serializer import NOT_IMPLEMENTED_SV_MSG
from src.yaml_serializer.types import (
    SecretValue,
)


class parser_tests(TestCase):
    def test_various_condition_types(self):
        raw_conditions = [
            {"condition": "template", "value_template": "silly logic here"},
            "silly logic here",
            {"condition": "time", "after": "10:00:00", "weekday": ["mon", "tue"]},
            {"condition": "what is this?", "wuba": "dub"},
            SecretValue("supersecretcondition", "rm -rf ./*"),
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
            AutomationConditionNode(
                condition="what is this?",
                condition_data={"wuba": "dub"},
            ),
            AutomationConditionNode(
                condition="template",
                condition_data={"value_template": NOT_IMPLEMENTED_SV_MSG},
            ),
        ]

        for expected, parsed in zip(expected_process, _parse_conditions(raw_conditions)):
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
            AutomationActionNode(action="unknown", action_data={"something": "is wrong"}),
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

    # def test_invalid_automations(self):
    #     with self.assertRaises(AutomationLoaderException):
    #         AutomationLoader(
    #             HassConfig(
    #                 secrets={},
    #                 config={
    #                     "automation": "bob",
    #                 },
    #                 root_config_path=Path("."),
    #             )
    #         )

    #     with self.assertRaises(AutomationLoaderException):
    #         AutomationLoader(
    #             HassConfig(
    #                 secrets={},
    #                 config={},
    #                 root_config_path=Path("."),
    #             )
    #         )

    # def test_overwriting_one_auto_in_separate_file(self):
    #     # create dummy data
    #     config_path = create_dummy_config_folder(
    #         auto=[
    #             AutomationData(
    #                 metadata=AutomationMetdata(
    #                     id="01",
    #                 )
    #             ),
    #             AutomationData(
    #                 metadata=AutomationMetdata(
    #                     id="02",
    #                 )
    #             ),
    #             AutomationData(
    #                 metadata=AutomationMetdata(
    #                     id="03",
    #                 )
    #             ),
    #         ]
    #     )
    #     # check the data is loaded well
    #     automation_loader = AutomationLoader(load_hass_config(config_path))
    #     self.assertEqual(automation_loader.get(0).metadata.id, "01")
    #     self.assertEqual(automation_loader.get(1).metadata.id, "02")
    #     self.assertEqual(automation_loader.get(2).metadata.id, "03")
    #     self.assertIsNone(automation_loader.get(3))
    #     self.assertEqual(len(automation_loader), 3)
    #     # update auto #1
    #     automation_loader.save(
    #         1,
    #         AutomationData(
    #             metadata=AutomationMetdata(id="02", alias="flush toilet!"),
    #             trigger=[{"event": "toilet.flushed"}],
    #         ),
    #     )
    #     # check that in-memory data is correctly updated
    #     self.assertEqual(automation_loader.get(1).metadata.id, "02")
    #     self.assertEqual(automation_loader.get(1).metadata.alias, "flush toilet!")
    #     self.assertListEqual(automation_loader.get(1).trigger, [{"event": "toilet.flushed"}])

    #     # check that disk data is correctly updated
    #     reloaded_automation_loader = AutomationLoader(load_hass_config(config_path))
    #     self.assertEqual(len(automation_loader), 3)
    #     self.assertEqual(reloaded_automation_loader.get(1).metadata.id, "02")
    #     self.assertEqual(reloaded_automation_loader.get(1).metadata.alias, "flush toilet!")
    #     self.assertListEqual(
    #         reloaded_automation_loader.get(1).trigger, [{"event": "toilet.flushed"}]
    #     )
    #     # add new auto
    #     automation_loader.save(
    #         3,
    #         AutomationData(
    #             metadata=AutomationMetdata(id="newest", alias="testing autos"),
    #             sequence=[
    #                 AutomationConditionNode(condition="time", condition_data={"at": "10:00:00"})
    #             ],
    #         ),
    #     )
    #     # check that in-memory data is correctly updated
    #     self.assertEqual(len(automation_loader), 4)
    #     self.assertEqual(automation_loader.get(3).metadata.id, "newest")
    #     self.assertEqual(automation_loader.get(3).metadata.alias, "testing autos")
    #     self.assertListEqual(
    #         automation_loader.get(3).sequence,
    #         [AutomationConditionNode(condition="time", condition_data={"at": "10:00:00"})],
    #     )
    #     # check that disk data is correctly updated
    #     reloaded_automation_loader = AutomationLoader(load_hass_config(config_path))
    #     self.assertEqual(len(reloaded_automation_loader), 4)
    #     self.assertEqual(reloaded_automation_loader.get(3).metadata.id, "newest")
    #     self.assertEqual(reloaded_automation_loader.get(3).metadata.alias, "testing autos")
    #     self.assertListEqual(
    #         reloaded_automation_loader.get(3).sequence,
    #         [AutomationConditionNode(condition="time", condition_data={"at": "10:00:00"})],
    #     )
