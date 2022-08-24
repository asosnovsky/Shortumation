import io
from pathlib import Path
from unittest import TestCase

from src.yaml_serializer import (
    IncludedYaml,
    IncludedYamlDir,
    SecretValue,
    dump_yaml,
    load_yaml,
)


class dumping_yamls_tests(TestCase):
    def test_dumping_includes(self):
        yaml = dump_yaml(
            {
                "automations": IncludedYaml(
                    Path.cwd() / "automations.yaml",
                )
            },
            Path.cwd(),
        )
        self.assertEqual(yaml, "automations: !include 'automations.yaml'\n")

    def test_dumping_secrets(self):
        yaml = dump_yaml({"google_password": SecretValue("gpass", "supersec")}, Path.cwd())
        self.assertEqual(yaml, "google_password: !secret 'gpass'\n")

    def test_dumping_include_dir_list(self):
        yaml = dump_yaml(
            {"sensor": IncludedYamlDir("include_dir_list", Path.cwd() / "sensors")}, Path.cwd()
        )
        self.assertEqual(yaml, "sensor: !include_dir_list 'sensors'\n")

    def test_dumping_include_dir_merge_list(self):
        yaml = dump_yaml(
            {"sensor": IncludedYamlDir("include_dir_merge_list", Path.cwd() / "sensors")},
            Path.cwd(),
        )
        self.assertEqual(yaml, "sensor: !include_dir_merge_list 'sensors'\n")

    def test_load_complex_automation_setup(self):
        yaml_obj = load_yaml(
            io.StringIO(
                """
        automation manual: !include_dir_list ./automations/include_dir_list
        automation ui: !include automations/ui.yaml
        automation: !include automations/base.yaml
        automation cools: !include_dir_merge_list automations/include_dir_merge_list
        """
            ),
            Path.cwd(),
        )
        self.assertDictEqual(
            dict(yaml_obj),
            {
                "automation manual": IncludedYamlDir(
                    "include_dir_list", Path.cwd() / "automations/include_dir_list"
                ),
                "automation ui": IncludedYaml(Path.cwd() / "automations/ui.yaml"),
                "automation cools": IncludedYamlDir(
                    "include_dir_merge_list", Path.cwd() / "automations/include_dir_merge_list"
                ),
                "automation": IncludedYaml(Path.cwd() / "automations/base.yaml"),
            },
        )

    def test_load_stub(self):
        yaml_obj = load_yaml(
            io.StringIO(
                """
        name: cool
        date: "10:00"
        bools:
            - "yes"
            - "no"
            - true
            - false
        bobIsNull:
        bobIsNull2: null
        google_password: !secret gpass
        sensor: !include_dir_list sensors
        automations: !include automations.yaml
        """
            ),
            Path.cwd(),
        )
        self.assertDictEqual(
            dict(yaml_obj),
            {
                "name": "cool",
                "date": "10:00",
                "bools": ["yes", "no", True, False],
                "bobIsNull": None,
                "bobIsNull2": None,
                "google_password": SecretValue("gpass", "n/a"),
                "sensor": IncludedYamlDir("include_dir_list", Path.cwd() / "sensors"),
                "automations": IncludedYaml(Path.cwd() / "automations.yaml"),
            },
        )
        self.assertEqual(
            dump_yaml(yaml_obj, Path.cwd()),
            """name: cool
date: '10:00'
bools:
- 'yes'
- 'no'
- true
- false
bobIsNull: null
bobIsNull2: null
google_password: !secret 'gpass'
sensor: !include_dir_list 'sensors'
automations: !include 'automations.yaml'
""",
        )
