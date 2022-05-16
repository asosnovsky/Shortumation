from ruamel.yaml import YAML

from src.yaml_serializer.types import (
    IncludedYaml,
    IncludedYamlDir,
    SecretValue,
)

yaml = YAML()
yaml.register_class(IncludedYaml)
yaml.register_class(SecretValue)
yaml.register_class(IncludedYamlDir)
yaml.constructor.add_constructor("!include", IncludedYaml.from_yaml)
yaml.constructor.add_constructor("!secret", SecretValue.from_yaml)
yaml.constructor.add_constructor("!env_var", IncludedYamlDir.from_yaml)
yaml.constructor.add_constructor("!include_dir_list", IncludedYamlDir.from_yaml)
yaml.constructor.add_constructor("!include_dir_merge_list", IncludedYamlDir.from_yaml)
yaml.constructor.add_constructor("!include_dir_named", IncludedYamlDir.from_yaml)
yaml.constructor.add_constructor("!include_dir_merge_named", IncludedYamlDir.from_yaml)
