from pathlib import Path
from unittest import TestCase
from src.yaml_serializer import dump_yaml, IncludedYaml, SecretValue


class dumping_yamls_tests(TestCase):
    def test_dumping_includes(self):
        yaml = dump_yaml(
            {
                "automations": IncludedYaml(
                    "automations.yaml",
                    Path("/config/automations.yaml"),
                    [
                        {"id": "wow", "alias": "NO!"},
                    ],
                )
            }
        )
        self.assertEqual(yaml, "automations: !include automations.yaml\n")

    def test_dumping_secrets(self):
        yaml = dump_yaml({"google_password": SecretValue("gpass", "supersec")})
        self.assertEqual(yaml, "google_password: !secret gpass\n")
