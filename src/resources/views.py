import logging
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from core import atomic_core
from anticheat.models import AtomicEngineReleaseAsset

logger = logging.getLogger(__name__)


@csrf_exempt
def download_fivem_engine(request: HttpRequest) -> HttpResponse:
    engine_buffer = AtomicEngineReleaseAsset.get_last_engine()
    if engine_buffer is None:
        logger.warning(f"No engine available for download request from {request.META.get('HTTP_X_REAL_IP', request.META.get('REMOTE_ADDR'))}")
        return HttpResponse("No engine available", status=404)

    if isinstance(engine_buffer, str):
        engine_buffer = engine_buffer.encode()  # Ensure it's bytes

    engine_buffer = atomic_core.encode(engine_buffer)

    response = HttpResponse(engine_buffer, content_type="application/octet-stream")
    response["Content-Length"] = str(len(engine_buffer))
    response["Connection"] = "close"

    request_ip = request.META.get("HTTP_X_REAL_IP", request.META.get("REMOTE_ADDR"))
    logger.info(f"{request_ip} is downloading FiveM's engine")

    return response

@csrf_exempt
def download_fivem_engine_debug(request: HttpRequest) -> HttpResponse:
    engine_buffer = AtomicEngineReleaseAsset.get_last_engine(True)
    if engine_buffer is None:
        logger.warning(f"Debug engine requested but not available from {request.META.get('HTTP_X_REAL_IP', request.META.get('REMOTE_ADDR'))}")
        return HttpResponse("No engine available", status=404)

    if isinstance(engine_buffer, str):
        engine_buffer = engine_buffer.encode()  # Ensure it's bytes

    engine_buffer = atomic_core.encode(engine_buffer)

    response = HttpResponse(engine_buffer, content_type="application/octet-stream")
    response["Content-Length"] = str(len(engine_buffer))
    response["Connection"] = "close"

    request_ip = request.META.get("HTTP_X_REAL_IP", request.META.get("REMOTE_ADDR"))
    logger.warning(f"{request_ip} is downloading FiveM's debug engine")

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
