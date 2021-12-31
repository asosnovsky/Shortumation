import io
from pathlib import Path
from unittest import TestCase
from src.yaml_serializer import (
    dump_yaml,
    load_yaml,
)
from src.yaml_serializer.types import (
    IncludedYaml,
    SecretValue,
    IncludedYamlDir,
)


class dumping_yamls_tests(TestCase):
    def test_dumping_includes(self):
        yaml = dump_yaml(
            {
                "automations": IncludedYaml(
                    Path("automations.yaml"),
                )
            }
        )
        self.assertEqual(yaml, f"automations: !include {Path('automations.yaml').absolute()}\n")

    def test_dumping_secrets(self):
        yaml = dump_yaml({"google_password": SecretValue("gpass", "supersec")})
        self.assertEqual(yaml, "google_password: !secret gpass\n")

    def test_dumping_stub(self):
        yaml = dump_yaml({"sensor": IncludedYamlDir("include_dir_list", "sensors/*yaml")})
        self.assertEqual(yaml, "sensor: !include_dir_list sensors/*yaml\n")

    def test_load_stub(self):
        yaml_obj = load_yaml(
            io.StringIO(
                """
        name: cool
        google_password: !secret gpass
        sensor: !include_dir_list sensors/*yaml
        automations: !include automations.yaml
        """
            )
        )
        self.assertDictEqual(
            dict(yaml_obj),
            {
                "name": "cool",
                "google_password": SecretValue("gpass", "n/a"),
                "sensor": IncludedYamlDir("include_dir_list", "sensors/*yaml"),
                "automations": IncludedYaml(Path("automations.yaml").absolute()),
            },
        )
        self.assertEqual(
            dump_yaml(yaml_obj),
            "name: cool\n"
            "google_password: !secret gpass\n"
            "sensor: !include_dir_list sensors/*yaml\n"
            f"automations: !include {Path('automations.yaml').absolute()}\n",
        )
