import asyncio
import json
from typing import Callable, Coroutine, Optional

from websockets.client import WebSocketClientProtocol, connect
from websockets.exceptions import ConnectionClosedOK

from src.env import HASSIO_TOKEN, HASSIO_WS
from src.logger import get_logger

OnMessage = Callable[[str], Coroutine]
logger = get_logger(__name__)


class WSRedirector:
    def __init__(
        self,
        on_message: OnMessage,
        token: str = HASSIO_TOKEN,
        host: str = HASSIO_WS,
    ) -> None:
        self._host = host
        self._token = token
        self._on_message = on_message
        self._client: Optional[WebSocketClientProtocol] = None
        self._close: bool = False

    @property
    def is_closed(self):
        return self._close

    async def send(self, msg: str):
        if self._client:
            return await self._client.send(msg)

    async def start(self):
        async with connect(
            self._host,
            max_size=16 * 2**20,
            read_limit=16 * 2**20,
            write_limit=16 * 2**20,
        ) as websocket:
            self._client = websocket
            await websocket.send(json.dumps({"type": "auth", "access_token": self._token}))
            while not self.is_closed:
                try:
                    msg = await websocket.recv()
                    # logger.debug(f"HA MSG :--> {msg} {self.is_closed}")
                    await self.process_message(msg)
                except ConnectionClosedOK:
                    pass
            logger.info("Closing socket...")
            await websocket.close()
        logger.info("Closed socket")

    async def process_message(self, msg: str):
        await self._on_message(msg)

    async def close(self):
        self._close = True
        await self._client.close()

    def __del__(self):
        asyncio.create_task(self.close())
