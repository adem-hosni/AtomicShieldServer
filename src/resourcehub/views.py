import logging
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from safecore import safe_core


logger = logging.getLogger(__name__)


@csrf_exempt
def download_mta_engine(request: HttpRequest) -> HttpResponse:
    with open(
        f"{settings.BIN_DIR}\\resources\\engines\\multitheftauto.dll",
        "rb",
    ) as file:
        engine_buffer = file.read()

    logger.info(f"{request.get_host()} downloaded MTA:SA engine")

    return HttpResponse(engine_buffer, content_type="application/octet-stream")


@csrf_exempt
def download_fivem_engine(request: HttpRequest) -> HttpResponse:
    with open(
        f"{settings.BIN_DIR}/resources/engines/fivem.dll",
        "rb",
    ) as file:
        engine_buffer = file.read()

    logger.info(f"{request.get_host()} downloaded FiveM's engine")

    return HttpResponse(engine_buffer, content_type="application/octet-stream")
