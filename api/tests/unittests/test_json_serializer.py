import json
from unittest import TestCase

from src.json_serializer import json_dumps
from src.yaml_serializer import NOT_IMPLEMENTED_SV_MSG, SecretValue


class json_serializer_tests(TestCase):
    def test_convert_secret_value(self):
        self.assertEqual(
            json_dumps(
                {
                    "int": 1,
                    "float": 1.3,
                    "bool": False,
                    "list": [1, "w"],
                    "tup": (1, "w"),
                    "some": {"deep": {"obj": SecretValue("super", "sec")}},
                }
            ),
            json.dumps(
                {
                    "int": 1,
                    "float": 1.3,
                    "bool": False,
                    "list": [1, "w"],
                    "tup": (1, "w"),
                    "some": {"deep": {"obj": NOT_IMPLEMENTED_SV_MSG}},
                },
            ),
        )
