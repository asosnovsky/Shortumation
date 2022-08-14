from pathlib import Path
from typing import Any, Iterator, Union
from ..hass_config.loader import HassConfig

from src.json_serializer import normalize_obj
from src.logger import get_logger
from src.yaml_serializer import load_yaml
from src.yaml_serializer.types import IncludedYaml, IncludedYamlDir
from src.utils import extract_files

from .errors import InvalidAutomationFile
from .types import ExtenededAutomationData

logger = get_logger(__file__)


def extract_automation_paths(
    hass_config: HassConfig,
) -> Iterator[Path]:
    found = False
    for key, value in hass_config.configurations.items():
        if str(key).startswith("automation"):
            logger.info(f"Loading automations from '{key}'")
            found = True
            if isinstance(value, dict):
                raise NotImplementedError(
                    "No support for automations baked into configuration.yaml! Please extract these into a seperate file"
                )
            elif isinstance(value, IncludedYaml):
                yield hass_config.root_path / value.path_str
            elif isinstance(value, IncludedYamlDir):
                yield hass_config.root_path / value.name
            else:
                logger.warning(f"found an invalid type in {key}!")
    if not found:
        yield hass_config.root_path / "automations.yaml"


def load_automation_path(automation_path: Path) -> Iterator[ExtenededAutomationData]:
    """

    Args:
        automation_path (Path)

    Returns:
        Iterator[ExtenededAutomationData]

    """
    if not automation_path.exists():
        logger.warning(f"the file {automation_path} does not exists")
        return
    if automation_path.is_dir():
        for f in extract_files(automation_path):
            yield from load_automation_path(f)
    else:
        try:
            with automation_path.open("r") as fp:
                automations = load_yaml(fp)
        except Exception as err:
            raise InvalidAutomationFile(
                when="loading yaml",
                automation_path=automation_path,
                error=err,
            ) from err

        if isinstance(automations, dict):
            try:
                yield ExtenededAutomationData(
                    **clean_automation(automations),
                    source_file=str(automation_path),
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
                    yield ExtenededAutomationData(
                        **clean_automation(automation),
                        source_file=str(automation_path),
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
