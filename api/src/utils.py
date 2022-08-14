import asyncio
from datetime import datetime, timedelta
from functools import wraps
from pathlib import Path
from typing import Any, Callable, Coroutine, Iterator, Optional, Tuple, TypeVar

FnOutT = TypeVar("FnOutT")


class throttle(object):
    """source: https://gist.github.com/ChrisTM/5834503
    Decorator that prevents a function from being called more than once every
    time period.
    To create a function that cannot be called more than once a minute:
        @throttle(minutes=1)
        def my_fun():
            pass
    """

    def __init__(self, seconds=0, minutes=0, hours=0):
        self.throttle_period = timedelta(seconds=seconds, minutes=minutes, hours=hours)
        self.time_of_last_call = datetime.min
        self.current_id: Optional[datetime] = None

    def __call__(self, fn: Callable[..., FnOutT]) -> Callable[..., Coroutine[Any, Any, FnOutT]]:
        @wraps(fn)
        async def wrapper(*args, **kwargs):
            self.current_id = now = datetime.now()
            time_since_last_call = now - self.time_of_last_call

            if time_since_last_call > self.throttle_period:
                self.time_of_last_call = now
                return fn(*args, **kwargs)
            else:
                asyncio.sleep(self.throttle_period.total_seconds())
                if self.current_id == now:
                    return fn(*args, **kwargs)

        return wrapper


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
