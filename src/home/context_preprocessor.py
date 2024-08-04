from django.http import HttpRequest
from typing import Dict, Any


def preprocess_navbar_auth_btn(request: HttpRequest) -> Dict[str, Any]:
    return {"authed": request.user.is_authenticated}
