from itertools import chain
from pathlib import Path
from typing import Any, Iterator, Tuple, Union

from src.json_serializer import normalize_obj
from src.logger import get_logger
from src.utils import extract_files
from src.yaml_serializer import (
    IncludedYaml,
    IncludedYamlDir,
    dump_yaml,
    load_yaml,
)

from ..hass_config.loader import HassConfig
from .errors import InvalidAutomationFile
from .tags import TagManager
from .types import AutomationPathIter, ConfigurationKey, ExtenededAutomation

logger = get_logger(__file__)

AUTOMATION_CONFIGURATION_KEY = "automation shortumation"


def load_and_iter_automations(
    hass_config: HassConfig, tag_manager: TagManager
) -> Iterator[ExtenededAutomation]:
    for config_key, p in extract_automation_paths(hass_config):
        try:
            yield from load_automation_path(
                hass_config.root_path,
                hass_config.root_path / p,
                config_key,
                tag_manager,
            )
        except InvalidAutomationFile as e:
            logger.error(e)


def extract_automation_paths(
    hass_config: HassConfig,
) -> AutomationPathIter:
    found = False

    for config_key, automation_path in chain(
        extract_automation_root_paths(hass_config), extract_package_automation_paths(hass_config)
    ):
        found = True
        yield config_key, automation_path

    if not found:
        yield [""], "automations.yaml"


def extract_automation_root_paths(
    hass_config: HassConfig,
) -> AutomationPathIter:
    for key, value in extract_automation_keys(hass_config):
        logger.info(f"Loading automations from '{key}'")
        if isinstance(value, IncludedYamlDir):  # type: ignore
            yield [key], str(value.path.relative_to(hass_config.root_path))
        elif isinstance(value, list):
            logger.warning(f"Failed to load from '{key}' as no support for inline automations yet.")
        else:
            logger.warning(f"found an invalid type in {key}!")


def extract_package_automation_paths(hass_config: HassConfig) -> AutomationPathIter:
    for package_name, package_data in hass_config.pacakges.items():
        if not isinstance(package_data, dict):
            logger.warning(f"The package {package_name} is incorrectly configured!")
        else:
            if automations := package_data.get("automation", None):
                logger.info(f"Loading automations from package '{package_name}'")
                if isinstance(automations, IncludedYamlDir):  # type: ignore
                    yield [package_name], str(automations.path.relative_to(hass_config.root_path))
                elif isinstance(automations, list):
                    logger.warning(
                        f"Failed to load from '{package_name}' as no support for inline automations yet."
                    )
                else:
                    logger.warning(f"found an invalid type in {package_name}!")


def get_base_automation_key(hass_config: HassConfig) -> Tuple[ConfigurationKey, str]:
    found_any = False
    for key, value in extract_automation_keys(hass_config):
        found_any = True
        if isinstance(value, IncludedYaml):
            return [key], str(value.path.relative_to(hass_config.root_path))
    configurations = hass_config.configurations
    if found_any:
        out_path = hass_config.get_backup_automation_file_path()
    else:
        if not (out_path := hass_config.get_default_automation_path()):  # type: ignore
            raise AssertionError("Failed to find automation files...")
    out_file = str(out_path.relative_to(hass_config.root_path))
    configurations[AUTOMATION_CONFIGURATION_KEY] = IncludedYaml(out_path)
    out_path.touch(exist_ok=True)
    with hass_config.get_configuration_path().open("w") as fp:
        fp.write(dump_yaml(configurations, root_path=hass_config.root_path))
    return [AUTOMATION_CONFIGURATION_KEY], out_file


def extract_automation_keys(
    hass_config: HassConfig,
) -> Iterator[Tuple[str, IncludedYamlDir]]:
    for key, value in hass_config.configurations.items():
        if str(key).startswith("automation"):
            if isinstance(value, dict) or isinstance(value, list):
                raise NotImplementedError(
                    "No support for automations baked into configuration.yaml! Please extract these into a seperate file"
                )
            elif isinstance(value, IncludedYamlDir):  # type: ignore
                yield key, value
            else:
                logger.warning(f"found an invalid type in {key}!")


def load_automation_path(
    root_path: Path,
    automation_path: Path,
    configuration_key: ConfigurationKey,
    tag_manager: TagManager,
) -> Iterator[ExtenededAutomation]:
    """

    Args:
        automation_path (Path)
        configuration_key (list[str])

    Returns:
        Iterator[ExtenededAutomation]

    """
    if not automation_path.exists():
        logger.warning(f"the file {automation_path} does not exists")
        return
    if automation_path.is_dir():
        for f in extract_files(automation_path):
            yield from load_automation_path(root_path, f, configuration_key, tag_manager)
    else:
        try:
            with automation_path.open("r") as fp:
                automations = load_yaml(fp, root_path=root_path)
        except Exception as err:
            raise InvalidAutomationFile(
                when="loading yaml",
                automation_path=automation_path,
                error=err,
            ) from err

        if isinstance(automations, dict):
            try:
                yield ExtenededAutomation(
                    **clean_automation(automations),
                    tags=tag_manager.get(automations["id"], {}),
                    configuration_key=configuration_key,
                    source_file=str(automation_path.relative_to(root_path)),
                    source_file_type="obj",
                )
            except Exception as err:
                raise InvalidAutomationFile(
                    when="reading file contents",
                    automation_path=automation_path,
                    error=err,
                ) from err
        else:
            if automations is None:
                logger.warning(f"the file {automation_path} is empty")
                return
            for automation in automations:
                try:
                    yield ExtenededAutomation(
                        **clean_automation(automation),
                        tags=tag_manager.get(automation["id"], {}),
                        configuration_key=configuration_key,
                        source_file=str(automation_path.relative_to(root_path)),
                        source_file_type="list",
                    )
                except Exception as err:
                    raise InvalidAutomationFile(
                        when="reading file contents",
                        automation_path=automation_path,
                        error=err,
                        automation=automation,
                    ) from err


def clean_automation(auto_raw: dict):
    return {
        **auto_raw,
        "condition": ifempty_or_null_then_list(load_conditions(auto_raw.get("condition", []))),
        "action": ifempty_or_null_then_list(load_conditions(auto_raw.get("action", []))),
        "trigger": ifempty_or_null_then_list(normalize_obj(auto_raw.get("trigger", []))),
    }


def ifempty_or_null_then_list(obj: Any):
    if not isinstance(obj, list):
        return []
    else:
        return obj


def load_conditions(conditions: Union[dict, list, str]):
    if isinstance(conditions, list):
        return list(map(ensure_condition_dictionary, conditions))
    elif not conditions:
        return []
    else:
        return [ensure_condition_dictionary(conditions)]


def ensure_condition_dictionary(c: Union[str, dict]):
    c = normalize_obj(c)
    if isinstance(c, str):
        return {"condition": "template", "value_template": c}
    elif isinstance(c, dict):
        return c
    raise InvalidAutomationFile(f"Invalid type for condition object {c}")
