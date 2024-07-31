from django.http import HttpRequest
from dashboard.models import PatchNotes, Announcements
from typing import Dict, Any


def preprocess_patchnote_notifpins(request: HttpRequest) -> Dict[str, Any]:
    if request.user.is_authenticated:
        return {
            "unseen_patchnotes": PatchNotes.objects.exclude(seens=request.user).count()
        }

def preprocess_announcement_notifpins(request: HttpRequest) -> Dict[str, Any]:
    if request.user.is_authenticated:
        return {
            "unseen_announcements": Announcements.objects.exclude(seens=request.user).count()
        }
