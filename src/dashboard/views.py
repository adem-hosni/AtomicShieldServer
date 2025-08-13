import os
import random
import logging
import json
from zipfile import ZipFile
from asgiref.sync import sync_to_async
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
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
from rest_framework.decorators import (
    authentication_classes,
    permission_classes,
    api_view,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from datetime import timedelta
from django.contrib import messages
from django.contrib.humanize.templatetags.humanize import intcomma
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.models import User
from guards import fivem_guard
from utils import check_request_body_key, represent_timedelta_string
from anticheat.models import Ban, DetectionReport, HWID
from shared.enums import DetectionType
from .models import (
    Announcements,
    PatchNotes,
    GameServer,
    ServerType,
    ServerStatus,
    ServerSubscription,
    GameServerModerator,
    ModeratorInviteToken,
)
from anticheat.models import (
    AntiCheatConfigTemplate,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategory,
    Ban,
    DetectionReport,
)
from .forms import AddServerForm
import utils
from typing import Dict, Union, Any
from utils.aseclient import ASEQueryClient, ASEParser
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie


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
    subscriptions_last_7_days = ServerSubscription.objects.filter(
        started_at__gte=seven_days_ago
    ).count()

    last_week_subs = (
        (subscriptions_last_7_days / total_subscriptions) * 100
        if total_subscriptions
        else 0
    )
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
            "progress": sorted(
                detections_stats, key=lambda x: x["value"], reverse=True
            ),
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
            ],
        }
    )
    return context


@login_required
def render_dashboard_redirect(request: HttpRequest) -> HttpResponse:
    return redirect(reverse("main"))


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def dashboard_overview(request: HttpRequest) -> JsonResponse:
    # System status
    system_status = {
        "value": 100,
        "badge": {
            "text": "All Systems",
            "variant": "default",
            "pulse": True,
        },
    }

    # Servers Data
    user_servers = GameServer.get_user_servers(request.user)
    servers_count = user_servers.count()
    online_servers_count = sum([server.is_online for server in user_servers])

    total_servers_data = {
        "value": servers_count,
        "subtitle": f"{online_servers_count} online, {servers_count - online_servers_count} offline",
        "trend": {
            "value": "+1 this week",
            "isPositive": True,
        },
    }

    # Network Players
    network_players = {
        "value": fivem_guard.total_engines,
        "subtitle": "Across all servers",
        "trend": {"value": "+45 today", "isPositive": True},
    }

    # Threat Level
    threats_today = DetectionReport.objects.filter(
        detected_at__date=timezone.now().date()
    ).count()
    threat_level = {
        "value": threats_today,
        "subtitle": (
            "No active threats" if threats_today == 0 else f"Active threats detected"
        ),
        "badge": {
            "text": "SAFE" if threats_today == 0 else "ELEVATED",
            "variant": "outline" if threats_today == 0 else "destructive",
            "pulse": True,
        },
    }

    dashboard_stats_data = {
        "systemStatus": system_status,
        "totalServers": total_servers_data,
        "networkPlayers": network_players,
        "threatLevel": threat_level,
    }

    servers_data = [
        {
            "id": server.id,
            "name": server.name,
            "description": "Server Description",
            "playerCount": server.active_player_count,
            "status": "Online" if server.is_online else "Offline",
            "statusColor": "green" if server.is_online else "gray",
            "imageUrl": 'server.configurations.config.get("server_image", "")',
        }
        for server in user_servers
    ]

    # Select last detections
    recent_security_events = DetectionReport.objects.order_by("-detected_at")[:5]
    security_events_data = [
        {
            "action": "Cheat Detection",
            "user": event.hwid.username,
            "time": event.detected_at.strftime("%Y-%m-%d %H:%M:%S"),
            "severity": "high",
        }
        for event in recent_security_events
    ]

    # Threat assessment data
    threat_assessment_data = {
        "detectionRate": f"{DetectionReport.objects.count() / HWID.objects.count() * 100 if HWID.objects.count() > 0 else 0}%",
        "falsePositives": "0.1%",
        "responseTime": "12ms",
    }

    # Global Stats
    global_stats_data = {
        "totalBans24h": Ban.objects.filter(
            banned_at__date=timezone.now().date()
        ).count(),
        "kicks24h": 0,
        "warnings24h": 0,
        "cleanSessions": random.randint(50, 100),
    }

    # User Subscriptions
    subscriptions_data = [
        {
            "id": subscription.id,
            "name": subscription.name,
            "plan": subscription.plan,
            "status": (
                "used"
                if subscription.is_used
                else "active" if subscription.is_valid_for_now() else "expired"
            ),
            "period": utils.represent_timedelta_string(subscription.expires_at),
        }
        for subscription in ServerSubscription.objects.filter(owner=request.user)
    ]

    # Server Types
    server_types = [
        {
            "id": ServerType.FIVEM.value,
            "name": ServerType.FIVEM.label,
            "description": "FiveM FxServer",
        }
    ]

    return Response(
        {
            "success": True,
            "message": "",
            "error": "",
            "data": {
                "stats": dashboard_stats_data,
                "servers": servers_data,
                "recentActivity": security_events_data,
                "threatAssessment": threat_assessment_data,
                "globalStats": global_stats_data,
                "subscriptions": subscriptions_data,
                "serverTypes": server_types,
            },
        }
    )


