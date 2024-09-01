from django.conf import settings
from django.http import HttpRequest, HttpResponse


def download_agent_peb(request: HttpRequest) -> HttpResponse:
    with open(
        f"../bin/{'debug' if settings.DEBUG else 'production'}/agent/agent_peb.dll",
        "rb",
    ) as file:
        agent_peb_buffer = file.read()

    return HttpResponse(agent_peb_buffer, content_type="application/octet-stream")
