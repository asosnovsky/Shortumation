import yaml

from src.yaml_serializer.types import (
    IncludedYaml,
    IncludedYamlDir,
    SecretValue,
)


class YamlSafeLoader(yaml.SafeLoader):
    pass
    # def compose_node(self, parent: yaml.nodes.Node, index: int) -> yaml.nodes.Node:  # type: ignore[override]
    #     """Annotate a node with the first line it was seen."""
    #     last_line: int = self.line
    #     node: yaml.nodes.Node = super().compose_node(parent, index)  # type: ignore[assignment]
    #     node.__line__ = last_line + 1  # type: ignore[attr-defined]
    #     return node


YamlSafeLoader.add_constructor("!include", IncludedYaml.from_yaml)
YamlSafeLoader.add_constructor("!secret", SecretValue.from_yaml)
YamlSafeLoader.add_constructor("!env_var", IncludedYamlDir.from_yaml)
YamlSafeLoader.add_constructor("!include_dir_list", IncludedYamlDir.from_yaml)
YamlSafeLoader.add_constructor("!include_dir_merge_list", IncludedYamlDir.from_yaml)
YamlSafeLoader.add_constructor("!include_dir_named", IncludedYamlDir.from_yaml)
YamlSafeLoader.add_constructor("!include_dir_merge_named", IncludedYamlDir.from_yaml)
