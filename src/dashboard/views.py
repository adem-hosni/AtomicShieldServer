import os
import random
import logging
import json
from zipfile import ZipFile
from asgiref.sync import sync_to_async
from django.shortcuts import render, redirect
from django.conf import settings
from django.urls import reverse
from django.db.models import Q
from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponseRedirect,
    FileResponse,
    JsonResponse,
)
import shutil
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from datetime import timedelta
from django.contrib import messages
from django.contrib.humanize.templatetags.humanize import intcomma
from django.contrib.auth.decorators import login_required
from guards import fivem_guard
from utils import check_request_body_key, represent_timedelta_string
from anticheat.models import Ban, DetectionReport
from shared.enums import DetectionType
from .models import (
    Announcements,
    PatchNotes,
    GameServer,
    ServerType,
    ServerStatus,
    ServerSubscription,
)
from anticheat.models import (
    AntiCheatConfigTemplates,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategories,
    Ban,
    DetectionReport,
)
from .forms import AddServerForm
import utils
from typing import Dict, Union, Any
from utils.aseclient import ASEQueryClient, ASEParser


logger = logging.getLogger(__name__)


def dashboard_callback(request: HttpRequest, context: Dict[str, Any]):
    WEEKDAYS = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ]

    # 27 because today is included
    twenty_eight_days_ago = now().date() - timedelta(days=27)
    bans_per_day = []

    all_bans = Ban.objects.all()

    for day in range(28):
        current_day = twenty_eight_days_ago + timedelta(days=day)
        next_day = current_day + timedelta(days=1)
        ban_count = all_bans.filter(
            banned_at__gte=current_day, banned_at__lt=next_day
        ).count()

        bans_per_day.append(ban_count)

    detections_stats = []
    all_detections = DetectionReport.objects.all()
    for detection_type, label in DetectionType.choices:
        count = all_detections.filter(detection_type=detection_type).count()
        detections_stats.append(
            {
                "title": label,
                "description": intcomma(str(count)),
                "value": (count / max(1, all_detections.count())) * 100,
            }
        )

    seven_days_ago = now() - timedelta(days=7)
    total_subscriptions = ServerSubscription.objects.count()
    total_bans = all_bans.count()
    
    bans_last_7_days = all_bans.filter(banned_at__gte=seven_days_ago).count()
    subscriptions_last_7_days = ServerSubscription.objects.filter(started_at__gte=seven_days_ago).count()

    last_week_subs = (subscriptions_last_7_days / total_subscriptions) * 100 if total_subscriptions else 0
    last_week_bans = (bans_last_7_days / total_bans) * 100 if total_bans else 0


    context.update(
        {
            "chart": json.dumps(
                {
                    "labels": [WEEKDAYS[day % 7] for day in range(1, 28)],
                    "datasets": [
                        {
                            "label": "Week 3",
                            "type": "line",
                            "data": bans_per_day,
                            "borderColor": "var(--color-primary-500)",
                        },
                    ],
                }
            ),
            "progress": sorted(detections_stats, key=lambda x: x["value"], reverse=True),
            "detection_count": all_detections.count(),
            "stats": [
                {
                    "title": "Total Subscriptions",
                    "metric": total_subscriptions,
                    "footer": mark_safe(
                        f'<strong class="text-green-700 font-semibold dark:text-green-400">+{intcomma(f"{last_week_subs:.02f}")}%</strong>&nbsp;progress from last 7 days'
                    ),
                },
                {
                    "title": "Total Bans",
                    "metric": total_bans,
                    "footer": mark_safe(
                        f'<strong class="text-green-700 font-semibold dark:text-green-400">+{intcomma(f"{last_week_bans:.02f}")}%</strong>&nbsp;progress from last 7 days'
                    ),
                },
            ]
        }
    )
    return context


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
                    "announcement": mark_safe(announcement.announcement),
                    "dataid": announcement.id,
                    "seen": announcement.seens.filter(id=request.user.id).exists(),
                }
            )
        announcements.reverse()

    bans = 0
    for ban in Ban.objects.all():
        if not ban.is_expired:
            bans += 1

    return render(
        request,
        "pages/dashboard/main.jinja",
        {
            "username": request.user.username,
            "announcements": announcements,
            "online_scanners": len(fivem_guard.engines),
            "banned_players": bans,
            "detection_count": DetectionReport.objects.count(),
        },
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
        bans = Ban.objects.filter(game_server=target_server).order_by("-banned_at")

    if request.method == "POST":
        if not target_server:
            messages.error("The selected server does not exists!")
            return redirect(request.path)

        ban_request = request.POST
        if not check_request_body_key(ban_request, "type", str):
            messages.error(request, "Invalid request")
            return redirect(request.path)

        if not check_request_body_key(ban_request, "target-ban", str):
            messages.error(request, "Specify the target ban")
            return redirect(request.path)

        try:
            target_ban = Ban.objects.get(
                game_server=target_server, id=int(ban_request["target-ban"])
            )
        except Ban.DoesNotExist:
            messages.error(request, "The ban does not exists!")
            return redirect(request.path)

        if target_ban.is_expired:
            messages.error(request, "You cannot modify expired ban!")
            return redirect(request.path)

        match ban_request["type"]:
            case "ban":
                if not target_ban.active:
                    target_ban.active = True
                    target_ban.save()
                    messages.success(request, "Player banned successfuly!")
                else:
                    messages.error(request, "Player already banned!")

            case "unban":
                if target_ban.active:
                    target_ban.active = False
                    target_ban.save()
                    messages.success(request, "Player unbanned successfuly!")
                else:
                    messages.error(request, "Player already unbanned!")
            case _:
                messages.error(request, "Unrecognized operation type for the ban!")

    return render(
        request,
        "pages/dashboard/bans.jinja",
        {
            "bans": [
                {
                    "id": ban.id,
                    "username": ban.hwid.username,
                    "banned_at": ban.banned_at,
                    "duration": represent_timedelta_string(ban.duration),
                    "status": (
                        2 if ban.is_expired else int(ban.active)
                    ),  # 0: Disabled, 1: Banned, 2: Expired
                    "reason": ban.reason, 
                    "screenshot_url": ban.report.screenshot.url if ban.report.screenshot else "",
                    "license": ban.hwid.fivem_license,
                    "steam": ban.hwid.steam,
                    "discord_id": ban.hwid.discord_id,
                }
                for ban in bans
            ],
            "detections": DetectionReport.objects.count(),
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
                    "patchnotes": mark_safe(patchnote.patchnotes),
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
                    ip = add_form.cleaned_data["ip"].strip()
                    port = "80"
                    name = str(add_form.cleaned_data["server_name"]).strip()
                    server_type = add_form.cleaned_data["server_type"]
                    subscription_id = add_form.cleaned_data["subscription"]

                    # Check if the server_type and the subscription_id are of type string
                    if isinstance(server_type, str) or isinstance(subscription_id, str):
                        if not server_type.isnumeric():
                            messages.error(request, "Invalid server type")
                            return redirect(request.path)

                        if not subscription_id.isnumeric():
                            messages.error(request, "Invalid Subscription")
                            return redirect(request.path)

                        server_type = int(server_type)
                        subscription_id = int(subscription_id)

                    # Check if the port is of type string
                    if isinstance(port, str):
                        if not port.isnumeric():
                            messages.error(request, "Invalid server port")
                            return redirect(request.path)
                        port = int(port)

                    # Check port range (1 -> 65535)
                    if not (port >= 1 and port <= 65535):
                        messages.error(request, "Invalid port range")
                        return redirect(request.path)

                    if not len(name):
                        messages.error(request, "Invalid server name")
                        return redirect(request.path)

                    if len(name) > 32:
                        messages.error(
                            request, "Server name must be less than 32 characters"
                        )
                        return redirect(request.path)

                    # Check if the ip is correct
                    if not utils.isvalid_ip(ip):
                        messages.error(request, "Invalid IPV4 IP")
                        return redirect(request.path)

                    # Check the selected subscription health
                    try:
                        subscription = ServerSubscription.objects.get(
                            id=subscription_id
                        )
                    except ServerSubscription.DoesNotExist:
                        messages.error(request, "Invalid subscription selected")
                        logger.warning(
                            f"{request.user.username} trying to use a non existing subscription (used subscription id: {subscription_id})!"
                        )
                        return redirect(request.path)

                    # Check the subscription's owner
                    if subscription.owner != request.user:
                        logger.warning(
                            f"{request.user.username} trying to use {subscription.owner.username}'s subscription!"
                        )
                        messages.error(request, "Not your fucking subscription!")
                        return redirect(request.path)

                    if not subscription.is_valid_for_now():
                        logger.warning(
                            f"{request.user.username} trying to use expired subscription (subscription id: {subscription_id})!"
                        )
                        messages.error(request, "Expired Subscription")
                        return redirect(request.path)

                    # Check if the server address already used
                    if GameServer.objects.filter(
                        ip=ip, port=port, type=server_type
                    ).exists():
                        messages.error(request, "Server Address Already been used!")
                        return redirect(request.path)

                    # Check if the server name exists in the owned servers
                    if GameServer.objects.filter(
                        name=name, owner=request.user, type=server_type
                    ).exists():
                        messages.error(request, "Server name already used!")
                        return redirect(request.path)

                    if (
                        server_type != ServerType.FIVEM.value
                        and server_type != ServerType.FIVEM.value
                    ):
                        messages.error(request, "Invalid server type!")
                        return redirect(request.path)

                    # Generate a license key for the server
                    license_key = utils.generate_key(4)

                    # Check if key already exists, regenerate it
                    if ServerSubscription.objects.filter(key=license_key).exists():
                        license_key = utils.generate_key(4)

                    # Create the server configs
                    configurations = AntiCheatConfigurations()
                    for config in AntiCheatConfigTemplates.objects.filter(
                        server_type=server_type
                    ):
                        configurations.config[config.id] = config.default_value
                    configurations.save()

                    new_server = GameServer.objects.create(
                        ip=ip,
                        port=port,
                        name=name,
                        owner=request.user,
                        configurations=configurations,
                        type=server_type,
                        status=ServerStatus.online,
                    )
                    new_server.subscriptions.add(subscription)
                    request.session["selected_server"] = new_server.id
                    logger.info(
                        f"Added New {ServerType(server_type)} Server {ip}:{port} from {request.user.username}, license key: ({license_key})"
                    )
                    return redirect(request.path)
            case "edit":
                if not (
                    "target-server" in request_body.keys()
                    or "server-name" in request_body.keys()
                    or "server-ip" in request_body.keys()
                    or "server-port" in request_body.keys()
                ):
                    messages.error(request, "Unexpected error!")
                    return redirect(request.path)

                new_name = request_body["server-name"].strip()
                new_ip = request_body["server-ip"].strip()
                new_port = 80

                if not utils.isvalid_ip(new_ip):
                    messages.error(request, "Invalid ip address")
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
            case "renew":
                if (
                    not "server" in request_body.keys()
                    or not "subscription" in request_body.keys()
                ):
                    messages.error(request, "Unexpected error!")
                    return redirect(request.path)

                try:
                    target_server = GameServer.objects.get(
                        id=int(request_body["server"]), owner=request.user
                    )
                except GameServer.DoesNotExist:
                    messages.error(request, "Selected Server Does Not Exists!")
                    return redirect(request.path)

                try:
                    selected_subscription = ServerSubscription.objects.get(
                        id=int(request_body.get("subscription", -1)), owner=request.user
                    )
                except ServerSubscription.DoesNotExist:
                    messages.error(
                        request, "The Selected Subscription does not exists!"
                    )
                    return redirect(request.path)

                if selected_subscription.type != target_server.type:
                    messages.error(
                        request,
                        "The Selected Subscription doesn't match the server type!",
                    )
                    return redirect(request.path)

                if not selected_subscription.is_valid_for_now():
                    messages.error(request, "Expired Subscription!")
                    return redirect(request.path)

                target_server.subscriptions.add(selected_subscription)
                target_server.save()
                messages.success(request, "Successfuly Subscription Renewed!")

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
                    "status": fivem_guard.is_server_running(server.ip),
                    "subscription_status": server.subscriptions.last() or "Not Found",
                    "expired": (
                        not server.subscriptions.last().is_valid_for_now()
                        if server.subscriptions.last()
                        else False
                    ),
                }
                for server in servers.reverse()
            ],
            "subscriptions": [
                ({"name": subscription.name, "id": subscription.id})
                for subscription in ServerSubscription.objects.filter(
                    owner=request.user
                )
                if subscription.is_valid_for_now()
                and not subscription.game_servers.count()
            ],
            "active": request.session.get("selected_server", -1),
        },
    )

