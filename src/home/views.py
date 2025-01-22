from django.shortcuts import render
from django.http import HttpRequest, HttpResponse


def render_home(request: HttpRequest) -> HttpResponse:
    return render(request, "pages/index.jinja")


def render_policy(request: HttpRequest) -> HttpResponse:
    return render(request, "pages/policy.jinja")
