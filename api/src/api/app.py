from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.automations.manager import AutomationManager
from src.env import API_PREFIX, ORIGIN, ROOT_FOLDER

from .routes import automations, details, ping, socket


def make_app(automation_mgr: AutomationManager) -> FastAPI:
    app = FastAPI()
    if (ROOT_FOLDER / "web").exists():
        app.mount(
            f"{API_PREFIX}/web",
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
    app.include_router(
        automations.make_automation_router(automation_mgr), prefix=f"{API_PREFIX}/automations"
    )
    app.include_router(
        details.make_details_router(automation_mgr.hass_config), prefix=f"{API_PREFIX}/details"
    )
    app.include_router(socket.router, prefix=f"{API_PREFIX}/socket")
    return app
