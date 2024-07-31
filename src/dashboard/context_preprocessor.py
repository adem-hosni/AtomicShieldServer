from django.http import HttpRequest
from dashboard.models import PatchNotes
from typing import Dict, Any

def preprocess_notification_pins(request: HttpRequest) -> Dict[str, Any]:
    if request.user.is_authenticated:
        return {"unseen_patchnotes": PatchNotes.objects.exclude(seen_by=request.user).count()}