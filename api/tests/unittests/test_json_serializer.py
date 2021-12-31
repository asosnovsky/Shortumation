import json
from unittest import TestCase
from ruamel.yaml.scalarstring import ScalarString
from ruamel.yaml.scalarint import ScalarInt
from ruamel.yaml.scalarbool import ScalarBoolean
from ruamel.yaml.scalarfloat import ScalarFloat
from src.yaml_serializer.types import SecretValue
from src.json_serializer import json_dumps, NOT_IMPLEMENTED_SV_MSG


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
                separators=(",", ":"),
            ),
        )

    def test_convert_ruamel_types(self):
        self.assertEqual(
            json_dumps(
                {
                    "int": ScalarInt(1),
                    "float": ScalarFloat(1.3),
                    "bool": ScalarBoolean(False),
                    "list": [1, ScalarString("w")],
                    "tup": (1, ScalarString("w")),
                }
            ),
            json.dumps(
                {
                    "int": 1,
                    "float": 1.3,
                    "bool": 0,
                    "list": [1, "w"],
                    "tup": (1, "w"),
                },
                separators=(",", ":"),
            ),
        )
