import argparse
from pathlib import Path
from typing import Dict, List

import yaml


def convert_tags(automations: List[dict], tags: Dict[int, dict]) -> Dict[str, dict]:
    converted = {}
    for tagsIdx, tagValues in tags.items():
        if tagsIdx < len(automations):
            auto = automations[tagsIdx]
            converted[auto["id"]] = tagValues
        else:
            print(f"WARN: tags index = {tagsIdx} is out of bounds")
    return converted


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", dest="input", required=True, type=Path)
    args = parser.parse_args()
    auto_path: Path = args.input / "automations.yaml"
    tags_path: Path = args.input / ".shortumations" / "tags.yaml"
    automations = yaml.safe_load(auto_path.read_text())
    tags = yaml.safe_load(tags_path.read_text())
    converted = convert_tags(automations, tags)
    tags_path.write_text(yaml.dump(converted))
