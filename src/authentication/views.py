from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

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
                    "isVerified": False,  # TODO
                    "createdAt": user.date_joined.strftime("%d/%m/%Y, %H:%M:%S"),
                    "lastLogin": user.last_login.strftime("%d/%m/%Y, %H:%M:%S")
                },
            },
        })