@login_required
def select_server(request: HttpRequest) -> HttpResponse:
    request_body: Dict[str, Union[bool, str]] = request.body.decode()

    # Check the request_body is a json
    if not len(request_body):
        logger.error("DASHBOARD - UNEXPECTED ERROR: Empty request body")
        return HttpResponse(json.dumps({"success": False}))

    request_body = json.loads(request_body)

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

        new_key = utils.generate_key(5)
        if new_key == target_server.key:
            new_key = utils.generate_key(5)
        target_server.key = new_key

        logger.info(
            f'"{request.user.username}" has refreshed his server "{target_server.name}" key'
        )
        messages.success(request, "Key refreshed Successfuly!")

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
        if check_request_body_key(request.POST, "type", str):
            request_body = request.POST
            match request_body["type"]:
                case "save":
                    for config_id, config_value in request.POST.items():
                        if config_id != "csrfmiddlewaretoken" and config_id != "type":
                            target_server.configurations.config[config_id] = (
                                config_value
                            )
                    target_server.configurations.save()
                    messages.success(request, "Configurations saved successfuly!")
                    return redirect(request.path)
                case "reset":
                    target_server.configurations.config = {}
                    target_server.configurations.save()
                    messages.success(request, "Configurations reset successfuly!")
        else:
            messages.error(request, "Invalid request!")

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

        distribution_path = os.path.join(dists_dir, target_dist, "download_template.zip")
        if not os.path.isfile(distribution_path):
            messages.error(
                request, f"Failed to download {target_dist.title()} distribution!"
            )
            return redirect(request.path)
        
        temp_zip_path = os.path.join(dists_dir, target_dist, f"temp-{random.randint(10, 100)}.zip")
        shutil.copyfile(distribution_path, temp_zip_path)

        if os.path.isfile(temp_zip_path):
            key_path = "AtomicShield/server.key"
            
            if os.path.isfile(temp_zip_path):
                with ZipFile(distribution_path, "r") as zip_read, ZipFile(temp_zip_path, "w") as zip_write:
                    for item in zip_read.infolist():
                        if item.filename != key_path:
                            zip_write.writestr(item, zip_read.read(item.filename))
                        else:
                            server_key = "<YOUR ATOMICSHIELD SERVER KEY>"
                            try:
                                target_server = GameServer.objects.get(
                                    id=request.session.get("selected_server", -1), owner=request.user
                                )
                                server_key = target_server.key
                            except GameServer.DoesNotExist:
                                ...

                            zip_write.writestr(key_path, server_key)
                distribution_path = temp_zip_path

        return FileResponse(
            open(distribution_path, "rb"),
            filename=f"{settings.ANTICHEAT_NAME_LONG}-{target_dist}.zip",
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
    if request.method == "POST":
        subscription_key = request.POST.get("key", "").strip()
        if not len(subscription_key):
            messages.error(request, "Empty Subscription Key")
            return redirect(request.path)

        try:
            subscription = ServerSubscription.objects.get(key=subscription_key)
        except ServerSubscription.DoesNotExist:
            logger.warning(
                f'"{request.user.username}" trying to redeem incorrect subscription key!'
            )
            messages.error(request, "Invalid Redeemed Key.")
            return redirect(request.path)

        if subscription.owner:
            logger.warning(
                f'"{request.user.username}" trying to redeem a subscription key used by "{subscription.owner.username}"'
            )
            messages.error(request, "Subscription Key already redeemed")
            return redirect(request.path)

        if not subscription.is_valid_for_now():
            logger.warning(
                f'"{request.user.username}" trying to redeem expired subscription key!'
            )
            messages.error(request, "Expired Subscription")
            return redirect(request.path)

        if subscription.game_servers.count():
            logger.warning(
                f'"{request.user.username}" trying to redeem used subscription key!'
            )
            messages.error(request, "This Subscription is already in-use.")
            return redirect(request.path)

        logger.info(
            f'"{request.user.username}" reedemed "{subscription.name}" key ({subscription_key})'
        )

        subscription.owner = request.user
        subscription.started_at = now()
        subscription.save()

        messages.success(request, "Key Reedemed Successfuly!")

    return render(
        request,
        "pages/dashboard/subscriptions.jinja",
        {
            "subscriptions": [
                {
                    "type": subscription.type,
                    "started_at": subscription.started_at,
                    "expires_at": subscription.started_at + subscription.expires_at,
                    "remaining": subscription.remaining,
                    "name": subscription.name,
                    "status": (
                        2
                        if not subscription.is_valid_for_now()
                        else subscription.status
                    ),
                }
                for subscription in ServerSubscription.objects.filter(
                    owner=request.user
                ).order_by("-started_at")
            ]
        },
    )

@login_required
async def render_players(request: HttpRequest) -> HttpResponse:
    players = []
    message = ""
    try:
        server_id = await sync_to_async(request.session.get)("selected_server", -1)
        target_server = await GameServer.objects.aget(
            owner=request.user,
            id=server_id,
        )
    except GameServer.DoesNotExist:
        messages.error(request, "The selected server does not exists!")
    else:
        server = fivem_guard.get_server_by_ip(target_server.ip)
        if server:
            players = (await server.request_status())["players"]
        else:
            message = "Server is offline"

    if request.method == "POST":
        response = {"success": False, "message": ""}
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

        player_id = request_body.get("playerid")
        if player_id:
            player_ip = None
            for player in players:
                if player["id"] == player_id:
                    player_ip = player["ip"]
                    break
            if player_ip:
                engine = fivem_guard.get_scanner_by_ip(player_ip)
                if engine:
                    match request_body.get("type"):
                        case "request_screenshot":
                            image_path = await engine.get_screenshot()
                            if image_path:
                                logger.info(
                                    f"Successfuly screenshot requested from {engine.hwid.username}"
                                )
                                response["success"] = True
                                response["url"] = image_path
                            else:
                                response["message"] = (
                                    "Cannot retreive screenshot from the target player!"
                                )
                                # messages.error(request, "Cannot retreive screenshot from the target player!")

                        case "kick":
                            if not (await engine.kick()):
                                response["message"] = (
                                    "Player is not connected to your server."
                                )

                        case _:
                            response["message"] = "Invalid data requested!"
                else:
                    response["message"] = "Cannot retreive the target player!"

            else:
                response["message"] = "Cannot retreive the target player!"
        else:
            response["message"] = "Invalid player!"
        return JsonResponse(response)

    current_page = int(request.GET.get("page", 1)) - 1

    searched_players = []
    search_text = request.GET.get("search", "").strip()
    if len(search_text):
        for index in range(len(players) - 1, -1, -1):
            player = players[index]
            if (
                search_text.lower() in player["name"].lower()
                or search_text in player["id"]
            ):
                searched_players.append(player)

    if len(search_text.strip()):
        players = searched_players

    page_size = len(players) if len(players) < 35 else 35

    max_pages = len(players) // page_size if len(players) > page_size else len(players)

    if len(search_text):
        current_page = 0

    if current_page < 0:
        current_page = 0
    if current_page > max_pages:
        current_page = max_pages

    players_to_show = players[
        page_size * current_page : (page_size * current_page) + page_size
    ]

    # Increment the current_page for the ui
    current_page += 1

    return await sync_to_async(render)(
        request,
        "pages/dashboard/players.jinja",
        {
            "players": players_to_show,
            "pages": len(players_to_show),
            "current_page": current_page,
            "show_previous": current_page > 1,
            "show_next": current_page < max_pages,
            "current_page": current_page,
            "page_range": range(1, max_pages + 1),
            "max_pages": max_pages,
            "message": (
                "No Online Players to show"
                if not len(players_to_show) and not len(message)
                else message
            ),
        },
    )
