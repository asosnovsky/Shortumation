from pathlib import Path
from typing import Any, Literal, NamedTuple, Optional, Union
from ruamel.yaml import YAML
from ruamel.yaml.constructor import SafeConstructor
from ruamel.yaml.nodes import Node
from src.logger import logger


class HassConfig(NamedTuple):
    """The final output for load_hass_config"""

    secrets: dict  # the secrets file content
    config: dict  # the complete configration.yaml tree


class IncludedYaml(NamedTuple):
    """Any time something in the yaml is specified as `include !filepath`
    this data type will represent it.
    """

    original_path: Path  # path to location of original file
    data: Any  # the parsed data


class SecretValue(NamedTuple):
    name: str
    value: str


def load_hass_config(file_path: Path) -> HassConfig:
    HAY = HassYaml()
    data = HAY.load(file_path / "configuration.yaml")
    return HassConfig(HAY.secrets, data)


class HassYaml:
    """Load a YAML file based on the standard defined by HASS

    Args:
        file_path (Path): path to yaml file

    Returns:
        dict
    """

    def __init__(self) -> None:
        self.secrets: dict = {}
        self.current_file_path: Optional[str] = None
        self.yaml_loader = YAML(typ="safe")
        # Compat with HASS
        self.yaml_loader.allow_duplicate_keys = True

        # Stub HASS constructors
        class HassSafeConstructor(SafeConstructor):
            """Hass specific SafeConstructor."""

        def _include_yaml(_loader, node: Node):
            """Load another YAML file and embeds it using the !include tag.

            Example:
                device_tracker: !include device_tracker.yaml
            """
            root_path = (
                self.current_file_path.parent
                if self.current_file_path is not None
                else Path("/")
            )
            file_path = _upward_recursive_search(root_path, node.value)
            if file_path is None:
                logger.warning(f"Could not find `!include {node.value}`!")
                return None
            else:
                logger.info(f"Found `!include {node.value}` in {file_path.absolute()}!")

            return IncludedYaml(file_path, self.__internal_constructor_load(file_path))

        def _secret_yaml(loader, node: Node):
            """Load secrets and embed it into the configuration YAML."""
            secret = self.secrets.get(node.value, None)

            if secret is None:
                logger.warning(
                    f"The secret {node.value} failed to load, please check your `secret.yaml` file."
                )
            return SecretValue(node.value, secret)

        HassSafeConstructor.add_constructor("!include", _include_yaml)
        HassSafeConstructor.add_constructor("!env_var", _stub_tag)
        HassSafeConstructor.add_constructor("!secret", _secret_yaml)
        HassSafeConstructor.add_constructor("!include_dir_list", _stub_tag)
        HassSafeConstructor.add_constructor("!include_dir_merge_list", _stub_tag)
        HassSafeConstructor.add_constructor("!include_dir_named", _stub_tag)
        HassSafeConstructor.add_constructor("!include_dir_merge_named", _stub_tag)

        self.yaml_loader.Constructor = HassSafeConstructor

    def load(self, file_path: Path) -> dict:
        """Loads a given yaml file into a dictionary

        Args:
            file_path (Path): path to yaml file

        Returns:
            dict
        """
        self.secrets = self.__load_secrets(file_path.parent)
        return self.__load(file_path)

    def __internal_constructor_load(self, file_path: Path):
        """This is similar to `self.load` function but it is only called internally by the yaml parsers
        as it also manages the references to which file we are currently processing

        Args:
            file_path (Path): path to yaml file

        Returns:
            dict
        """
        last_file_path = self.current_file_path
        loaded = self.__load(file_path)
        self.current_file_path = last_file_path
        return loaded

    def __load(self, file_path: Path) -> dict:
        """Generic load yaml function.
        This function is called by either `self.load` or `self.__internal_constructor_load`

        Args:
            file_path (Path): path to yaml file

        Returns:
            dict
        """
        self.current_file_path = file_path
        with file_path.open(encoding="utf-8") as conf_file:
            # If configuration file is empty YAML returns None
            # We convert that to an empty dict
            return self.yaml_loader.load(conf_file) or {}

    def __load_secrets(self, root_path: Path) -> dict:
        """Preloads all of the secrets into memory

        Args:
            root_path (Path): root path where we search for the serects.yaml file

        Returns:
            dict: all secrets in dict format
        """
        file_path = _upward_recursive_search(root_path, "secrets.yaml")
        if file_path is None:
            logger.warning(f"Secrets file could not be found!")
            return {}
        else:
            logger.info(f"Found secrets file in `{file_path.absolute()}`!")

        with file_path.open() as secret_file:
            return YAML(typ="safe").load(secret_file)


def _upward_recursive_search(root_dir: Path, file_name: str) -> Optional[Path]:
    """Recursively search for a file or return None
    i.e.
    assume we are in local deployment where our /config is sitting in /home/awesomeuser/ha/config
    you specified somewhere in the yaml `device_tracker: !include device_tracker.yaml`
    then
        root_dir = Path(/home/awesomeuser/ha/config)
        file_name = device_tracker.yaml
    we then first search /home/awesomeuser/ha/config
    if we find nothin go up to /home/awesomeuser/ha
    if we find nothin go up to /home/awesomeuser
    if we find nothin go up to /home
    if we find nothin go up to /
    if we still find nothing return None
    if we found something at any stage, we will return it's direct path

    Args:
        root_dir (Path)
        file_name (str)

    Returns:
        Optional[Path]
    """
    dir_path = root_dir
    file_path = dir_path / file_name
    for _ in root_dir.parts:
        if file_path.exists():
            return file_path
        dir_path = root_dir
        file_path = dir_path / file_name
    return None


def _stub_tag(constructor, node: Node):
    """Stub a constructor with a dictionary."""
    seen = getattr(constructor, "_stub_seen", None)

    if seen is None:
        seen = constructor._stub_seen = set()

    if node.tag not in seen:
        logger.warning(f"YAML tag {node.tag} is not supported")
        seen.add(node.tag)

    return {}
