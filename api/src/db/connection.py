from sqlalchemy import create_engine, text
from urllib.parse import urlparse


class HassDatabase:
    def __init__(self, db_url: str) -> None:
        self.url = urlparse(db_url)
        self.entities = None
        try:
            self.engine = create_engine(db_url)
            self.connection = None
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

    def execute_sql(self, sql: str, **args):
        self.connect()
        resp = self.engine.execute(text(sql), **args)
        self.close()
        return resp.fetchall()

    def connect(self):
        if self.connection is None:
            self.connection = self.engine.connect()

    def close(self):
        if self.connection is not None:
            self.connection.close()
        self.connection = None

    def __del__(self):
        self.close()
