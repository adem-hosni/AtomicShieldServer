import json
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
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
