import yaml

from src.yaml_serializer.types import (
    IncludedYaml,
    IncludedYamlDir,
    SecretValue,
)


class YamlSafeDumper(yaml.SafeDumper):
    pass


YamlSafeDumper.add_representer(IncludedYaml, IncludedYaml.to_yaml)
YamlSafeDumper.add_representer(SecretValue, SecretValue.to_yaml)
YamlSafeDumper.add_representer(IncludedYamlDir, IncludedYamlDir.to_yaml)
