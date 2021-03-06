from fastapi import APIRouter, HTTPException

from src.api.types import (
    DeleteAutoRequest,
    ListData,
    ListParams,
    UpdateAutoRequest,
    UpdateTags,
)
from src.automations.errors import FailedDeletion
from src.automations.manager import AutomationManager
from src.automations.types import AutomationData


def make_automation_router(automations: AutomationManager) -> APIRouter:
    router = APIRouter()

    @router.post("/list")
    def list_autos(body: ListParams) -> ListData[AutomationData]:
        return ListData(
            params=body,
            totalItems=automations.get_total_items(),
            data=automations.find(
                offset=body.offset,
                limit=body.limit,
            ),
        )

    @router.post("/item")
    def upsert_auto(body: UpdateAutoRequest):
        automations.update(body.index, body.data)

    @router.post("/item/tags")
    def update_tags(body: UpdateTags):
        automations.update_tags(body.automation_id, body.tags)

    @router.delete("/item")
    def delete_auto(body: DeleteAutoRequest):
        try:
            automations.delete(body.index)
        except FailedDeletion as err:
            return HTTPException(
                status_code=400,
                detail=err.args,
            )

    return router
