from django_hosts import patterns, host
from django.shortcuts import redirect
from . import urls as main_urls


def store_redirect(request):
    print("redirecting to")
    return redirect("atomic-shield-store.tebex.io" + request.path)

host_patterns = patterns(
    "",
    host(r"store", store_redirect, name="store_redirect"),
    host(r"www", main_urls, name="www"),
)
