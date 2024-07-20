from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from .models import Announcements, PatchNotes
import re
import json
from .forms import AddServerForm
from utils.aseclient import ASEQueryClient, ASEParser


ase_client = ASEQueryClient()


def render_maindashboard(request: HttpRequest) -> HttpResponse:
    if not request.user.is_authenticated:
        return redirect("/auth/signin")

    announcements = []
    for announcement in Announcements.objects.all():
        announcements.append(
            {
                "date": announcement.date,
                "author": announcement.author,
                "title": announcement.title,
                "announcement": announcement.announcement,
            }
        )
    announcements.reverse()
    return render(
        request,
        "pages/dashboard/main.jinja",
        {"username": request.user.username, "announcements": announcements},
    )


def render_users(request: HttpRequest) -> HttpResponse:
    if not request.user.is_authenticated:
        return redirect("/auth/signin")

    return render(
        request, "pages/dashboard/users.jinja", {"username": request.user.username}
    )


def render_patchnotes(request: HttpRequest) -> HttpResponse:
    if not request.user.is_authenticated:
        return redirect("/auth/signin")

    patchnotes = []
    for patchnote in PatchNotes.objects.all():
        patchnotes.append(
            {
                "date": patchnote.date,
                "author": patchnote.author,
                "title": patchnote.title,
                "patchnotes": patchnote.patchnotes,
            }
        )
    patchnotes.reverse()

    return render(
        request, "pages/dashboard/patchnotes.jinja", {"patchnotes": patchnotes}
    )


def render_servers(request: HttpRequest) -> HttpResponse:
    if not request.user.is_authenticated:
        return redirect("/auth/signin")

    if request.method == "POST":
        form = AddServerForm(request.POST)
    else:
        form = AddServerForm()

    return render(
        request, "pages/dashboard/servers.jinja", {"form": form, "servers": []}
    )


def check_server(request: HttpRequest) -> HttpResponse:
    request_body = request.body.decode()

    # check the request body health
    if request_body:
        try:
            request_body = json.loads(request.body.decode())
        except Exception:
            return HttpResponse(json.dumps({"success": False}))

    # check how many keys the json data have
    if len(request_body.keys()) < 3:
        return HttpResponse(json.dumps({"success": False}))

    # check required items in the request
    if not (
        "ip" in request_body.keys()
        or "port" in request_body.keys()
        or "type" in request_body.keys()
    ):
        return HttpResponse(json.dumps({"success": False}))

    ipv4_pattern = re.compile(
        r"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    )

    # check the ip health
    if not ipv4_pattern.match(request_body["ip"]):
        return HttpResponse(json.dumps({"success": False}))

    # remove some spaces in the port if found
    request_body["port"] = request_body["port"].strip()

    # check if the port is a number
    if not request_body["port"].isnumeric():
        return HttpResponse(json.dumps({"success": False}))

    port = int(request_body["port"])

    # check the range of the port
    if not (port >= 1 and port <= 65535):
        return HttpResponse(json.dumps({"success": False}))

    query_buffer = ase_client.getquery((request_body["ip"], port))

    # server is offline ?
    if not query_buffer:
        return HttpResponse(json.dumps({"success": False}))

    # Invalid server query ?
    try:
        ase_parser = ASEParser(ase_client.clean_query(query_buffer))

        target_server = ase_parser.get_server()
    except:
        return HttpResponse(json.dumps({"success": False}))

    response_body = {
        "success": True,
        "servername": target_server.server_name,
        "playercount": target_server.joined_players,
        "maxplayers": target_server.max_players,
        "gametype": target_server.game_type,
    }

    return HttpResponse(json.dumps(response_body))
