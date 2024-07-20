from django.shortcuts import render
from django.http import HttpRequest, HttpResponse

# Create your views here.

def render_home(request: HttpRequest) -> HttpResponse:
    return render(request, "pages/index.jinja")
