from ruamel.yaml import YAML
from src.yaml_serializer.types import IncludedYaml, SecretValue

yaml = YAML()
yaml.register_class(IncludedYaml)
yaml.register_class(SecretValue)
