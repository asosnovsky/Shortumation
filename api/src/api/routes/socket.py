import asyncio
import json
from fastapi import APIRouter, WebSocket
from src.ws_redirect import WSRedirector

router = APIRouter()


@router.websocket("/api/websocket")
async def websocket_endpoint(websocket: WebSocket):
    async def on_message(msg: str):
        await websocket.send_text(msg)

    conn = WSRedirector(
        on_message=on_message,
    )

    async def wait_for_data():
        while True:
            await conn.send(await websocket.receive_text())

    await websocket.accept()

    await asyncio.gather(
        conn.start(),
        wait_for_data(),
    )
