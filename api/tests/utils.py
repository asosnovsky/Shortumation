from tempfile import mkdtemp
from pathlib import Path
from typing import List, Optional
from src.config.AutomationLoader import AutomationData

from src.yaml_serializer import dump_yaml
from src.yaml_serializer.types import IncludedYaml

THIS_FOLDER = Path(__file__).parent
SAMPLE_HA_PATH = THIS_FOLDER / "samples"
SAMPLE_DB_PATH = SAMPLE_HA_PATH / "home-assistant_v2.db"


def create_dummy_config_folder(
    auto: List[AutomationData],
    secrets: Optional[dict] = None,
    other_config: Optional[dict] = None,
    include_auto_in_configuration: bool = False,
) -> Path:
    """Creates a dummy /config structure for testing

    Args:
        auto (List[AutomationData]): automations
        secrets (Optional[dict], optional): dictionary of secrets
        other_config (Optional[dict], optional): some config stuff to place into configuration.yaml. Defaults to None.
        include_auto_in_configuration (bool, optional): whether to !include automation as a separete file or in the configuration yaml. Defaults to False.

    Returns:
        Path: [description]
    """
    root_folder = Path(mkdtemp())
    auto_prims = [a.to_primitive() for a in auto]
    configuration_yaml = {**other_config} if other_config is not None else {}
    if include_auto_in_configuration:
        configuration_yaml["automation"] = auto_prims
    else:
        configuration_yaml["automation"] = IncludedYaml(
            "automations.yaml", root_folder / "automations.yaml", auto
        )
        (root_folder / "automations.yaml").write_text(dump_yaml(auto_prims))
    if secrets is not None:
        (root_folder / "secrets.yaml").write_text(dump_yaml(secrets))
    (root_folder / "configuration.yaml").write_text(dump_yaml(configuration_yaml))
    return root_folder
