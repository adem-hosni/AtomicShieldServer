import json
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt


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
def server_status(request: HttpRequest) -> HttpResponse:
    return HttpResponse(
        json.dumps(
            {
                "alive": False,
                "message": "Maintening...",
            }
        )
    )
