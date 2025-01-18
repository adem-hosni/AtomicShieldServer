from django.shortcuts import render, redirect
from django.db.models import Q
from django.http import HttpRequest, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

from .forms import SignInForm, SignUpForm


def render_signin(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect("/dashboard/main")

    if request.method == "POST":
        form = SignInForm(request.POST)

        if form.is_valid():
            username_or_email = form.cleaned_data["username_or_email"]
            password = form.cleaned_data["password"]

            queried_user = User.objects.filter(
                Q(email=username_or_email) | Q(username=username_or_email)
            ).first()
            if queried_user:
                user = authenticate(
                    request, username=queried_user.username, password=password
                )
                if user:
                    login(request, user)
                    return redirect("/dashboard/main")
                else:
                    messages.error(request, "Password is incorrect")
            else:
                messages.error(request, "Username is incorrect")

    else:
        form = SignInForm()

    return render(request, "pages/auth/signin.jinja", {"form": form})


def render_signup(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect("/dashboard/main")

    if request.method == "POST":
        form = SignUpForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data["email"]
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]

            if len(str(password)) < 8:
                messages.error(request, "Password must have at least 8 characters")
            else:
                if User.objects.filter(username=username).exists():
                    messages.error(request, "Username already exists")
                else:
                    user = User.objects.create_user(
                        username=username, email=email, password=password
                    )
                    user = authenticate(username=username, password=password)
                    if user:
                        login(request, user)
                        return redirect("/dashboard/main")
    else:
        form = SignUpForm()

    return render(request, "pages/auth/signup.jinja", {"form": form})


def render_logout(request: HttpRequest) -> HttpResponse:
    logout(request)
    return redirect("/")
