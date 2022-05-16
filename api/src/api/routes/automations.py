from fastapi import APIRouter, HTTPException

from src.api.types import (
    DeleteAutoRequest,
    ListData,
    ListParams,
    UpdateAutoRequest,
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

    @router.post("")
    def upsert_auto(body: UpdateAutoRequest):
        automations.update(body.index, body.data)

    @router.delete("")
    def delete_auto(body: DeleteAutoRequest):
        try:
            automations.delete(body.index)
        except FailedDeletion as err:
            return HTTPException(
                status_code=400,
                detail=err.args,
            )

    return router
