import logging
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from core import atomic_core

logger = logging.getLogger(__name__)


@csrf_exempt
def download_fivem_engine(request: HttpRequest) -> HttpResponse:
    with open(
        f"{settings.BIN_DIR}/resources/engines/fivem.dll",
        "rb",
    ) as file:
        raw_data = file.read()
        engine_buffer = atomic_core.encode(raw_data)

    if isinstance(engine_buffer, str):
        engine_buffer = engine_buffer.encode()  # Ensure it's bytes

    response = HttpResponse(engine_buffer, content_type="application/octet-stream")
    response["Content-Length"] = str(len(engine_buffer))
    response["Connection"] = "close"


    request_ip = request.META.get("HTTP_X_REAL_IP", request.META.get("REMOTE_ADDR"))
    logger.info(f"{request_ip} is downloading FiveM's engine")

    return response

@csrf_exempt
def download_latest_agent(request: HttpRequest) -> HttpResponse:
    request_ip = request.META.get("HTTP_X_REAL_IP", request.META.get("REMOTE_ADDR"))
    logger.info(f"{request_ip} is updating the latest AtomicShield agent")

    response = HttpResponse()
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment; filename="AtomicShieldAgent.exe"'
    response['X-Accel-Redirect'] = '/static/download/AtomicShieldAgent.exe'
    return response
