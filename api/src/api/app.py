from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from ..env import ROOT_FOLDER
from . import ping, search

app = FastAPI()
app.mount(
    "/web",
    StaticFiles(
        directory=ROOT_FOLDER / "web",
        html=True,
    ),
    name="web",
)
app.include_router(ping.router, prefix="/ping")
app.include_router(search.router, prefix="/search")
