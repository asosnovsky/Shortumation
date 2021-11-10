from sqlalchemy import create_engine, text
from urllib.parse import urlparse


class HassDatabase:
    def __init__(self, db_url: str) -> None:
        self.url = urlparse(db_url)
        self.entities = None
        try:
            self.engine = create_engine(db_url)
        except Exception as exc:
            if isinstance(exc, ImportError):
                raise RuntimeError(
                    "The right dependency to connect to your database is "
                    "missing. Please make sure that it is installed."
                ) from exc

            raise

    @property
    def db_type(self):
        return self.url.scheme.split("+")[0]
