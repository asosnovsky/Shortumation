import yaml

from src.yaml_serializer.types import (
    IncludedYaml,
    IncludedYamlDir,
    SecretValue,
)


class YamlSafeLoader(yaml.SafeLoader):
    pass


YamlSafeLoader.add_constructor("!include", IncludedYaml.from_yaml)
YamlSafeLoader.add_constructor("!secret", SecretValue.from_yaml)
YamlSafeLoader.add_constructor("!env_var", IncludedYamlDir.from_yaml)
YamlSafeLoader.add_constructor("!include_dir_list", IncludedYamlDir.from_yaml)
YamlSafeLoader.add_constructor("!include_dir_merge_list", IncludedYamlDir.from_yaml)
YamlSafeLoader.add_constructor("!include_dir_named", IncludedYamlDir.from_yaml)
YamlSafeLoader.add_constructor("!include_dir_merge_named", IncludedYamlDir.from_yaml)
