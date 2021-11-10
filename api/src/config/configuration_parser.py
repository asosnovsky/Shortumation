import os

from pathlib import Path
from ruamel.yaml import YAML
from ruamel.yaml.constructor import SafeConstructor
from .globals import CONFIGURATION_PATH


class HassSafeConstructor(SafeConstructor):
    """Hass specific SafeConstructor."""


def _secret_yaml(loader, node):
    """Load secrets and embed it into the configuration YAML."""
    dirpath = Path(os.path.dirname(loader.name))

    # Recursively search for the secrets.yaml file
    # this might be needed when a yaml file is included like
    # `!included folder/file.yaml`. Same rules as
    # https://www.home-assistant.io/docs/configuration/secrets/#debugging-secrets
    fname = dirpath / "secrets.yaml"
    for _ in range(len(dirpath.parts)):
        if fname.exists() or (
            CONFIGURATION_PATH is not None
            and CONFIGURATION_PATH.exists()
            and dirpath.samefile(CONFIGURATION_PATH)
        ):
            break
        dirpath = dirpath.parent
        fname = dirpath / "secrets.yaml"

    try:
        with fname.open() as secret_file:
            secrets = YAML(typ="safe").load(secret_file)
    except FileNotFoundError:
        raise ValueError("Secrets file {} not found".format(fname)) from None

    try:
        return secrets[node.value]
    except KeyError:
        raise ValueError("Secret {} not found".format(node.value)) from None


def _include_yaml(loader, node):
    """Load another YAML file and embeds it using the !include tag.

    Example:
        device_tracker: !include device_tracker.yaml
    """
    dirpath = Path(os.path.dirname(loader.name))
    fname = dirpath / node.value
    for _ in range(len(dirpath.parts)):
        if fname.exists() or (
            CONFIGURATION_PATH is not None
            and CONFIGURATION_PATH.exists()
            and dirpath.samefile(CONFIGURATION_PATH)
        ):
            break
        dirpath = dirpath.parent
        fname = dirpath / node.value

    return load_yaml(os.path.join(dirpath, node.value))


def _stub_tag(constructor, node):
    """Stub a constructor with a dictionary."""
    seen = getattr(constructor, "_stub_seen", None)

    if seen is None:
        seen = constructor._stub_seen = set()

    if node.tag not in seen:
        print("YAML tag {} is not supported".format(node.tag))
        seen.add(node.tag)

    return {}


HassSafeConstructor.add_constructor("!include", _include_yaml)
HassSafeConstructor.add_constructor("!env_var", _stub_tag)
HassSafeConstructor.add_constructor("!secret", _secret_yaml)
HassSafeConstructor.add_constructor("!include_dir_list", _stub_tag)
HassSafeConstructor.add_constructor("!include_dir_merge_list", _stub_tag)
HassSafeConstructor.add_constructor("!include_dir_named", _stub_tag)
HassSafeConstructor.add_constructor("!include_dir_merge_named", _stub_tag)


def load_hass_config(dir_path: Path):
    """Load the HASS config."""
    return load_yaml(dir_path / "configuration.yaml")


def load_yaml(file_path: Path):
    """Load a YAML file."""
    yaml = YAML(typ="safe")
    # Compat with HASS
    yaml.allow_duplicate_keys = True
    # Stub HASS constructors
    HassSafeConstructor.name = str(file_path.absolute())
    yaml.Constructor = HassSafeConstructor

    with file_path.open(encoding="utf-8") as conf_file:
        # If configuration file is empty YAML returns None
        # We convert that to an empty dict
        return yaml.load(conf_file) or {}
