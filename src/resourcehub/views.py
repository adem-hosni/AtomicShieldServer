import logging
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from safecore import safe_core


logger = logging.getLogger(__name__)


@csrf_exempt
def download_agent_peb(request: HttpRequest) -> HttpResponse:
    with open(
        f"../bin/{'debug' if settings.DEBUG else 'production'}/agent/agent_peb.dll",
        "rb",
    ) as file:
        agent_peb_buffer = (file.read())

    logger.info(f"{request.get_host()} downloaded eagle PEB Agent")

    return HttpResponse(agent_peb_buffer, content_type="application/octet-stream")
