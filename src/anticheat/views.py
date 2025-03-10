import json
from django.http import HttpRequest, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from utils import check_request_body_key
from guards import fivem_guard
from core import atomic_core


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
def is_client_connected(request: HttpRequest) -> HttpResponse:
    return HttpResponse(
        atomic_core.encode(
            {
                "success": fivem_guard.is_engine_connected(
                    request.META.get(
                        "HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", "")
                    )
                    .split(",")[0]
                    .strip()
                )
            }
        )
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
    except Exception:
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
