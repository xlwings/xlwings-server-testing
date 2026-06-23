from fastapi import APIRouter, Request

from xlwings_server.config import settings
from xlwings_server.templates import TemplateResponse

router = APIRouter()


@router.get("/custom-dialog")
async def custom_dialog(request: Request):
    """Serves the page that is loaded into the Office.js dialog window.

    This is the same mechanism that book.app.alert() uses under the hood, but
    fully under our control: our own route, our own template, our own size and
    message protocol. No auth logic yet -- just a plain custom dialog.
    """
    return TemplateResponse(
        request=request,
        name="custom_dialog.html",
        context={"settings": settings},
    )
