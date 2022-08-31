from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from src.env import API_PREFIX, ORIGIN, ROOT_FOLDER
from src.hass_config.loader import HassConfig

from .routes import automations, details, ping, socket


def make_app(hass_config: HassConfig) -> FastAPI:
    app = FastAPI()
    has_web_folder = (ROOT_FOLDER / "web").exists()
    if has_web_folder:
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
        automations.make_automation_router(hass_config), prefix=f"{API_PREFIX}/automations"
    )
    app.include_router(details.make_details_router(hass_config), prefix=f"{API_PREFIX}/details")
    app.include_router(socket.router, prefix=f"{API_PREFIX}/socket")

    @app.get("/")
    def get_index():
        if has_web_folder:
            return RedirectResponse("/web")
        return RedirectResponse("/details")

    return app
