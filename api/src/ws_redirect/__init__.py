import json
from typing import Any, Callable, Coroutine, Optional

import websockets

from src.env import HASSIO_TOKEN, HASSIO_WS
from src.logger import logger

OnMessage = Callable[[str], Coroutine]


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
        self._client: Optional[Any] = None
        self._close: bool = False

    @property
    def is_closed(self):
        return self._close

    async def send(self, msg: str):
        if self._client:
            return await self._client.send(msg)

    async def start(self):
        async with websockets.connect(self._host) as websocket:
            self._client = websocket
            await websocket.send(json.dumps({"type": "auth", "access_token": self._token}))
            while not self.is_closed:
                msg = await websocket.recv()
                logger.debug(f"WS:MSG: {msg}")
                await self.process_message(msg)

    async def process_message(self, msg: str):
        await self._on_message(msg)

    def close(self):
        self._close = True

    def __del__(self):
        self.close()
