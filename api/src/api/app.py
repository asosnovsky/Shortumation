from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src.automations.manager import AutomationManager
from src.env import ROOT_FOLDER
from .routes import ping, automations


def make_app(automation_mgr: AutomationManager) -> FastAPI:
    app = FastAPI()
    if (ROOT_FOLDER / "web").exists():
        app.mount(
            "/web",
            StaticFiles(
                directory=ROOT_FOLDER / "web",
                html=True,
            ),
            name="web",
        )
    else:
        print("WARN: could not find web folder")
    app.include_router(ping.router, prefix="/ping")
    app.include_router(automations.make_automation_router(automation_mgr), prefix="/automations")

    return app
