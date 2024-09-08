from django.http import HttpRequest
from django.conf import settings
from dashboard.models import PatchNotes, Announcements, GameServer
from typing import Dict, Any


def preprocess_sidebar_context(request: HttpRequest) -> Dict[str, Any]:
    if request.user.is_authenticated:
        cta_pins = []
        if GameServer.objects.filter(owner=request.user).count() == 0:
            cta_pins.append(
                {
                    "title": "Subscription",
                    "description": "No servers found on your account. Please subscribe your server to access those options",
                    "extra_url": {"text": "Subscribe Now", "url": "/dashboard/servers"},
                }
            )

        return {
            "unseen_patchnotes": PatchNotes.objects.exclude(seens=request.user).count(),
            "unseen_announcements": Announcements.objects.exclude(
                seens=request.user
            ).count(),
            "cta_pins": cta_pins,
            "discord_invite": settings.DISCORD_INVITE
        }
    return {}
