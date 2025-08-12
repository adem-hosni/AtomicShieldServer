from django.shortcuts import redirect
from django.urls import reverse
from urllib.parse import urlencode
from django.conf import settings
from django.http import JsonResponse, HttpResponseRedirect
from django.db.models import Q
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
import json
from urllib.parse import quote

User = get_user_model()

class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email_or_username = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()

        try:
            user = User.objects.get(
                Q(username=email_or_username) | Q(email=email_or_username)
            )
        except User.DoesNotExist:
            return Response({"success": False, "message": "Invalid email or username"}, status=401)

        if not user.check_password(password):
            return Response({"success": False, "message": "Invalid password"}, status=401)

        user = authenticate(username=user.username, password=password)
        if not user:
            return Response({"success": False, "message": "Authentication failed"}, status=401)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            "success": True,
            "data": {
                "token": str(access),
                "user": {
                    "id": user.id,
                    "name": user.username,
                    "email": user.email,
                    "provider": "email",
                    "isVerified": user.is_active,
                    "createdAt": user.date_joined.strftime("%d/%m/%Y, %H:%M:%S"),
                    "lastLogin": user.last_login.strftime("%d/%m/%Y, %H:%M:%S") if user.last_login else None
                },
            },
        })


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()
        username = request.data.get("name", "").strip()

        if User.objects.filter(username=username).exists():
            return Response({"success": False, "message": "Username already exists"}, status=401)
        if User.objects.filter(email=email).exists():
            return Response({"success": False, "message": "Email already exists"}, status=401)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            "success": True,
            "data": {
                "token": str(access),
                "user": {
                    "id": user.id,
                    "name": user.username,
                    "email": user.email,
                    "provider": "email",
                    "isVerified": user.is_active,
                    "createdAt": user.date_joined.strftime("%d/%m/%Y, %H:%M:%S"),
                    "lastLogin": user.last_login.strftime("%d/%m/%Y, %H:%M:%S") if user.last_login else None
                },
            },
        })


class SocialLoginCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, provider):
        try:
            # Let django-allauth handle the OAuth2 login flow internally.
            # Here we assume the frontend already redirected to the provider's login page.
            account = SocialAccount.objects.get(user=request.user, provider=provider)
            user = account.user
        except SocialAccount.DoesNotExist:
            return Response({"success": False, "message": "Social account not linked"}, status=400)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        avatar_url = ""
        if account.extra_data.get("avatar_url"):
            avatar_url = account.extra_data["avatar_url"]
        elif account.extra_data.get("picture"):
            avatar_url = account.extra_data["picture"]

        user_info = {
            "id": user.id,
            "name": user.username,
            "email": user.email,
            "provider": provider,
            "avatar": avatar_url,
            "isVerified": True,
            "createdAt": user.date_joined.strftime("%d/%m/%Y, %H:%M:%S"),
            "lastLogin": user.last_login.strftime("%d/%m/%Y, %H:%M:%S") if user.last_login else None,
        }

        user_info_json = json.dumps(user_info)
        user_data_encoded = quote(user_info_json)

        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:8080")
        redirect_url = f"{frontend_url}?token={access}&user={user_data_encoded}"

        return HttpResponseRedirect(redirect_url)


def _social_login_redirect(request, provider):
    """Redirect helper that starts the django-allauth social login flow.

    - `provider` is the allauth provider id (e.g. 'discord', 'google').
    - It uses allauth's named URL `socialaccount_login` which resolves to
      `/accounts/<provider>/login/` by default.
    - `returnUrl` query param will be passed as `next` so allauth will redirect
      back to your frontend after the flow.
    """
    return_url = request.GET.get("returnUrl", "/dashboard/overview")
    login_url = reverse("socialaccount_login", args=[provider])
    params = {"process": "login", "next": return_url}
    return redirect(f"{login_url}?{urlencode(params)}")


def discord_login(request):
    return _social_login_redirect(request, "discord")

def google_login(request):
    return _social_login_redirect(request, "google")
