import re
import json
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from .models import Announcements, PatchNotes, GameServers, ServerTypes, ServerStatus
from server_manager.models import AntiCheatConfigTemplates, AntiCheatConfigurations
from .forms import AddServerForm
import utils
from typing import Dict, Union
from utils.aseclient import ASEQueryClient, ASEParser


def render_maindashboard(request: HttpRequest) -> HttpResponse:
    if not request.user.is_authenticated:
        return redirect("/auth/signin")

    announcements = []
    if request.method == "POST":
        request_body = request.body.decode()

        # check the request body health
        if request_body:
            try:
                request_body = json.loads(request.body.decode())
            except Exception as err:
                print(
                    f"Failed to parse request body\nrequest body: {request_body}\nException: {err}"
                )
            if "seenAnnouncement" in request_body.keys():
                announcement_id = int(request_body["seenAnnouncement"])
                try:
                    seen_announcement = Announcements.objects.get(id=announcement_id)
                except Announcements.DoesNotExist:
                    ...
                else:
                    seen_announcement.seens.add(request.user)
                    seen_announcement.save()
    else:
        for announcement in Announcements.objects.all():
            announcements.append(
                {
                    "date": announcement.date,
                    "author": announcement.author,
                    "title": announcement.title,
                    "announcement": announcement.announcement,
                    "dataid": announcement.id,
                    "seen": announcement.seens.filter(id=request.user.id).exists(),
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
    if request.method == "POST":
        request_body = request.body.decode()

        # check the request body health
        if request_body:
            try:
                request_body = json.loads(request.body.decode())
            except Exception as err:
                print(
                    f"Failed to parse request body\nrequest body: {request_body}\nException: {err}"
                )
            if "seenPatchNote" in request_body.keys():
                patchnote_id = int(request_body["seenPatchNote"])
                try:
                    seen_patchnote = PatchNotes.objects.get(id=patchnote_id)
                except PatchNotes.DoesNotExist:
                    ...
                else:
                    seen_patchnote.seens.add(request.user)
                    seen_patchnote.save()
    else:
        for patchnote in PatchNotes.objects.all():
            patchnotes.append(
                {
                    "date": patchnote.date,
                    "author": patchnote.author,
                    "title": patchnote.title,
                    "patchnotes": patchnote.patchnotes,
                    "dataid": patchnote.id,
                    "seen": patchnote.seens.filter(id=request.user.id).exists(),
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

        if form.is_valid():
            ip = form.cleaned_data["ip"]
            port = form.cleaned_data["port"]
            server_type = form.cleaned_data["server_type"]

            # Check if the server_type is of type string
            if isinstance(server_type, str):
                if not server_type.isnumeric():
                    return form.add_error("server_type", "Invalid Server Type")
                server_type = int(server_type)

            # Check if the port is of type string
            if isinstance(port, str):
                if not port.isnumeric():
                    return form.add_error("port", "Invalid Server Type")
                port = int(port)

            # Check port range (1 -> 65535)
            if not (port >= 1 and port <= 65535):
                return form.add_error("port", "Invalid port range")

            if server_type == 1:  # Server Type: MTA:SA
                ipv4_pattern = re.compile(
                    r"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                )

                # Check if the ip is correct
                if not ipv4_pattern.match(ip):
                    return form.add_error("ip", "Invalid IPV4 IP")

                # Generate a license key for the server
                license_key = utils.generate_key(4)

                # Check if key already exists, regenerate it
                if GameServers.objects.filter(key=license_key).exists():
                    license_key = utils.generate_key(4)
                    
                # Create the server configs
                configurations = AntiCheatConfigurations()
                for config in AntiCheatConfigTemplates.objects.filter(server_type=ServerTypes.MTASA):
                    configurations.config[config.id] = config.default_value
                configurations.save()

                GameServers.objects.create(
                    ip=ip,
                    port=port,
                    owner=request.user,
                    key=license_key,
                    subscriptions="",
                    configurations=configurations,
                    type=ServerTypes.MTASA,
                    status=ServerStatus.online,
                )
                print(
                    f"Added New Server {ip}:{port} from {request.user.username}, license key: ({license_key})"
                )
                return HttpResponseRedirect("/dashboard/servers")

    else:
        form = AddServerForm()

    servers = GameServers.objects.filter(owner=request.user)

    return render(
        request,
        "pages/dashboard/servers.jinja",
        {
            "form": form,
            "servers": [
                {
                    "id": server.id,
                    "key": server.key,
                    "address": f"{server.ip}:{server.port}",
                    "type": server.type,
                    "duration": "30 Days",
                }
                for server in servers.reverse()
            ],
            "active": (
                request.session["selected_server"]
                if "selected_server" in request.session.keys()
                else servers[0].id if len(servers) >= 1 else -1
            ),
        },
    )


def check_server(request: HttpRequest) -> HttpResponse:
    request_body = request.body.decode()

    # check the request body health
    if request_body:
        try:
            request_body = json.loads(request.body.decode())
        except Exception as err:
            print(
                f"Failed to parse request body\nrequest body: {request_body}\nException: {err}"
            )
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

    ase_client = ASEQueryClient()
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


def select_server(request: HttpRequest) -> HttpResponse:
    request_body: Dict[str, Union[bool, str]] = request.body.decode()

    # Check the request_body is a json
    if request_body:
        try:
            request_body = json.loads(request.body.decode())
        except Exception as err:
            print(
                f"Failed to parse request body\nrequest body: {request_body}\nException: {err}"
            )
            return HttpResponse(json.dumps({"success": False}))

    # Check the request_body form
    if len(request_body.keys()) != 2:
        print(f"Invalid request body, got {request_body}")
        return HttpResponse(json.dumps({"success": False}))

    # Check the request_body keys
    if not ("server_id" in request_body.keys() or "select" in request_body.keys()):
        print(f"Invalid request body, got {request_body}")
        return HttpResponse(json.dumps({"success": False}))

    # Check if the server_id has some character
    if not request_body["server_id"].isnumeric():
        return HttpResponse(json.dumps({"success": False, "message": "Invalid Server"}))

    # Cast the server_id from str to int
    request_body["server_id"] = int(request_body["server_id"])

    if not isinstance(request_body["select"], bool):
        print(f"Invalid request body, got {request_body}")
        return HttpResponse(json.dumps({"success": False}))

    # Find the server in the owner servers
    try:
        target_server = GameServers.objects.get(
            owner=request.user, id=request_body["server_id"]
        )
    except GameServers.DoesNotExist:
        return HttpResponse(json.dumps({"success": False, "message": "Invalid Server"}))

    if request.session.get("selected_server", -1) == target_server.id:
        del request.session["selected_server"]
        return HttpResponse(json.dumps({"success": True}))

    request.session["selected_server"] = target_server.id

    return HttpResponse(json.dumps({"success": True}))


def render_configurations(request: HttpRequest) -> HttpResponse:
    if not request.user.is_authenticated:
        return redirect("/auth/signin")

    return render(
        request,
        "pages/dashboard/configurations.jinja",
        {
            "configs": [
                {
                    "id": config.id,
                    "name": config.name,
                    "description": config.description,
                    "data": {
                        "type": config.config_type,
                        "value": True if config.config_type == 1 else "qsd" if config.config_type == 2 else 456,
                    }
                }
                for config in AntiCheatConfigTemplates.objects.filter(
                    server_type=ServerTypes.MTASA
                )
            ]
        },
    )
