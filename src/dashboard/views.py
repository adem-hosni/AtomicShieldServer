import os
import logging
import json
from time import time
from datetime import datetime
from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib import messages
from django.urls import reverse
from django.db.models import Q
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect, FileResponse
from django.contrib.auth.decorators import login_required
from guards.multitheftauto import safeguard_manager
from utils import check_request_body_key, represent_timedelta_string
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
    Ban,
)
from .forms import (
    AddServerForm,
    QuickSetupForm,
    WhitelistForm,
)
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
def render_bans(request: HttpRequest) -> HttpResponse:
    bans = []
    try:
        target_server = GameServer.objects.get(
            owner=request.user, id=request.session.get("selected_server", -1)
        )
    except GameServer.DoesNotExist:
        messages.error(request, "The selected server does not exists!")
    else:
        bans = Ban.objects.filter(game_server=target_server)

    return render(
        request,
        "pages/dashboard/bans.jinja",
        {
            "bans": [
                {
                    "id": ban.id,
                    "username": ban.hwid.username,
                    "banned_at": ban.banned_at,
                    "game_serial": ban.hwid.mta_serial,
                    "duration": represent_timedelta_string(ban.duration),
                    "status": (
                        2 if datetime.now() - ban.duration > datetime.now() else ban.active
                    ),  # 0: Disabled, 1: Banned, 2: Expired
                    "reason": ban.reason,
                }
                for ban in bans
            ]
        },
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
    add_form = AddServerForm(user=request.user)
    if request.method == "POST":
        request_body = request.POST

        match request_body["type"]:
            case "add":
                add_form = AddServerForm(request_body, user=request.user)
                if add_form.is_valid():
                    ip = add_form.cleaned_data["ip"]
                    port = add_form.cleaned_data["port"]
                    name = str(add_form.cleaned_data["server_name"])
                    server_type = add_form.cleaned_data["server_type"]
                    subscription_id = add_form.cleaned_data["subscription"]

                    # Check if the server_type and the subscription_id are of type string
                    if isinstance(server_type, str) and isinstance(
                        subscription_id, str
                    ):
                        if (
                            not server_type.isnumeric()
                            and not subscription_id.isnumeric()
                        ):
                            messages.error(request, "Invalid Server Type")
                            messages.error(request, "Invalid Subscription")
                            return HttpResponseRedirect("/dashboard/servers")
                        server_type = int(server_type)
                        subscription_id = int(subscription_id)

                    # Check if the port is of type string
                    if isinstance(port, str):
                        if not port.isnumeric():
                            messages.error(request, "Invalid Server Type")
                            return HttpResponseRedirect("/dashboard/servers")
                        port = int(port)

                    # Check port range (1 -> 65535)
                    if not (port >= 1 and port <= 65535):
                        messages.error(request, "Invalid port range")
                        return HttpResponseRedirect("/dashboard/servers")

                    if not len(name):
                        messages.error(request, "Invalid server name")
                        return HttpResponseRedirect("/dashboard/servers")

                    if len(name) > 32:
                        messages.error(
                            request, "Server name must be less than 32 characters"
                        )
                        return HttpResponseRedirect("/dashboard/servers")

                    if server_type == 1:  # Server Type: MTA:SA
                        # Check if the ip is correct
                        if not utils.isvalid_ip(ip):
                            messages.error(request, "Invalid IPV4 IP")
                            return HttpResponseRedirect("/dashboard/servers")

                        # Check if the server address already used
                        if GameServer.objects.filter(ip=ip, port=port).exists():
                            messages.error(request, "Server Address Already been used!")
                            return HttpResponseRedirect("/dashboard/servers")

                        # Check the selected subscription health
                        try:
                            subscription = ServerSubscription.objects.get(
                                id=subscription_id
                            )
                        except ServerSubscription.DoesNotExist:
                            logger.warning(
                                f"{request.user.username} trying to use a non existing subscription (used subscription id: {subscription_id})!"
                            )
                            return HttpResponseRedirect("/dashboard/servers")
                        if subscription.owner != request.user:
                            logger.warning(
                                f"{request.user.username} trying to use {subscription.owner.username}'s subscription!"
                            )
                            messages.error(request, "Not your fucking subscription!")
                            return HttpResponseRedirect("/dashboard/servers")

                        if not subscription.is_valid_for_now():
                            logger.warning(
                                f"{request.user.username} trying to use expired subscription (subscription id: {subscription_id})!"
                            )
                            messages.error(request, "Expired Subscription")
                            return HttpResponseRedirect("/dashboard/servers")

                        # Check if the server name exists in the owned servers
                        if GameServer.objects.filter(
                            name=name, owner=request.user
                        ).exists():
                            messages.error(request, "Server name already used!")
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
                            name=name,
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
            case "edit":
                if not (
                    "target-server" in request_body.keys()
                    or "server-name" in request_body.keys()
                    or "server-ip" in request_body.keys()
                    or "server-port" in request_body.keys()
                ):
                    messages.error(request, "Unexpected error!")
                    return redirect(request.path)

                new_name = request_body["server-name"]
                new_ip = request_body["server-ip"]
                new_port = int(request_body["server-port"])

                if not utils.isvalid_ip(new_ip):
                    messages.error(request, "Invalid port")
                    return HttpResponseRedirect(request.path)

                # Check port range (1 -> 65535)
                if not (1 <= new_port <= 65535):
                    messages.error(request, "Invalid port")
                    return HttpResponseRedirect(request.path)

                try:
                    target_server = GameServer.objects.get(
                        id=int(request_body["target-server"]), owner=request.user
                    )
                except GameServer.DoesNotExist:
                    messages.error(request, "Selected Server Does Not Exists!")
                    return redirect(request.path)

                target_server.name = new_name
                target_server.ip = new_ip
                target_server.port = new_port

                target_server.save()
                messages.success(request, f"{target_server.name} Saved Successfuly!")

    else:
        add_form = AddServerForm(user=request.user)

    servers = GameServer.objects.filter(owner=request.user)

    return render(
        request,
        "pages/dashboard/servers.jinja",
        {
            "form": add_form,
            "servers": [
                {
                    "id": server.id,
                    "key": server.key,
                    "ip": server.ip,
                    "port": server.port,
                    "name": server.name,
                    "type": server.type,
                    "status": safeguard_manager.is_server_running(server.ip),
                    "subscription_status": server.subscriptions.last(),
                }
                for server in servers.reverse()
            ],
            "active": request.session.get("selected_server", -1),
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

    # check the ip health
    if not utils.isvalid_ip(request_body["ip"]):
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
    try:
        target_server = GameServer.objects.get(
            id=request.session.get("selected_server", -1), owner=request.user
        )
    except GameServer.DoesNotExist:
        messages.error(request, "The selected server does not exists!")
        return render(
            request,
            "pages/dashboard/configurations.jinja",
            {"error": "The selected server does not exists!"},
        )

    if request.method == "POST":
        for config_id, config_value in request.POST.items():
            if config_id != "csrfmiddlewaretoken":
                target_server.configurations.config[config_id] = config_value
        target_server.configurations.save()
        return redirect(request.path)

    server_configs = target_server.configurations.config
    configurations = []

    for category in AntiCheatConfigurationCategories.objects.filter(
        server_type=target_server.type
    ):
        configurations.append(
            {
                "id": category.id,
                "name": category.name,
                "description": category.description,
                "fields": [
                    {
                        "id": config.id,
                        "type": config.config_type,
                        "name": config.name,
                        "description": config.description,
                        "value": server_configs.get(
                            str(config.id),
                            server_configs.get(
                                str(config.id),
                                config.get_default_value(),
                            ),
                        ),
                    }
                    for config in category.configs.all()
                ],
            }
        )

    return render(
        request,
        "pages/dashboard/configurations.jinja",
        {"configurations": configurations, "error": ""},
    )


@login_required
def render_quicksetup(request: HttpRequest) -> HttpResponse:
    dists_dir = os.path.join(settings.BIN_DIR, "setup_dist")

    if request.method == "POST":
        target_dist = str(request.POST["selected-dist"]).lower()
        supported_dists = os.listdir(dists_dir)

        # Check if the requested distribution exists
        if not target_dist in supported_dists:
            messages.error(request, "Unsupported distribution!")
            return redirect(request.path)

        distribution_path = os.path.join(dists_dir, target_dist, "download.zip")
        if not os.path.isfile(distribution_path):
            messages.error(
                request, f"Failed to download {target_dist.title()} distribution!"
            )
            return redirect(request.path)

        return FileResponse(
            open(distribution_path, "rb"),
            filename=f"{settings.ANTICHEAT_NAME_LONG} {target_dist.title()} Distribution.zip",
        )

    dists = {}
    for dist in os.listdir(dists_dir):
        with open(os.path.join(dists_dir, dist, "content.json"), "r") as file:
            dists[dist.title()] = json.loads(file.read())

    return render(
        request,
        "pages/dashboard/quicksetup.jinja",
        {
            "dists": dists,
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
                    "expires_at": subscription.started_at + subscription.expires_at,
                    "name": subscription.name,
                    "status": (
                        2
                        if not subscription.is_valid_for_now()
                        else subscription.status
                    ),
                }
                for subscription in ServerSubscription.objects.filter(
                    owner=request.user
                )
            ]
        },
    )


@login_required
def render_whitelist(request: HttpRequest) -> HttpResponse:
    add_form = WhitelistForm()
    whitelists: List[Whitelist] = []
    is_whitelist_enabled = True
    target_server: GameServer = None

    try:
        target_server = GameServer.objects.get(
            id=request.session.get("selected_server", -1)
        )
    except GameServer.DoesNotExist:
        messages.error(request, "The selected server does not exists!")
    else:
        whitelists = Whitelist.objects.filter(game_server=target_server).order_by(
            "-created_at"
        )

        is_whitelist_enabled = target_server.get_config_by_id(1)

    if request.method == "POST":
        request_body = request.POST
        if "type" in request_body.keys():
            match request_body["type"]:
                case "add":
                    add_form = WhitelistForm(request_body)
                    if add_form.is_valid():
                        if not is_whitelist_enabled:
                            messages.error(
                                request, "Whitelist configuration is disabled!"
                            )
                            return redirect(request.path)

                        player_name = add_form.cleaned_data["name"]
                        ip = add_form.cleaned_data["ip"]
                        serial = add_form.cleaned_data["serial"]

                        if not target_server:
                            messages.error(request, "Invalid selected server!")
                            return redirect(request.path)

                        # Check if the ip pattern is correct
                        if not utils.isvalid_ip(ip):
                            messages.error(request, "Invalid ip!")
                            return redirect(request.path)

                        # Check if the serial is inequal to 32
                        if len(serial) != 32:
                            messages.error(request, "Invalid Serial!")
                            return redirect(request.path)

                        if Whitelist.objects.filter(
                            Q(game_server=target_server)
                            & (Q(name=player_name) | Q(serial=serial) | Q(ip=ip))
                        ).exists():
                            messages.error(request, "Whitelist already exists!")
                            return redirect(request.path)

                        new_whitelist = Whitelist(
                            name=player_name,
                            ip=ip,
                            serial=serial,
                            game_server=target_server,
                        )
                        new_whitelist.save()
                        messages.success(
                            request, f"{player_name}'s whitelist added successfuly!"
                        )
                    else:
                        messages.error(request, "Empty whitelist!")

                case "delete":
                    if check_request_body_key(request_body, "target-whitelist", int):
                        messages.error(request, "Unexptected error!")
                        return HttpResponseRedirect(request.path)

                    target_whitelist_id = int(request_body["target-whitelist"])
                    try:
                        target_whitelist = Whitelist.objects.get(id=target_whitelist_id)
                    except Whitelist.DoesNotExist:
                        messages.error(request, "Whitelist doesnt exists!")
                        return HttpResponseRedirect(request.path)

                    target_whitelist.delete()
                    messages.success(
                        request,
                        f"Successfuly {target_whitelist.name}'s whitelist deleted!",
                    )

                case "edit":
                    if not (
                        "target-whitelist" in request_body.keys()
                        or "player-serial" in request_body.keys()
                        or "player-ip" in request_body.keys()
                    ):
                        messages.error(request, "Unexptected error!")
                        return HttpResponseRedirect(request.path)

                    if not is_whitelist_enabled:
                        messages.error(request, "Whitelist configuration is disabled!")
                        return redirect(request.path)

                    target_whitelist_id = int(request_body["target-whitelist"])
                    player_serial = request_body["player-serial"]
                    player_ip = request_body["player-ip"]

                    try:
                        target_whitelist = Whitelist.objects.get(id=target_whitelist_id)
                    except Whitelist.DoesNotExist:
                        messages.error(request, "Whitelist doesnt exists!")
                        return HttpResponseRedirect(request.path)

                    # Check if the ip pattern is correct
                    if not utils.isvalid_ip(player_ip):
                        messages.error(request, "Invalid ip!")
                        return redirect(request.path)

                    # Check if the serial is inequal to 32
                    if len(player_serial) != 32:
                        messages.error(request, "Invalid Serial!")
                        return redirect(request.path)

                    target_whitelist.serial = player_serial
                    target_whitelist.ip = player_ip

                    target_whitelist.save()

                    messages.success(
                        request,
                        f"{target_whitelist.name}'s whitelist saved successfuly!",
                    )

    return render(
        request,
        "pages/dashboard/whitelist.jinja",
        {
            "whitelists": [
                {
                    "id": whitelist.id,
                    "name": whitelist.name,
                    "ip": whitelist.ip,
                    "serial": whitelist.serial,
                    "created_on": whitelist.created_at,
                    "last_update_at": (
                        whitelist.last_update_at
                        if whitelist.last_update_at
                        else whitelist.created_at
                    ),
                }
                for whitelist in whitelists
            ],
            "form": add_form,
            "whitelist_disabled": not is_whitelist_enabled,
        },
    )
