from itertools import chain
from pathlib import Path
from typing import Any, Iterator, Tuple, Union

from src.json_serializer import normalize_obj
from src.logger import get_logger
from src.utils import extract_files
from src.yaml_serializer import (
    IncludedYaml,
    IncludedYamlDir,
    IncludedYamlDirList,
    IncludedYamlDirMergedNamed,
    IncludedYamlDirNamed,
    dump_yaml,
    load_yaml,
)

from ..hass_config.loader import HassConfig
from .errors import InvalidAutomationFile, InvalidPackage
from .tags import TagManager
from .types import (
    AutomationExtractedIter,
    ConfigurationKey,
    ExtenededAutomation,
    IncludedAutoamtion,
    InlineAutomation,
)

logger = get_logger(__file__)

AUTOMATION_CONFIGURATION_KEY = "automation shortumation"


def load_and_iter_automations(
    hass_config: HassConfig, tag_manager: TagManager
) -> Iterator[ExtenededAutomation]:
    for ref in extract_automation_refs(hass_config):
        try:
            if isinstance(ref, IncludedAutoamtion):
                yield from load_automation_path(
                    hass_config.root_path,
                    hass_config.root_path / ref.ref.path,
                    ref.configuration_key,
                    tag_manager,
                )
            elif isinstance(ref, InlineAutomation):
                yield from load_automation_inline_ref(hass_config.root_path, tag_manager, ref)
            else:
                raise logger.error(
                    AssertionError(f"ref has an invalid type of {type(ref)} = {ref}")
                )
        except InvalidAutomationFile as e:
            logger.error(e)


def extract_automation_refs(
    hass_config: HassConfig,
) -> AutomationExtractedIter:
    found = False

    for ref in extract_automation_root_refs(hass_config):
        found = True
        yield ref

    try:
        for ref in extract_automation_package_refs(hass_config):
            found = True
            yield ref
    except InvalidPackage as err:
        logger.fatal(err)

    if not found:
        yield IncludedAutoamtion([""], IncludedYaml(hass_config.root_path / "automations.yaml"))


def extract_automation_root_refs(
    hass_config: HassConfig,
) -> AutomationExtractedIter:
    for key, value in extract_automation_keys(hass_config):
        logger.info(f"Loading automations from '{key}'")
        if isinstance(value, IncludedYamlDir):  # type: ignore
            yield IncludedAutoamtion([key], value)  # type: ignore
        elif isinstance(value, list):
            yield InlineAutomation(
                configuration_key=[key],
                automations=value,
                source_file=hass_config.get_configuration_path(),
            )
        else:
            logger.error(f"found an invalid type in {key}!")


def extract_automation_package_refs(hass_config: HassConfig) -> AutomationExtractedIter:
    if packages_config := hass_config.homeassistant.get("packages", None):
        if isinstance(packages_config, IncludedYaml):
            packages = packages_config.to_normalized_json()
            yield from extract_automation_inline_package_refs(
                packages_config.path,
                ["homeassistant", "packages"],
                packages,
            )
        elif isinstance(packages_config, IncludedYamlDirList):
            raise InvalidPackage("cannot configure packages with 'included_dir_list' directive")
        elif isinstance(packages_config, IncludedYamlDirNamed):
            packages = packages_config.to_normalized_json(use_path_as_keys=True)
            for package_path, package in packages.items():
                yield from extract_automation_inline_package_refs(
                    package_path,
                    [],
                    {package_path.stem: package},
                    ignore_package_name=True,
                )
        elif isinstance(packages_config, IncludedYamlDirMergedNamed):
            for (
                pacakge_set_path,
                package_set,
            ) in iter(packages_config):
                if not isinstance(package_set, dict):
                    raise InvalidPackage(
                        f"expected {pacakge_set_path} to be a dictionary but got {type(package_set)}"
                    )
                yield from extract_automation_inline_package_refs(
                    source_file=pacakge_set_path,
                    prefix_config_keys=[],
                    packages_config=package_set,
                )
        elif isinstance(packages_config, dict):
            yield from extract_automation_inline_package_refs(
                hass_config.root_path,
                ["homeassistant", "packages"],
                packages_config,
            )
        else:
            raise InvalidPackage("configurations.homeassistant.packages must be a dictionary!")


