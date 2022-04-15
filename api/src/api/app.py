from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from src.automations.manager import AutomationManager
from src.env import ROOT_FOLDER, ORIGIN
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
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ORIGIN,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(ping.router, prefix="/ping")
    app.include_router(automations.make_automation_router(automation_mgr), prefix="/automations")

    return app
