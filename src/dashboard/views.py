import re
import logging
import json
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from .models import (
    Announcements,
    PatchNotes,
    GameServer,
    Whitelist,
    ServerTypes,
    ServerStatus,
    ServerSubscription,
)
from anticheat.models import (
    AntiCheatConfigTemplates,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategories,
)
from .forms import AddServerForm, ConfigurationsForm, QuickSetupForm, supported_dists
import utils
from typing import Dict, Union, List
from utils.aseclient import ASEQueryClient, ASEParser


logger = logging.getLogger(__name__)


@login_required
def render_dashboard_redirect(request: HttpRequest) -> HttpResponse:
    return redirect(reverse("main"))


@login_required
def render_maindashboard(request: HttpRequest) -> HttpResponse:
    announcements = []
    if request.method == "POST":
        request_body = request.body.decode()

        # check the request body health
        if request_body:
            try:
                request_body = json.loads(request.body.decode())
            except Exception as err:
                logger.error(
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


@login_required
def render_users(request: HttpRequest) -> HttpResponse:
    return render(
        request, "pages/dashboard/users.jinja", {"username": request.user.username}
    )


@login_required
def render_patchnotes(request: HttpRequest) -> HttpResponse:
    patchnotes = []
    if request.method == "POST":
        request_body = request.body.decode()

        # check the request body health
        if request_body:
            try:
                request_body = json.loads(request.body.decode())
            except Exception as err:
                logger.error(
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


@login_required
def render_servers(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = AddServerForm(request.POST, user=request.user)

        if form.is_valid():
            ip = form.cleaned_data["ip"]
            port = form.cleaned_data["port"]
            server_type = form.cleaned_data["server_type"]
            subscription_id = form.cleaned_data["subscription"]

            # Check if the server_type and the subscription_id are of type string
            if isinstance(server_type, str) and isinstance(subscription_id, str):
                if not server_type.isnumeric() and not subscription_id.isnumeric():
                    form.add_error("server_type", "Invalid Server Type")
                    form.add_error("subscription", "Invalid Subscription")
                    return HttpResponseRedirect("/dashboard/servers")
                server_type = int(server_type)
                subscription_id = int(subscription_id)

            # Check if the port is of type string
            if isinstance(port, str):
                if not port.isnumeric():
                    form.add_error("port", "Invalid Server Type")
                    return HttpResponseRedirect("/dashboard/servers")
                port = int(port)

            # Check port range (1 -> 65535)
            if not (port >= 1 and port <= 65535):
                form.add_error("port", "Invalid port range")
                return HttpResponseRedirect("/dashboard/servers")

            if server_type == 1:  # Server Type: MTA:SA
                ipv4_pattern = re.compile(
                    r"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                )

                # Check if the ip is correct
                if not ipv4_pattern.match(ip):
                    form.add_error("ip", "Invalid IPV4 IP")
                    return HttpResponseRedirect("/dashboard/servers")

                # Check if the server address already used
                if GameServer.objects.filter(ip=ip, port=port).exists():
                    form.add_error("ip", "Server Address Already been used!")
                    return HttpResponseRedirect("/dashboard/servers")

                # Check the selected subscription health
                try:
                    subscription = ServerSubscription.objects.get(id=subscription_id)
                except ServerSubscription.DoesNotExist:
                    logger.warning(
                        f"{request.user.username} trying to use a non existing subscription (used subscription id: {subscription_id})!"
                    )
                    return HttpResponseRedirect("/dashboard/servers")
                if subscription.owner != request.user:
                    logger.warning(
                        f"{request.user.username} trying to use {subscription.owner.username}'s subscription!"
                    )
                    form.add_error("subscription", "Not your fucking subscription!")
                    return HttpResponseRedirect("/dashboard/servers")

                if not subscription.is_valid_for_now():
                    logger.warning(
                        f"{request.user.username} trying to use expired subscription (subscription id: {subscription_id})!"
                    )
                    form.add_error("subscription", "Expired Subscription")
                    return HttpResponseRedirect("/dashboard/servers")

                # Generate a license key for the server
                license_key = utils.generate_key(4)

                # Check if key already exists, regenerate it
                if GameServer.objects.filter(key=license_key).exists():
                    license_key = utils.generate_key(4)

                # Create the server configs
                configurations = AntiCheatConfigurations()
                for config in AntiCheatConfigTemplates.objects.filter(
                    server_type=ServerTypes.MTASA
                ):
                    configurations.config[config.id] = config.default_value
                configurations.save()

                new_server = GameServer.objects.create(
                    ip=ip,
                    port=port,
                    owner=request.user,
                    key=license_key,
                    configurations=configurations,
                    type=ServerTypes.MTASA,
                    status=ServerStatus.online,
                )
                new_server.subscriptions.add(subscription)
                request.session["selected_server"] = new_server.id
                logger.info(
                    f"Added New Server {ip}:{port} from {request.user.username}, license key: ({license_key})"
                )
                return HttpResponseRedirect("/dashboard/servers")

    else:
        form = AddServerForm(user=request.user)

    servers = GameServer.objects.filter(owner=request.user)

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
                    "subscription_status": server.subscriptions.last(),
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


@login_required
def check_server(request: HttpRequest) -> HttpResponse:
    request_body = request.body.decode()

    # check the request body health
    if request_body:
        try:
            request_body = json.loads(request.body.decode())
        except Exception as err:
            logger.error(
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


@login_required
def select_server(request: HttpRequest) -> HttpResponse:
    request_body: Dict[str, Union[bool, str]] = request.body.decode()

    # Check the request_body is a json
    if request_body:
        try:
            request_body = json.loads(request.body.decode())
        except Exception as err:
            logger.error(
                f"Failed to parse request body\nrequest body: {request_body}\nException: {err}"
            )
            return HttpResponse(json.dumps({"success": False}))

    # Check the request_body form
    if len(request_body.keys()) != 2:
        logger.error(f"Invalid request body, got {request_body}")
        return HttpResponse(json.dumps({"success": False}))

    # Check the request_body keys
    if not ("server_id" in request_body.keys() or "select" in request_body.keys()):
        logger.error(f"Invalid request body, got {request_body}")
        return HttpResponse(json.dumps({"success": False}))

    # Check if the server_id has some character
    if not request_body["server_id"].isnumeric():
        return HttpResponse(json.dumps({"success": False, "message": "Invalid Server"}))

    # Cast the server_id from str to int
    request_body["server_id"] = int(request_body["server_id"])

    if not isinstance(request_body["select"], bool):
        logger.error(f"Invalid request body, got {request_body}")
        return HttpResponse(json.dumps({"success": False}))

    # Find the server in the owner servers
    try:
        target_server = GameServer.objects.get(
            owner=request.user, id=request_body["server_id"]
        )
    except GameServer.DoesNotExist:
        return HttpResponse(json.dumps({"success": False, "message": "Invalid Server"}))

    if request.session.get("selected_server", -1) == target_server.id:
        del request.session["selected_server"]
        return HttpResponse(json.dumps({"success": True}))

    request.session["selected_server"] = target_server.id

    return HttpResponse(json.dumps({"success": True}))


@login_required
def refresh_server_key(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        request_body = request.POST

        if len(request_body.keys()) != 2:
            return HttpResponse(json.dumps({"success": False}))

        if not "server" in request_body.keys():
            return HttpResponse(json.dumps({"success": False}))

        try:
            target_server = GameServer.objects.get(
                owner=request.user, id=int(request_body["server"])
            )
        except GameServer.DoesNotExist:
            return HttpResponse(json.dumps({"success": False}))

        new_key = utils.generate_key(4)
        if new_key == target_server.key:
            new_key = utils.generate_key(4)
        target_server.key = new_key
        target_server.save()

        logger.info(
            f'"{request.user.username}" has refreshed his server {target_server.ip}:{target_server.port}\'s key'
        )

        return redirect(reverse("servers"))

    return HttpResponse(json.dumps({"success": False}))


@login_required
def render_configurations(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        request_body = request.POST
        form = ConfigurationsForm(request.POST)

        # check the request body health
        if form.is_valid():
            selected_server = request.session.get("selected_server", -1)
            if selected_server > 0:
                try:
                    target_server = GameServer.objects.get(id=selected_server)
                except GameServer.DoesNotExist:
                    ...
                else:
                    allowed_configs = AntiCheatConfigTemplates.objects.filter(
                        server_type=ServerTypes.MTASA
                    )
                    allowed_ids = allowed_configs.values_list("id", flat=True)
                    server_configurations = target_server.configurations
                    for key, value in form.cleaned_data.items():
                        if key != "csrfmiddlewaretoken":
                            target_config_id = int(key)
                            if target_config_id in allowed_ids:
                                server_configurations.config[target_config_id] = value
                    server_configurations.save()
                    return redirect(request.path)

    selected_server_id = request.session.get("selected_server", -1)
    configs = []

    if selected_server_id > 0:
        try:
            server = GameServer.objects.get(owner=request.user, id=selected_server_id)
        except GameServer.DoesNotExist:
            ...
        else:
            server_configs = server.configurations.config

            for template_config in AntiCheatConfigTemplates.objects.filter(
                server_type=ServerTypes.MTASA
            ):
                # Added each config per templates
                # if the config is not registred on the server configs table, get the default config value from configs templates
                configs.append(
                    {
                        "id": template_config.id,
                        "name": template_config.name,
                        "description": template_config.description,
                        "data": {
                            "type": template_config.config_type,
                            "value": server_configs.get(
                                str(template_config.id),
                                server_configs.get(
                                    str(template_config.id),
                                    template_config.get_default_value(),
                                ),
                            ),
                        },
                    }
                )

    form = ConfigurationsForm()
    form.set_configurations(configs)
    return render(
        request,
        "pages/dashboard/configurations.jinja",
        {
            "form": form,
            "configs_count": len(configs),
            "categories": [
                {
                    "id": category.id,
                    "name": category.name,
                    "description": category.description,
                }
                for category in AntiCheatConfigurationCategories.objects.all()
            ],
        },
    )


@login_required
def render_quicksetup(request: HttpRequest) -> HttpResponse:
    form = QuickSetupForm()
    if request.method == "POST":
        form = QuickSetupForm(request.POST)
        if form.is_valid():
            target_dist = form.cleaned_data["distribution"]
            if int(target_dist) in [int(dist[0]) for dist in supported_dists]:
                ...

    return render(
        request,
        "pages/dashboard/quicksetup.jinja",
        {
            "form": form,
            "files": ["deathmatch.dll", "mtaserver.conf"],
            "distributions": [
                "Windows",
                "Ubuntu",
                "Debian",
                "Kali",
            ],
        },
    )


@login_required
def render_subscriptions(request: HttpRequest) -> HttpResponse:
    return render(
        request,
        "pages/dashboard/subscriptions.jinja",
        {
            "subscriptions": [
                {
                    "type": subscription.type,
                    "started_at": subscription.started_at,
                    "name": subscription.name,
                    "status": subscription.status,
                }
                for subscription in ServerSubscription.objects.filter(
                    owner=request.user
                )
            ]
        },
    )


@login_required
def render_whitelist(request: HttpRequest) -> HttpResponse:
    whitelists: List[Whitelist] = []
    error_message = ""

    try:
        target_server = GameServer.objects.get(
            id=request.session.get("selected_server", -1)
        )
    except GameServer.DoesNotExist:
        error_message = "The selected server does not exists!"
    else:
        whitelists = target_server.whitelists.all()

    if not len(whitelists):
        error_message = "0 Whitelists"

    return render(
        request,
        "pages/dashboard/whitelist.jinja",
        {
            "whitelists": [
                {
                    "username": whitelist.username,
                    "ip": whitelist.ip,
                    "serial": whitelist.serial,
                }
                for whitelist in whitelists
            ],
            "error_message": error_message,
        },
    )
