from django.http import HttpRequest
from django.shortcuts import render


def handler404(request: HttpRequest, exception: Exception, template_name: str = None):
    return render(request, "pages/404.jinja", {}, status=404)


def handler500(request, template_name="500.html"):
    return render(request, "pages/500.jinja", {}, status=500)
