from fastapi import APIRouter, HTTPException

from src.api.types import ListData, ListParams, UpdateTags
from src.automations.errors import FailedDeletion
from src.automations.manager import AutomationManager
from src.automations.types import Automation, ExtenededAutomation
from src.errors import ErrorSet
from src.hass_config.loader import HassConfig


def make_automation_router(hass_config: HassConfig) -> APIRouter:
    router = APIRouter()

    @router.post("/list", response_model_exclude_unset=True, response_model_exclude_none=True)
    def list_autos(body: ListParams) -> ListData[ExtenededAutomation]:
        automations = AutomationManager(hass_config)
        try:
            automations.reload()
            return ListData(
                params=body,
                totalItems=automations.count(),
                data=automations.list(
                    offset=body.offset,
                    limit=body.limit,
                ),
            )
        except ErrorSet as err:
            raise HTTPException(status_code=400, detail=err.gen_message())

    @router.post("/item")
    def insert_auto(body: Automation):
        if body.id is None:
            raise HTTPException(status_code=400, detail={"msg": "must contain an id"})
        automations = AutomationManager(hass_config)
        automations.create(body)

    @router.put("/item")
    def update_auto(body: ExtenededAutomation):
        if body.id is None:
            raise HTTPException(status_code=400, detail={"msg": "must contain an id"})
        automations = AutomationManager(hass_config)
        automations.update(body)

    @router.post("/item/tags")
    def update_tags(body: UpdateTags):
        automations = AutomationManager(hass_config)
        automations.update_tags(body.automation_id, body.tags)

    @router.delete("/item")
    def delete_auto(body: ExtenededAutomation):
        automations = AutomationManager(hass_config)
        try:
            automations.delete(body)
        except FailedDeletion as err:
            return HTTPException(
                status_code=400,
                detail=err.args,
            )

    return router
