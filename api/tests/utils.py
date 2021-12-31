from tempfile import mkdtemp
from pathlib import Path
from typing import List, Literal, Optional
from src.automations.types import AutomationData

from src.yaml_serializer import dump_yaml
from src.yaml_serializer.types import IncludedYaml

THIS_FOLDER = Path(__file__).parent
SAMPLES_FOLDER = THIS_FOLDER / "samples"
HA_CONFIG_EXAMPLE = SAMPLES_FOLDER / "example_config_folder"


def create_dummy_config_folder(
    auto: List[AutomationData],
    secrets: Optional[dict] = None,
    other_config: Optional[dict] = None,
    automation_in_conifguration_mode: Literal["include", "inline", "none"] = "include",
) -> Path:
    """Creates a dummy /config structure for testing

    Args:
        auto (List[AutomationData]): automations
        secrets (Optional[dict], optional): dictionary of secrets
        other_config (Optional[dict], optional): some config stuff to place into configuration.yaml. Defaults to None.
        automation_in_conifguration_mode (Literal['include', 'inline', 'none'], optional): whether to !include automation as a separete file or in the configuration yaml. Defaults to inline.

    Returns:
        Path: [description]
    """
    root_folder = Path(mkdtemp())
    auto_prims = [a.to_primitive() for a in auto]
    configuration_yaml = {**other_config} if other_config is not None else {}
    if automation_in_conifguration_mode == "inline":
        configuration_yaml["automation"] = auto_prims
    elif automation_in_conifguration_mode == "include":
        configuration_yaml["automation"] = IncludedYaml(
            "automations.yaml",
        )
    if automation_in_conifguration_mode != "inline":
        (root_folder / "automations.yaml").write_text(dump_yaml(auto_prims))
    if secrets is not None:
        (root_folder / "secrets.yaml").write_text(dump_yaml(secrets))
    (root_folder / "configuration.yaml").write_text(dump_yaml(configuration_yaml))
    return root_folder
