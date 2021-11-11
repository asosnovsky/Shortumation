from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src.env import ROOT_FOLDER
from .routes import ping, search, automations

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
app.include_router(automations.router, prefix="/automations")
