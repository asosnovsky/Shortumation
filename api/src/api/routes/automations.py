from fastapi import APIRouter, HTTPException

from src.api.types import ListData, ListParams, UpdateTags
from src.automations.errors import FailedDeletion
from src.automations.manager import AutomationManager
from src.automations.types import ExtenededAutomation


def make_automation_router(automations: AutomationManager) -> APIRouter:
    router = APIRouter()

    @router.post("/list")
    def list_autos(body: ListParams) -> ListData[ExtenededAutomation]:
        automations.reload()
        return ListData(
            params=body,
            totalItems=automations.count(),
            data=automations.list(
                offset=body.offset,
                limit=body.limit,
            ),
        )

    @router.post("/item")
    def upsert_auto(body: ExtenededAutomation):
        automations.upsert(body)

    @router.post("/item/tags")
    def update_tags(body: UpdateTags):
        automations.update_tags(body.automation_id, body.tags)

    @router.delete("/item")
    def delete_auto(body: ExtenededAutomation):
        try:
            automations.delete(body)
        except FailedDeletion as err:
            return HTTPException(
                status_code=400,
                detail=err.args,
            )

    return router
