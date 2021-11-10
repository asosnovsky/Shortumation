from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from datetime import datetime

from .env import BUILD_VERSION

app = FastAPI()
app.mount("/web", StaticFiles(directory="web"), name="web")


@app.get("/ping")
def read_ping():
    return {
        "version": BUILD_VERSION,
        "current_time": datetime.now(),
    }