@api_view(["POST", "GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_server(request: HttpRequest) -> Response:
    ip = request.data.get("serverIp", "").strip()
    port = "80"
    name = str(request.data.get("serverName", "")).strip()
    server_type = request.data.get("serverType", ServerType.FIVEM.value)
    subscription_id = request.data.get("subscriptionId", None)

    # Check if the server_type and the subscription_id are of type string
    if isinstance(server_type, str) or isinstance(subscription_id, str):
        if not server_type.isnumeric():
            messages.error(request, "Invalid server type")
            logger.warning(
                f"{request.user.username} trying to use an invalid server type ({server_type})!"
            )
            return Response({"success": False, "message": "Invalid server type"})

        if not subscription_id.isnumeric():
            messages.error(request, "Invalid Subscription")
            logger.warning(
                f"{request.user.username} trying to use an invalid subscription id ({subscription_id})!"
            )
            return Response({"success": False, "message": "Invalid Subscription"})

        server_type = int(server_type)
        subscription_id = int(subscription_id)

    # Check if the port is of type string
    if isinstance(port, str):
        if not port.isnumeric():
            logger.warning(
                f"{request.user.username} trying to use an invalid port ({port})!"
            )
            return Response({"success": False, "message": "Invalid server port"})
        port = int(port)

    # Check port range (1 -> 65535)
    if not (port >= 1 and port <= 65535):
        logger.warning(
            f"{request.user.username} trying to use an invalid port range ({port})!"
        )
        return Response({"success": False, "message": "Invalid port range"})

    if not len(name):
        logger.warning(f"{request.user.username} trying to use an empty server name!")
        return Response({"success": False, "message": "Invalid server name"})

    if len(name) > 64:
        logger.warning(
            f"{request.user.username} trying to use a server name longer than 64 characters ({name})!"
        )
        return Response(
            {"success": False, "message": "Server name must be less than 64 characters"}
        )

    # Check if the ip is correct
    if not utils.isvalid_ip(ip):
        logger.warning(
            f"{request.user.username} trying to use an invalid IPV4 IP ({ip})!"
        )
        return Response({"success": False, "message": "Invalid IPV4 IP"})

    # Check the selected subscription health
    try:
        subscription = ServerSubscription.objects.get(id=subscription_id)
    except ServerSubscription.DoesNotExist:
        logger.warning(
            f"{request.user.username} trying to use a non existing subscription (used subscription id: {subscription_id})!"
        )
        return Response({"success": False, "message": "Invalid subscription selected"})

    # Check the subscription's owner
    if subscription.owner != request.user:
        logger.warning(
            f"{request.user.username} trying to use {subscription.owner.username}'s subscription!"
        )
        return Response({"success": False, "message": "Not your subscription!"})

    if not subscription.is_valid_for_now():
        logger.warning(
            f"{request.user.username} trying to use expired subscription (subscription id: {subscription_id})!"
        )
        return Response({"success": False, "message": "Expired Subscription"})

    # Check if the subscription is already used by a server
    if subscription.is_used:
        logger.warning(
            f"{request.user.username} trying to use an already used subscription (subscription id: {subscription_id})!"
        )
        return Response(
            {"success": False, "message": "Subscription already used by a server"}
        )

    # Check if the server address already used
    if GameServer.objects.filter(ip=ip, port=port, type=server_type).exists():
        logger.warning(
            f"{request.user.username} trying to use an already used server address ({ip}:{port})!"
        )
        return Response(
            {"success": False, "message": "Server Address Already been used!"}
        )

    # Check if the server name exists in the owned servers
    if GameServer.objects.filter(
        name=name, owner=request.user, type=server_type
    ).exists():
        logger.warning(
            f"{request.user.username} trying to use an already used server name ({name})!"
        )
        return Response({"success": False, "message": "Server name already used!"})

    if server_type != ServerType.FIVEM.value and server_type != ServerType.FIVEM.value:
        logger.warning(
            f"{request.user.username} trying to use an unsupported server type ({server_type})!"
        )
        return Response({"success": False, "message": "Unsupported server type"})

    # Generate a license key for the server
    license_key = utils.generate_key(4)

    # Check if key already exists, regenerate it
    if ServerSubscription.objects.filter(key=license_key).exists():
        license_key = utils.generate_key(4)

    # Create the server configs
    configurations = AntiCheatConfigurations()
    for config in AntiCheatConfigTemplate.objects.filter(server_type=server_type):
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
    return Response(
        {
            "success": True,
            "data": {
                "name": new_server.name,
            },
        }
    )




@api_view(["POST", "GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def list_announcements(request: HttpRequest) -> HttpResponse:
    """
    API endpoint to list announcements (GET) and mark them as seen (POST).
    Returns data in the format expected by the React NewsPage.
    """

    if request.method == "POST":
        try:
            data = json.loads(request.body.decode())
        except Exception as err:
            logger.error(f"Failed to parse request body: {err}")
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

        announcement_id = data.get("seenAnnouncement")
        if announcement_id:
            try:
                ann = Announcements.objects.get(id=int(announcement_id))
                ann.seens.add(request.user)
                ann.save()
                return JsonResponse({"success": True})
            except Announcements.DoesNotExist:
                return JsonResponse({"success": False, "error": "Announcement not found"}, status=404)

        return JsonResponse({"success": False, "error": "Missing seenAnnouncement field"}, status=400)

    elif request.method == "GET":
        announcements = []
        for ann in Announcements.objects.all().order_by("-date"):
            announcements.append({
                "id": str(ann.id),
                "title": ann.title,
                "content": ann.announcement,  # Could keep HTML/Markdown
                "author": {
                    "name": getattr(ann.author, "username", str(ann.author)),
                    "role": getattr(ann.author, "role", "Official"),
                    "avatar": getattr(ann.author, "avatar", None),
                },
                "publishedAt": ann.date.isoformat(),
                "category": getattr(ann, "category", "announcement"),
                "isPinned": getattr(ann, "is_pinned", False),
                "isImportant": getattr(ann, "is_important", False),
                "views": ann.seens.count(),
            })

        return JsonResponse({"success": True, "data": announcements}, safe=False)

    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)

@api_view(["POST", "GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def server_dashboard(request: HttpRequest, server_id: int) -> Response:
    try:
        game_server = GameServer.objects.get(
            Q(id=server_id)
            & (
                Q(owner=request.user)
                | Q(moderators__user=request.user, moderators__status="active")
            )
        )
    except GameServer.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to access a non-existing server ({server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The selected server does not exist or you do not have permission to access it.",
            }
        )
    except Exception:
        logger.exception(
            f"An unexpected error occurred while accessing server {server_id} for user {request.user.username}."
        )
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred while accessing the server.",
            }
        )

    server_info = {
        "id": game_server.id,
        "name": game_server.name,
        "ip": game_server.ip,
        "description": "Server Description",
        "playerCount": game_server.active_player_count,
        "maxPlayers": game_server.active_player_count,
        "uptime": 0,
    }

    server_stats = {
        "currentPlayers": {
            "value": game_server.active_player_count,
            "trend": {"value": "+5 today", "isPositive": True},
        },
        "peakPlayers": {
            "value": game_server.active_player_count,  # TODO: This should be replaced with actual peak player count logic
            "trend": {"value": "+10 this week", "isPositive": True},
        },
        "totalBans": {
            "value": Ban.objects.filter(game_server=game_server).count(),
            "trend": {
                "value": f"+{Ban.objects.filter(game_server=game_server, banned_at__date=timezone.now().date()).count()} today",
                "isPositive": True,
            },
        },
    }

    return Response(
        {
            "success": True,
            "data": {
                "serverInfo": server_info,
                "stats": server_stats,
                "license": {
                    "key": game_server.key,
                    "expirationDate": (
                        represent_timedelta_string(
                            game_server.subscriptions.last().expires_at
                        )
                        if game_server.subscriptions.exists()
                        else "N/A"
                    ),
                    "daysUntilExpiration": (
                        game_server.subscriptions.last().expires_at.days
                        if game_server.subscriptions.exists()
                        else -1
                    ),
                    "status": (
                        "active"
                        if game_server.subscriptions.exists()
                        and game_server.subscriptions.last().is_valid_for_now()
                        else "expired"
                    ),
                },
            },
            "message": "Server dashboard retrieved successfully.",
        }
    )


@api_view(["POST", "GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def list_servers(request: HttpRequest) -> Response:
    """
    List all servers owned by the user.
    """
    user = request.user
    game_servers = GameServer.get_user_servers(request.user)
    servers = []

    for server in game_servers:
        servers.append(
            {
                "id": server.id,
                "name": server.name,
                "ip": server.ip,
                "status": "active" if server.is_online else "inactive",
                "subscriptionPlan": (
                    server.subscriptions.last().plan
                    if server.subscriptions.exists()
                    else "None"
                ),
                "createdAt": "",
                "imageUrl": "",
            }
        )

    return Response(
        {
            "success": True,
            "data": {"servers": servers},
            "message": "Servers retrieved successfully.",
        }
    )


@api_view(["POST", "GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def list_bans(request: HttpRequest, server_id: int) -> Response:
    try:
        target_server = GameServer.get_for_user(server_id, request.user)
    except GameServer.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to access bans of a non-existing server ({server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The selected server does not exist or you do not have permission to access it.",
            }
        )
    except Exception:
        logger.exception(
            f"An unexpected error occurred while accessing bans for server {server_id} for user {request.user.username}."
        )
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred while accessing the server.",
            }
        )

    bans = Ban.objects.filter(game_server=target_server).order_by("-banned_at")

    return Response(
        {
            "success": True,
            "data": {
                "bans": [
                    {
                        "id": f"#{ban.id}",
                        "banId": f"#{ban.id}",
                        "playerId": f"#{ban.hwid.id}",
                        "steamId": ban.hwid.steam,
                        "playerName": ban.hwid.username,
                        "evidenceUrl": (
                            request.build_absolute_uri(ban.report.screenshot.url)
                            if ban.report.screenshot
                            else ""
                        ),
                        "bannedAt": ban.banned_at.strftime("%Y-%m-%d %H:%M:%S"),
                        "firstJoin": ban.banned_at.strftime(
                            "%Y-%m-%d %H:%M:%S"
                        ),  # TODOZ: Implement first join logic
                        "expiresAt": None,
                        "adminName": "zebi",
                        "reason": ban.reason,
                        "isActive": ban.active,
                        "evidence": True,
                        "status": "Peramnent",
                        "serverId": target_server.id,
                        "appealStatus": "approved",  # TODO: Implement appeal status logic
                        "report": {},
                    }
                    for ban in bans
                ],
                "totalCount": bans.count(),
                "activeCount": bans.filter(active=True).count(),
            },
        }
    )


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def unban_player(request: HttpRequest, server_id: int) -> Response:
    ban_id = request.data.get("banId", "").strip()
    if "#" in ban_id:
        ban_id = int(ban_id[1:])
    try:
        target_ban = Ban.objects.get(id=ban_id)
    except Ban.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to unban a non-existing ban ({ban_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The ban does not exist or you do not have permission to access it.",
            }
        )

    if target_ban.game_server.id != server_id:
        logger.warning(
            f"{request.user.username} tried to unban a ban from a different server (ban_id: {ban_id}, server_id: {server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The ban does not belong to the specified server.",
            }
        )

    if not target_ban.active:
        logger.info(
            f"{request.user.username} tried to unban an already inactive ban (ban_id: {ban_id})!"
        )
        return Response({"success": True, "message": "The ban is already inactive."})

    target_ban.active = False
    target_ban.save()

    logger.info(
        f"{request.user.username} successfully unbanned player {target_ban.hwid.username} (ban_id: {ban_id})!"
    )
    return Response(
        {
            "success": True,
            "message": "Player unbanned successfully.",
        }
    )


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def ban_player(request: HttpRequest, server_id: int) -> Response:
    ban_id = request.data.get("banId", "").strip()

    if "#" in ban_id:
        ban_id = int(ban_id[1:])
    try:
        target_ban = Ban.objects.get(id=ban_id)
    except Ban.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to ban a non-existing ban ({ban_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The ban does not exist or you do not have permission to access it.",
            }
        )

    if target_ban.game_server.id != server_id:
        logger.warning(
            f"{request.user.username} tried to ban a ban from a different server (ban_id: {ban_id}, server_id: {server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The ban does not belong to the specified server.",
            }
        )

    if target_ban.active:
        logger.info(
            f"{request.user.username} tried to ban an already active ban (ban_id: {ban_id})!"
        )
        return Response({"success": True, "message": "The ban is already active."})

    target_ban.active = True
    target_ban.save()

    logger.info(
        f"{request.user.username} successfully banned player {target_ban.hwid.username} (ban_id: {ban_id})!"
    )
    return Response(
        {
            "success": True,
            "message": "Player banned successfully.",
        }
    )


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def list_configurations(request: HttpRequest, server_id: int) -> Response:
    try:
        game_server = GameServer.objects.get(owner=request.user, id=server_id)
    except GameServer.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to access configurations of a non-existing server ({server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The selected server does not exist or you do not have permission to access it.",
            }
        )
    except Exception:
        logger.exception(
            f"An unexpected error occurred while accessing configurations for server {server_id} for user {request.user.username}."
        )
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred while accessing the server.",
            }
        )

    return Response(
        {
            "success": True,
            "data": {
                "lastUpdated": "",
                "updatedBy": "",
                "anticheat": {
                    "categories": [
                        {
                            "id": category.id,
                            "label": category.name,
                            "description": "category.",
                            "sections": [
                                {
                                    "id": section.id,
                                    "title": section.title,
                                    "subtitle": section.subtitle,
                                    "icon": section.icon,
                                    "configurations": [
                                        {
                                            "id": str(config.id),
                                            "type": config.config_type,
                                            "title": config.name,
                                            "subtitle": config.subtitle,
                                            "tip": config.tip,
                                            "value": game_server.configurations.config.get(
                                                config.id, config.default_value
                                            ),
                                            "icon": config.icon,
                                        }
                                        for config in section.configurations.all()
                                    ],
                                }
                                for section in category.sections.all()
                            ],
                        }
                        for category in AntiCheatConfigurationCategory.objects.filter(
                            server_type=game_server.type
                        )
                    ]
                },
            },
            "message": "Configurations retrieved successfully.",
        }
    )


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def list_moderators(request: HttpRequest, server_id: int) -> Response:
    try:
        target_server = GameServer.get_for_user(server_id, request.user)
    except GameServer.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to access bans of a non-existing server ({server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The selected server does not exist or you do not have permission to access it.",
            }
        )
    except Exception:
        logger.exception(
            f"An unexpected error occurred while accessing bans for server {server_id} for user {request.user.username}."
        )
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred while accessing the server.",
            }
        )

    moderators = target_server.moderators.all()

    return Response(
        {
            "success": True,
            "message": "",
            "data": {
                "totalCount": moderators.count(),
                "onlineCount": 0,
                "moderators": [
                    {
                        "id": moderator.id,
                        "username": moderator.user.username,
                        "email": "",
                        # "avatar": "",  # TODO
                        "permissions": moderator.permission_summary,
                        "lastLogin": moderator.user.last_login,
                        "status": moderator.status,
                        "joinedAt": moderator.added_at,
                    }
                    for moderator in moderators
                ],
            },
        }
    )


