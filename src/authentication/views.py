from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from django.conf import settings
from django.utils import timezone
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from urllib.parse import urlencode, quote
import json
import requests
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse

class SignInView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return self.post(request)

    def post(self, request):
        email_or_username = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()

        user = User.objects.filter(Q(username=email_or_username) | Q(email=email_or_username)).first()
        if not user:
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
                    "isVerified": False,  # TODO: implement verification logic if needed
                    "createdAt": user.date_joined.strftime("%d/%m/%Y, %H:%M:%S"),
                    "lastLogin": user.last_login.strftime("%d/%m/%Y, %H:%M:%S") if user.last_login else None
                },
            },
        })


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return self.post(request)

    def post(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()
        username = request.data.get("name", "").strip()

        if User.objects.filter(username=username).exists():
            return Response({"success": False, "message": "Username already exists"}, status=401)
        elif User.objects.filter(email=email).exists():
            return Response({"success": False, "message": "Email already exists"}, status=401)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

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
                    "isVerified": False,
                    "createdAt": user.date_joined.strftime("%d/%m/%Y, %H:%M:%S"),
                    "lastLogin": user.last_login.strftime("%d/%m/%Y, %H:%M:%S") if user.last_login else None
                },
            },
        })


class DiscordOAuthLoginView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return_url = request.query_params.get("returnUrl", "/dashboard/overview")
        redirect_uri = request.query_params.get("redirect") or "http://localhost:8000/api/auth/discord/callback"

        if not redirect_uri:
            return Response({"success": False, "message": "Missing redirect URI"}, status=400)

        params = {
            "client_id": "1404072529684861058",
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "identify email",
            "state": return_url  
        }

        discord_auth_url = f"https://discord.com/api/oauth2/authorize?{urlencode(params)}"
        return redirect(discord_auth_url)
    

class DiscordOAuthCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.query_params.get("code")
        state = request.query_params.get("state", "/dashboard/overview")

        if not code:
            return Response({"success": False, "message": "No code provided"}, status=400)

        token_url = "https://discord.com/api/oauth2/token"
        data = {
            "client_id": "1404072529684861058",
            "client_secret": "6_Ne6-v2aaYWHLzeSVXHBAtchTnnYD2W",
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": "http://localhost:8000/api/auth/discord/callback",
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        token_res = requests.post(token_url, data=data, headers=headers)
        token_json = token_res.json()

        if "access_token" not in token_json:
            return Response({"success": False, "message": "Token exchange failed", "error": token_json}, status=400)

        access_token = token_json["access_token"]

        user_res = requests.get(
            "https://discord.com/api/users/@me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        discord_user = user_res.json()

        discord_id = discord_user.get("id")
        username = discord_user.get("username")
        email = discord_user.get("email", f"{discord_id}@discord.local")  # fallback email
        avatar_hash = discord_user.get("avatar")
        avatar_url = f"https://cdn.discordapp.com/avatars/{discord_id}/{avatar_hash}.png" if avatar_hash else ""

        user = User.objects.filter(Q(email=email) | Q(username=username)).first()

        if not user:
            user = User.objects.create_user(username=username, email=email)
            user.set_unusable_password()  
            user.save()

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        user_info = {
            "id": user.id,
            "name": user.username,
            "email": user.email,
            "provider": "discord",
            "avatar": avatar_url,
            "isVerified": True,
            "createdAt": user.date_joined.strftime("%d/%m/%Y, %H:%M:%S"),
            "lastLogin": user.last_login.strftime("%d/%m/%Y, %H:%M:%S") if user.last_login else None,
        }

        user_info_json = json.dumps(user_info)
        user_data_encoded = quote(user_info_json)

        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:8080")
        redirect_path = state if state.startswith("/") else f"/{state}"
        redirect_url = f"{frontend_url}{redirect_path}?token={access}&user={user_data_encoded}"

        return HttpResponseRedirect(redirect_url)
    
def google_auth(request):
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return redirect(url)



def google_callback(request):
    code = request.GET.get("code")
    state = request.GET.get("state", "/dashboard/overview")

    if not code:
        return JsonResponse({"success": False, "message": "No code provided"}, status=400)

    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    token_resp = requests.post(token_url, data=token_data)
    token_json = token_resp.json()

    if "error" in token_json:
        return JsonResponse({"success": False, "message": "Token exchange failed", "error": token_json}, status=400)

    access_token = token_json.get("access_token")

    user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    user_info_params = {"access_token": access_token}
    user_info_resp = requests.get(user_info_url, params=user_info_params)
    google_user = user_info_resp.json()

    google_id = google_user.get("id")
    email = google_user.get("email")
    username = google_user.get("name") or email.split("@")[0]
    avatar_url = google_user.get("picture", "")

    if not email:
        email = f"{google_id}@google.local" 

    user = User.objects.filter(email=email).first()
    if not user:
        user = User.objects.create_user(username=username, email=email)
        user.set_unusable_password()
        user.save()

    user.last_login = timezone.now()
    user.save(update_fields=["last_login"])

    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    user_info = {
        "id": user.id,
        "name": user.username,
        "email": user.email,
        "provider": "google",
        "avatar": avatar_url,
        "isVerified": True,
        "createdAt": user.date_joined.strftime("%d/%m/%Y, %H:%M:%S"),
        "lastLogin": user.last_login.strftime("%d/%m/%Y, %H:%M:%S") if user.last_login else None,
    }

    user_info_json = json.dumps(user_info)
    user_data_encoded = quote(user_info_json)

    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:8080")
    redirect_path = state if state.startswith("/") else f"/{state}"
    redirect_url = f"{frontend_url}{redirect_path}?token={access}&user={user_data_encoded}"

    return HttpResponseRedirect(redirect_url)
