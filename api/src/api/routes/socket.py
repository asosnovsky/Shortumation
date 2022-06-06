import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from src.logger import get_logger
from src.ws_redirect import WSRedirector

router = APIRouter()
logger = get_logger(__name__)


@router.websocket("/api/websocket")
async def websocket_endpoint(websocket: WebSocket):
    async def on_message(msg: str):
        await websocket.send_text(msg)

    conn = WSRedirector(
        on_message=on_message,
    )

    async def wait_for_data():
        while True:
            try:
                msg_str = await websocket.receive_text()
                msg_d = json.loads(msg_str)
                if msg_d.get("type") != "auth":
                    await conn.send(msg_str)
            except WebSocketDisconnect:
                logger.info("Websocket closed.")
                await conn.close()
                break

    await websocket.accept()

    await asyncio.gather(
        conn.start(),
        wait_for_data(),
    )