@api_view(["PUT"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_moderators(request: HttpRequest, server_id: int, moderator_id) -> Response:
    try:
        target_server = GameServer.get_for_user(server_id, request.user)
    except GameServer.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to access moderation of a non-existing server ({server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The selected server does not exist or you do not have permission to access it.",
            }
        )
    except Exception:
        logger.exception(
            f"An unexpected error occurred while accessing bans for server {server_id} for user {request.user.username}."
        )
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred while accessing the server.",
            }
        )

    if not target_server.has_permission_for(
        request.user, GameServerModerator.Permissions.CAN_MANAGE_MODERATORS
    ):
        logger.warning(
            f"{request.user.username} wants to update moderator permissions with no permissions (given permissions: {" - ".join(request.data)})"
        )
        return Response(
            {
                "success": False,
                "message": "You dont have an access to perform this operation",
            }
        )

    try:
        target_moderator = GameServerModerator.objects.get(
            id=moderator_id, game_server=target_server
        )
    except GameServerModerator.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to update a non-existing moderator (moderator id: {moderator_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "Target moderator not found",
            }
        )

    if target_moderator.user == target_server.owner:
        logger.warning(
            f"{request.user.username} tried to change server owner permissions"
        )
        return Response(
            {"success": False, "message": "You cant change server owner permissions."}
        )

    if request.user != target_server.owner:
        if GameServerModerator.Permissions.CAN_MANAGE_MODERATORS.value in request.data:
            logger.warning(
                f"{request.user} tried to change CAN_MANAGE_MODERATORS for {target_moderator.user}"
            )
            return Response(
                {
                    "success": False,
                    "message": 'Only Server Owner can change "Manage Moderators" permission',
                }
            )

    # Clear current permissions to reset them
    target_moderator.can_view_analytics = False
    target_moderator.can_view_dashboard = False
    target_moderator.can_kick_players = False
    target_moderator.can_ban_players = False
    target_moderator.can_view_anticheat_logs = False
    target_moderator.can_manage_configuration = False
    target_moderator.can_manage_webhook_settings = False
    target_moderator.can_access_interactive_map = False
    target_moderator.can_access_multi_stream = False
    target_moderator.can_manage_moderators = False

    for permission in request.data or []:
        try:
            existing_permission = "can_" + permission
            setattr(target_moderator, existing_permission, True)
        except AttributeError:
            logger.warning(
                f"{request.user.username} tried to update {target_moderator.user.username} permissions to a non-existing permission named {permission}"
            )
            return Response({"success": False, "message": "Invalid permissions"})

    target_moderator.save()

    logger.info(
        f'{request.user.username} updated {target_moderator.user.username} permissions in "{target_server.name}"'
    )

    return Response(
        {
            "success": True,
            "message": f"{target_moderator.user.username} permissions updated successfuly",
        }
    )

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def set_moderator_action(request: HttpRequest, server_id: int, moderator_id: int) -> Response:
    try:
        target_server = GameServer.get_for_user(server_id, request.user)
    except GameServer.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to access moderation of a non-existing server ({server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The selected server does not exist or you do not have permission to access it.",
            }
        )
    except Exception:
        logger.exception(
            f"An unexpected error occurred while accessing moderation for server {server_id} for user {request.user.username}."
        )
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred while accessing the server.",
            }
        )

    if not target_server.has_permission_for(
        request.user, GameServerModerator.Permissions.CAN_MANAGE_MODERATORS
    ):
        logger.warning(
            f"{request.user.username} wants to suspend moderator permissions with no permission"
        )
        return Response(
            {
                "success": False,
                "message": "You dont have an access to perform this operation",
            }
        )

    try:
        target_moderator = GameServerModerator.objects.get(
            id=moderator_id, game_server=target_server
        )
    except GameServerModerator.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to update a non-existing moderator (moderator id: {moderator_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "Target moderator not found",
            }
        )

    if target_moderator.user == request.user:
        return Response(
            {
                "success": False,
                "message": "You cannot perform this operation on yourself"
            }
        )

    if target_moderator.user == target_server.owner:
        logger.warning(
            f"{request.user.username} tried to suspend server owner"
        )
        return Response(
            {"success": False, "message": "You cant suspend server owner."}
        )
    
    match request.data.get("action"):
        case "suspend":
            target_moderator.status = "suspended"
            target_moderator.save()
        case "reactivate":
            target_moderator.status = "activate"
            target_moderator.save()
        case "remove":
            target_moderator.delete()


    return Response(
        {"success": True, "message": "Operation completed!"}
    )


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_moderators(request: HttpRequest, server_id: int) -> Response:
    try:
        server = GameServer.get_for_user(server_id, request.user)
    except GameServer.DoesNotExist:
        logger.warning(
            f"{request.user.username} tried to access bans of a non-existing server ({server_id})!"
        )
        return Response(
            {
                "success": False,
                "message": "The selected server does not exist or you do not have permission to access it.",
            }
        )
    except Exception:
        logger.exception(
            f"An unexpected error occurred while accessing bans for server {server_id} for user {request.user.username}."
        )
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred while accessing the server.",
            }
        )

    to_user_id = request.data.get("moderatorId", -1)
    permissions = request.data.get("permissions", [])

    if "manage_moderators" in permissions and request.user != server.owner:
        logger.warning(
            f"Permission denied for {request.user.username} to add new moderator with manage_moderators permission"
        )
        return Response({"success": False, "message": "Only server owner can add moderators with 'manage moderators' permission"})

    if not len(permissions):
        return Response(
            {"success": False, "message": "Cant add a moderator with no permissions"}
        )

    if not to_user_id:
        return Response(
            {"success": False, "message": "Cannot retreive target moderator"}
        )

    if to_user_id:
        try:
            target_user = User.objects.get(id=to_user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Target moderator not found"})

    if server.moderators.filter(user=target_user).exists():
        return Response({"success": False, "message": "User is already a moderator."})


    invite = ModeratorInviteToken.generate(
        invited_by=request.user,
        to=target_user,
        permissions=permissions,
        server=server
    )

    return Response(
        {
            "success": True,
            "data": {
                "inviteToken": invite.token,
                "isSentToEmail": invite.sent_to_email,
            },
        }
    )


@api_view(["GET", "POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def search_for_moderator(request: HttpRequest) -> Response:
    search_term = request.GET.get("search", "").strip()
    if not len(search_term):
        return Response({"success": True, "data": []})

    matched_users = User.objects.filter(username__icontains=search_term)[:10]
    return Response(
        {
            "success": True,
            "message": "",
            "data": [
                {
                    "id": user.id,
                    "username": user.username,
                    "email": "",
                    "avatar": "",  # TODO
                    "permissions": [],
                    "status": "active",
                    "joinedAt": "",
                }
                for user in matched_users
            ],
        }
    )

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def invite_moderator(request: HttpRequest) -> Response:
    token = request.query_params.get("token")
    if not token:
        return Response({"success": False, "message": "Token parameter is required"})

    try:
        invite = ModeratorInviteToken.objects.get(token=token)
    except ModeratorInviteToken.DoesNotExist:
        return Response({"success": False, "message": "Invalid invite token"})

    if invite.is_expired:
        return Response({"success": False, "message": "Invite  has expired"})

    if invite.status == ModeratorInviteToken.Status.ACCEPTED:
        return Response({"success": False, "message": "Invite  already accepted"})

    if invite.status == ModeratorInviteToken.Status.DECLINED:
        return Response({"success": False, "message": "Invite  already declined"})

    if request.user != invite.to:
        return Response({"success": False, "message": "You are not authorized to accept this invite"})

    return Response(
        {
            "success": True,
            "message": "",
            "data": {
                "id": invite.id,
                "inviterName": invite.invited_by.username,
                "serverName": invite.game_server.name,
                "permissions": invite.permissions,
                "inviteToken": invite.token,
                "expiresAt": (invite.invited_at + timedelta(days=7)).strftime("%d/%m/%Y, %H:%M:%S"),
                "status": invite.status_text
            }
        }
    )


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def mark_invite(request: HttpRequest) -> Response:
    token = request.query_params.get("token")
    if not token:
        return Response({"success": False, "message": "Token parameter is required"})

    try:
        invite = ModeratorInviteToken.objects.get(token=token)
    except ModeratorInviteToken.DoesNotExist:
        return Response({"success": False, "message": "Invalid invite token"})

    if invite.is_expired:
        return Response({"success": False, "message": "Invite  has expired"})

    if invite.status == ModeratorInviteToken.Status.ACCEPTED:
        return Response({"success": False, "message": "Invite  already accepted"})

    if invite.status == ModeratorInviteToken.Status.DECLINED:
        return Response({"success": False, "message": "Invite already declined"})

    if not "accepted" in request.data.keys():
        return Response({"success": False, "message": "Invite request"})
    
    accepted = request.data.get("accepted")

    invite.status = ModeratorInviteToken.Status.ACCEPTED if accepted else ModeratorInviteToken.Status.DECLINED
    invite.save()

    if accepted:
        moderator, created = GameServerModerator.objects.get_or_create(
            user=invite.to,
            game_server=invite.game_server,
            can_view_dashboard= "view_dashboard" in invite.permissions,
            can_view_analytics= "view_analytics" in invite.permissions,
            can_kick_players= "kick_players" in invite.permissions,
            can_ban_players= "ban_players" in invite.permissions,
            can_view_anticheat_logs= "view_anticheat_logs" in invite.permissions,
            can_manage_configuration= "manage_configuration" in invite.permissions,
            can_manage_webhook_settings= "manage_webhook_settings" in invite.permissions,
            can_access_interactive_map= "access_interactive_map" in invite.permissions,
            can_access_multi_stream= "access_multi_stream" in invite.permissions,
            can_manage_moderators= "manage_moderators" in invite.permissions,
            status="active",
        )



    return Response({"success": True, "message": "Invite accepted successfuly" if invite.status else "Invite declined successfuly"})


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
                    "screenshot_url": (
                        ban.report.screenshot.url if ban.report.screenshot else ""
                    ),
                    "license": ban.hwid.fivem_license,
                    "steam": ban.hwid.steam,
                    "discord_id": ban.hwid.discord_id,
                }
                for ban in bans
            ],
            "detections": DetectionReport.objects.count(),
        },
    )


