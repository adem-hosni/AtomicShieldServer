import json
from django.http import HttpRequest, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from utils import check_request_body_key
from services.websocket import fivem_conn_manager
from core import atomic_core
from .models import CrashReport
import logging


logger = logging.getLogger(__name__)


@csrf_exempt
def agent_status(request: HttpRequest) -> HttpResponse:
    return HttpResponse(
        atomic_core.encode(
            {
                "alive": True,
                "message": "",
                "title": "",
            }
        )
    )


@csrf_exempt
async def is_client_connected(request: HttpRequest) -> HttpResponse:
    success = await fivem_conn_manager.is_engine_connected(
        request.META.get(
            "HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", "")
        )
        .split(",")[0]
        .strip()
    )
    return HttpResponse(
        atomic_core.encode({"success": success})
    )



@csrf_exempt
def server_status(request: HttpRequest) -> HttpResponse:
    return HttpResponse(
        atomic_core.encode(
            {
                "alive": True,
                "message": "",
            }
        )
    )


@csrf_exempt
def version_check(request: HttpRequest) -> HttpResponse:
    try:
        request_body = json.loads(atomic_core.decode(request.body))
        if not check_request_body_key(request_body, "version", str):
            return HttpResponse(json.dumps({"success": False}))

        with open(f"{settings.CONFIG_DIR}/version.json", "r") as file:
            version = json.load(file)
        client_version = request_body["version"]
    except Exception as err:
        logger.error(err)
        return HttpResponse()

    return HttpResponse(
        atomic_core.encode(
            {
                "success": client_version == version["current_version"]
                or client_version in version["include"]
            }
        )
    )


@csrf_exempt
def engine_interaction(request: HttpRequest) -> HttpResponse:
    response = None
    try:
        request_body = json.loads(atomic_core.decode(request.body))
        if not check_request_body_key(request_body, "type", str):
            response = {"success": False}
        else:
            match request_body["type"]:
                case "report_ss":
                    if check_request_body_key(request_body, "buffer", str):
                        screenshot_buffer = request_body["buffer"]
                    else:
                        response = {"success": False}

    except Exception:
        return HttpResponse()

    return HttpResponse(atomic_core.encode(response or ""))


@csrf_exempt
def crash_report_upload(request: HttpRequest) -> HttpResponse:
    request_ip = request.META.get("HTTP_X_REAL_IP", request.META.get("REMOTE_ADDR"))    
    logger.warning(f"CRASH REPORT RECEIVED! from {request_ip}")

    try:
        request_body = json.loads(request.body.decode())

        exception_code = hex(request_body.get("exception_code", 0))
        exception_address = hex(request_body.get("exception_address", 0))
        exception_flags = hex(request_body.get("exception_flags", 0))
        module_base = hex(request_body.get("module_base", 0))

        try:
            report = CrashReport.objects.get(
                exception_code=exception_code,
                exception_address=exception_address,
                exception_flags=exception_flags,
            )
            if report:
                logger.info(f"Found a crash report same with the received (Report id: {report.id})!")
                return HttpResponse()
        except CrashReport.DoesNotExist:
            ...

        crash_by = fivem_conn_manager.get_engine_by_ip(request_ip)
        report = CrashReport.objects.create(
            crash_by=crash_by.hwid,
            error=request_body.get("error", "CRASHED"),
            exception_code=exception_code,
            exception_address=exception_address,
            exception_flags=exception_flags,
            module_base=module_base,
            registers={
                key: hex(value) if isinstance(value, int) else value
                for key, value in request_body.get("registers", {}).items()
            },
        )
        logger.info(
            f"Crash report saved as {report.id} by {crash_by}: {report.error} | EXCEPTION CODE: {report.exception_code} | EXCEPTION ADDRESS: {report.exception_address} | EXCEPTION FLAGS: {report.exception_flags}"
        )

        return HttpResponse()

    except Exception as err:
        logger.error(f"Error saving crash report: {err}")

    return HttpResponse()
