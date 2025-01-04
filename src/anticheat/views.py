import json
from django.http import HttpRequest, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from utils import check_request_body_key
from guards import fivem_guard


@csrf_exempt
def agent_status(request: HttpRequest) -> HttpResponse:
    return HttpResponse(
        json.dumps(
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
        json.dumps(
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
        json.dumps(
            {
                "alive": True,
                "message": "",
            }
        )
    )


@csrf_exempt
def version_check(request: HttpRequest) -> HttpResponse:
    request_body = json.loads(request.body.decode())
    if not check_request_body_key(request_body, "version", str):
        return HttpResponse(json.dumps({"success": False}))

    with open(f"{settings.CONFIG_DIR}\\version.json", "r") as file:
        version = json.load(file)

    client_version = request_body["version"]

    return HttpResponse(
        json.dumps(
            {
                "success": client_version == version["current_version"]
                or client_version in version["include"]
            }
        )
    )