@api_view(["POST", "GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def render_patchnotes(request: HttpRequest) -> HttpResponse:
    """
    API endpoint to list patch notes (GET) and mark them as seen (POST).
    Returns data in JSON format similar to announcements.
    """
    if request.method == "POST":
        try:
            request_body = json.loads(request.body.decode())
            patchnote_id = request_body.get("seenPatchNote")
            
            if not patchnote_id:
                return JsonResponse({"success": False, "error": "Missing seenPatchNote field"}, status=400)
                
            seen_patchnote = PatchNotes.objects.get(id=int(patchnote_id))
            seen_patchnote.seens.add(request.user)
            return JsonResponse({"success": True})
            
        except json.JSONDecodeError as err:
            logger.error(f"Failed to parse request body: {err}")
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)
        except PatchNotes.DoesNotExist:
            return JsonResponse({"success": False, "error": "Patch note not found"}, status=404)
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return JsonResponse({"success": False, "error": "Internal server error"}, status=500)

    elif request.method == "GET":
        patchnotes_data = []
        for patchnote in PatchNotes.objects.all().order_by("-date"):
            patchnotes_data.append({
                "id": str(patchnote.id),
                "title": patchnote.title,  # Can be a list of up to 4
                "version": patchnote.version,
                "releaseType": patchnote.release_type,
                "statusTags": patchnote.status_tags,
                "highlights": patchnote.highlights,
                "description": patchnote.description or "",
                "author": {
                    "name": patchnote.author,
                    "role": "Developer",
                    "avatar": None
                },
                "publishedAt": patchnote.date.isoformat(),
                "seen": patchnote.seens.filter(id=request.user.id).exists(),
            })

        return JsonResponse({"success": True, "data": patchnotes_data}, safe=False)


    return JsonResponse({"error": "Method not allowed"}, status=405)

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
                    for config in AntiCheatConfigTemplate.objects.filter(
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
                            if config_value == "on" or config_value == "off":
                                config_value = True if config_value == "on" else False
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

    for category in AntiCheatConfigurationCategory.objects.filter(
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

        distribution_path = os.path.join(
            dists_dir, target_dist, "download_template.zip"
        )
        if not os.path.isfile(distribution_path):
            messages.error(
                request, f"Failed to download {target_dist.title()} distribution!"
            )
            return redirect(request.path)

        temp_zip_path = os.path.join(
            dists_dir, target_dist, f"temp-{random.randint(10, 100)}.zip"
        )
        shutil.copyfile(distribution_path, temp_zip_path)

        if os.path.isfile(temp_zip_path):
            key_path = "AtomicShield/server.key"

            if os.path.isfile(temp_zip_path):
                with (
                    ZipFile(distribution_path, "r") as zip_read,
                    ZipFile(temp_zip_path, "w") as zip_write,
                ):
                    for item in zip_read.infolist():
                        if item.filename != key_path:
                            zip_write.writestr(item, zip_read.read(item.filename))
                        else:
                            server_key = "<YOUR ATOMICSHIELD SERVER KEY>"
                            try:
                                target_server = GameServer.objects.get(
                                    id=request.session.get("selected_server", -1),
                                    owner=request.user,
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

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def subscriptions_api(request):
    try:
        subscription_key = request.data.get("key", "").strip() 
        logger.info(subscription_key)    
    except Exception:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=200)

    if not subscription_key:
        return JsonResponse({"success": False, "error": "Empty Subscription Key"}, status=200)

    try:
        subscription = ServerSubscription.objects.get(key=subscription_key)
    except ServerSubscription.DoesNotExist:
        return JsonResponse({"success": False, "error": "Invalid Redeemed Key."}, status=200)

    if subscription.owner:
        return JsonResponse({"success": False, "error": "Subscription Key already redeemed"}, status=200)

    if not subscription.is_valid_for_now():
        return JsonResponse({"success": False, "error": "Expired Subscription"}, status=200)

    if subscription.game_servers.count():
        return JsonResponse({"success": False, "error": "This Subscription is already in-use."}, status=200)

    subscription.owner = request.user
    subscription.started_at = now()
    subscription.save()

    # GET method → return subscription data
    subscriptions_data = [
        {
            "type": sub.type,
            "started_at": sub.started_at,
            "expires_at": sub.started_at + sub.expires_at,
            "remaining": sub.remaining,
            "name": sub.name,
            "status": 2 if not sub.is_valid_for_now() else sub.status,
        }
        for sub in ServerSubscription.objects.filter(owner=request.user).order_by("-started_at")
    ]

    return Response({"success": True, "message": "Key Redeemed Successfully!", "subscriptions": subscriptions_data})


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
