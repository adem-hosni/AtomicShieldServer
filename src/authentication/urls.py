from django.urls import path
from . import views

urlpatterns = [
    path("signin", view=views.SignInView.as_view(), name="signin"),
    # path("signup/", view=views.api_signup, name="signup"),
    # path("logout/", view=views.api_logout, name="logout"),
]
