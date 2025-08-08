from django.shortcuts import render
from django.http import HttpRequest, HttpResponse


def render_home(request: HttpRequest) -> HttpResponse:
    return render(request, "pages/index.jinja")


def render_tos(request: HttpRequest) -> HttpResponse:
    return render(request, "pages/tos.jinja")

def render_privacy(request: HttpRequest) -> HttpResponse:
    return render(request, "pages/privacy.jinja")
