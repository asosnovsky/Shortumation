from pathlib import Path
from typing import Iterator, TypeVar


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


T = TypeVar("T")


def batch(it: Iterator[T], batch_size: int) -> Iterator[list[T]]:
    b = []
    for n in it:
        b.append(n)
        if len(b) >= batch_size:
            yield b
    if len(b) > 0:
        yield b
