from tempfile import mkdtemp
from pathlib import Path
from typing import Optional

THIS_FOLDER = Path(__file__).parent
SAMPLE_HA_PATH = THIS_FOLDER / "samples"
SAMPLE_DB_PATH = SAMPLE_HA_PATH / "home-assistant_v2.db"


def create_dummy_auto_folder(
    auto: dict,
    secrets: Optional[dict] = None,
    other_config: Optional[dict] = None,
    include_auto_in_configuration: bool = False,
) -> Path:
    root_folder = Path(mkdtemp())
    configuration_yaml = {**other_config} if other_config is not None else {}
    if include_auto_in_configuration:
        configuration_yaml["automation"] = auto
    else:
        configuration_yaml["automation"] = "!include automations.yaml"
        # (root_folder / 'automations.yaml').write_text(yaml)
