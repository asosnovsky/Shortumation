from unittest import TestCase
from src.automations.types import (
    AutomationActionNode,
    AutomationConditionNode,
    AutomationData,
    AutomationMetdata,
)
from src.automations.loader import load_automation
from src.json_serializer import NOT_IMPLEMENTED_SV_MSG
from src.yaml_serializer.types import (
    SecretValue,
)


class loader_tests(TestCase):
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
                sequence=[
                    AutomationConditionNode(
                        condition="template",
                        condition_data={"value_template": "states(time.time) >= '10:00:00'"},
                    ),
                    AutomationActionNode(
                        action="device",
                        action_data={
                            "device_id": NOT_IMPLEMENTED_SV_MSG,
                            "domain": "mobile_app",
                            "type": "notify",
                            "title": "Hassio Status",
                            "message": "Hassio Is turning off...",
                        },
                    ),
                ],
            ),
        )