def extract_automation_inline_package_refs(
    source_file: Path,
    prefix_config_keys: ConfigurationKey,
    packages_config: dict,
    ignore_package_name=False,
) -> AutomationExtractedIter:
    for package_name, package_data in packages_config.items():
        try:
            if isinstance(package_data, IncludedYaml):
                package_mapping = package_data.to_normalized_json()
                yield from extract_automation_from_package(
                    package_data=package_mapping,
                    package_name=package_name,
                    source_file=source_file,
                    prefix_config_keys=prefix_config_keys,
                    ignore_package_name=ignore_package_name,
                )
            elif isinstance(package_data, IncludedYamlDirList):
                raise NotImplementedError(package_data)
            elif isinstance(package_data, IncludedYamlDirNamed):
                for package_key_path in package_data.to_normalized_json(True).keys():
                    if package_key_path.stem == "automation":
                        yield IncludedAutoamtion(
                            configuration_key=[package_name], ref=IncludedYaml(package_key_path)
                        )
            elif isinstance(package_data, IncludedYamlDirMergedNamed):
                for data_path, data_set in iter(package_data):
                    yield from extract_automation_from_package(
                        package_name=package_name,
                        package_data=data_set,
                        source_file=data_path,
                        prefix_config_keys=[],
                        ignore_package_name=True,
                    )
            elif isinstance(package_data, dict):
                yield from extract_automation_from_package(
                    package_data=package_data,
                    package_name=package_name,
                    source_file=source_file,
                    prefix_config_keys=prefix_config_keys,
                    ignore_package_name=ignore_package_name,
                )
            else:
                raise InvalidPackage(
                    f"configurations.homeassistant.packages[{package_name}] must be a dictionary!"
                )
        except Exception as err:
            logger.error(err)


def extract_automation_from_package(
    package_name: str,
    package_data: dict,
    source_file: Path,
    prefix_config_keys: ConfigurationKey,
    ignore_package_name=False,
) -> AutomationExtractedIter:
    if automations := package_data.get("automation", None):
        logger.info(f"Loading automations from package '{package_name}'")
        suffix_keys = [package_name] if not ignore_package_name else []
        if isinstance(automations, IncludedYamlDir):  # type: ignore
            yield IncludedAutoamtion(suffix_keys, automations)
        elif isinstance(automations, list):
            yield InlineAutomation(
                source_file=source_file,
                configuration_key=[*prefix_config_keys, *suffix_keys, "automation"],
                automations=automations,
            )
        else:
            logger.warning(
                f"found an invalid type in {package_name}! automations must be included or inlined as a list"
            )


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
) -> Iterator[Tuple[str, IncludedYamlDir | list]]:
    for key, value in hass_config.configurations.items():
        if str(key).startswith("automation"):
            if isinstance(value, list):
                yield key, value
            elif isinstance(value, IncludedYamlDir):  # type: ignore
                yield key, value
            else:
                logger.warning(f"found an invalid type in {key}!")


def load_automation_inline_ref(
    root_path: Path, tag_manager: TagManager, inline_automation: InlineAutomation
) -> Iterator[ExtenededAutomation]:
    for auto in inline_automation.automations:
        try:
            cleaned_automation = clean_automation(auto)
            automation_id = cleaned_automation.get("id", None)
            yield ExtenededAutomation(
                **cleaned_automation,
                tags={} if automation_id is None else tag_manager.get(automation_id, {}),
                configuration_key=inline_automation.configuration_key,
                source_file=str(inline_automation.source_file.resolve().relative_to(root_path)),
                source_file_type="inline",
            )
        except Exception as err:
            raise InvalidAutomationFile(
                when="reading file contents",
                automation_path=inline_automation.source_file,
                error=err,
            ) from err


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
                cleaned_automation = clean_automation(automations)
                automation_id = cleaned_automation.get("id", None)
                yield ExtenededAutomation(
                    **cleaned_automation,
                    tags={} if automation_id is None else tag_manager.get(automation_id, {}),
                    configuration_key=configuration_key,
                    source_file=str(automation_path.resolve().relative_to(root_path)),
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
                    cleaned_automation = clean_automation(automation)
                    automation_id = cleaned_automation.get("id", None)
                    yield ExtenededAutomation(
                        **cleaned_automation,
                        tags={} if automation_id is None else tag_manager.get(automation_id, {}),
                        configuration_key=configuration_key,
                        source_file=str(automation_path.resolve().relative_to(root_path)),
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
        "alias": auto_raw.get("alias", "") or "",
        "description": auto_raw.get("description", "") or "",
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
