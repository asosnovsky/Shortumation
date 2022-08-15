import json
import sqlite3
import base64

from contextlib import contextmanager
from pathlib import Path
from typing import Iterable, Iterator, List, Optional

from src.logger import get_logger
from .types import ExtenededAutomation
from .errors import DBDataError, DBError, DBNoAutomationFound

logger = get_logger(__file__)

automations_tbl = "autos"


def encode_auto(auto: ExtenededAutomation) -> str:
    return base64.b64encode(
        json.dumps(auto.to_primitive(include_tags=True)).encode("utf-8")
    ).decode("utf-8")


def decode_auto(
    auto_str: str, source_file: str, source_file_type: str, configuration_key: str
) -> ExtenededAutomation:
    return ExtenededAutomation(
        source_file=source_file,
        source_file_type=source_file_type,
        configuration_key=configuration_key,
        **json.loads(base64.b64decode(auto_str.encode("utf-8")).decode("utf-8")),
    )


class AutomationDBConnection:
    def __init__(self, db_file: Path) -> None:
        self.db_file = db_file

    def reset(self):
        self.db_file.unlink(missing_ok=True)
        self.create_db()

    @contextmanager
    def get_cur(self) -> Iterator[sqlite3.Cursor]:
        conn = sqlite3.connect(self.db_file)
        cur = conn.cursor()
        try:
            yield cur
            conn.commit()
        except sqlite3.IntegrityError as err:
            raise DBDataError(*err.args) from err
        except sqlite3.DatabaseError as err:
            raise DBError(*err.args) from err
        finally:
            cur.close()
            conn.close()

    def create_db(self):
        with self.get_cur() as cur:
            cur.execute(
                f"""
            CREATE TABLE IF NOT EXISTS {automations_tbl} (
                id TEXT NOT NULL PRIMARY KEY,
                alias TEXT,
                description TEXT,
                mode TEXT NOT NULL,
                source_file TEXT NOT NULL,
                source_file_type TEXT NOT NULL,
                configuration_key TEXT NOT NULL,
                rest BLOB NOT NULL
            );
            """
            )

    def upsert_automations(self, automations: List[ExtenededAutomation]):
        with self.get_cur() as cur:
            for automation in automations:
                cur.execute(
                    f"""
                    INSERT INTO {automations_tbl} VALUES (
                        "{automation.id}",
                        "{automation.alias}",
                        "{automation.description}",
                        "{automation.mode}",
                        "{automation.source_file.absolute()}",
                        "{automation.source_file_type}",
                        "{automation.configuration_key}",
                        "{encode_auto(automation)}"
                    )
                    ON CONFLICT DO UPDATE SET 
                        alias = "{automation.alias}",
                        description = "{automation.description}",
                        mode = "{automation.mode}",
                        source_file = "{automation.source_file.absolute()}",
                        source_file_type = "{automation.source_file_type}",
                        configuration_key = "{automation.configuration_key}",
                        rest = "{encode_auto(automation)}"
                    
                    """,
                )

    def delete_automations(self, automations: List[ExtenededAutomation]):
        with self.get_cur() as cur:
            cur.executemany(
                f"DELETE FROM {automations_tbl} WHERE id = ?", [(a.id,) for a in automations]
            )

    def delete_automations_in_source_file(self, source_file: Path):
        with self.get_cur() as cur:
            cur.execute(
                f"DELETE FROM {automations_tbl} WHERE source_file = ?",
                (str(source_file.absolute()),),
            )

    def get_automation(self, automation_id: str) -> ExtenededAutomation:
        with self.get_cur() as cur:
            cur.execute(
                f'SELECT rest, source_file, source_file_type, configuration_key FROM {automations_tbl} WHERE id = "{automation_id}"'
            )
            objs = cur.fetchone()
            if objs is None:
                raise DBNoAutomationFound(automation_id)
            [rest, source_file, source_file_type, configuration_key] = objs
            return decode_auto(rest, source_file, source_file_type, configuration_key)

    def list_automations(self, offset: int, limit: int) -> Iterable[ExtenededAutomation]:
        with self.get_cur() as cur:
            for [rest, source_file, source_file_type, configuration_key] in cur.execute(
                f"SELECT rest, source_file, source_file_type, configuration_key FROM {automations_tbl} LIMIT {limit} OFFSET {offset}"
            ):
                yield decode_auto(rest, source_file, source_file_type, configuration_key)

    def count_automations(self) -> int:
        with self.get_cur() as cur:
            return cur.execute(f"SELECT count(id) FROM {automations_tbl}").fetchone()[0]
