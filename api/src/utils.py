from pathlib import Path
from typing import Iterator


def extract_files(p: Path) -> Iterator[Path]:
    """Extracts all files in folder and it's subfolders

    Args:
        p (Path):

    Yields:
        Iterator[Path]
    """
    if not p.exists():
        return
    if p.is_dir():
        for c in p.iterdir():
            yield from extract_files(c)
    else:
        yield p
