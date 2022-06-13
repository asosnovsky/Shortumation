import os
import yaml

from pathlib import Path

print(Path().absolute())

CONFIG_YAML = Path("config.yaml").absolute()
CHANGELOG_MD = Path("CHANGELOG.md").absolute()

print(CONFIG_YAML)
print(CHANGELOG_MD)

version = os.environ["VERSION"]
version_name = os.environ["NAME"]
change = os.environ["CHANGELOG"].splitlines()

config = yaml.load(CONFIG_YAML.read_text(), yaml.Loader)
changelog = CHANGELOG_MD.read_text().splitlines()

with CHANGELOG_MD.open("w") as fp:
    for i, log in enumerate(changelog):
        if i == 2:
            fp.write(f"## [{version}] - {version_name}\n\n")
            for clog in change:
                fp.write(f"- {clog.strip()}\n")
        fp.write(log.strip() + "\n")

CONFIG_YAML.write_text(yaml.dump(config))
