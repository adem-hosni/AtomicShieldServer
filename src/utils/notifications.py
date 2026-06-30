from enum import Enum
from asgiref.sync import async_to_sync
import asyncio
from django.conf import settings
import nextcord
from . import format_string
from io import BytesIO
from aiohttp import ClientSession
from anticheat.models import AntiCheatConfigurations
from aiohttp import ClientSession
from anticheat.models import Ban
import logging
from typing import Dict, Any, Union


logger = logging.getLogger(__name__)


def build_embed(
    embed_data: Dict[str, Any], format_data: Dict[str, Any]
) -> nextcord.Embed:
    """Builds a Discord embed from the provided data.

    Args:
        embed_data (Dict[str, Any]): The embed data containing title, description, fields, etc.
        format_data (Dict[str, Any]): The data to format the embed strings.

    Returns:
        Embed: A Discord Embed object with the formatted data.
    """
    embed_color = embed_data.get("color", 0x111629)
    if isinstance(embed_color, str):
        embed_color = int(embed_color[1:], 16)
    embed = nextcord.Embed(
        title=format_string(embed_data.get("title", ""), format_data),
        description=format_string(embed_data.get("description", ""), format_data),
        color=embed_color,
    )

    if "author" in embed_data:
        embed.set_author(
            name="Atomic Shield - FiveM AntiCheat©",
            icon_url=settings.BOT_AVATAR_URL,
        )

    for field in embed_data.get("fields", []):
        embed.add_field(
            name=format_string(field.get("name", ""), format_data),
            value=format_string(field.get("value", ""), format_data),
            inline=field.get("inline", False),
        )

    if "footer" in embed_data:
        embed.set_footer(
            text=format_string(embed_data["footer"].get("text", ""), format_data),
            icon_url=embed_data["footer"].get("icon_url", ""),
        )

    if "image_url" in embed_data:
        embed.set_image(url=embed_data["image_url"])

    return embed


class NotificationType(Enum):
    BAN = "ban"
    UNBAN = "unban"
    KICK = "kick"
    SCREENSHOT = "screenshot"


async def notify_server_async(
    notification_type: NotificationType,
    server,
    **extra: Dict[str, Union[str, Any]],
) -> None:
    """
    The async implementation. Await this from async code.
    """
    if not server:
        logger.warning("No server provided for notification.")
        return

    # Try to load config via async ORM (avoid touching sync relation resolver)
    try:
        config = await AntiCheatConfigurations.objects.aget(pk=server.configurations_id)
    except Exception:
        # Fallback (rare): resolve the FK via sync in a thread
        from asgiref.sync import sync_to_async

        config = await sync_to_async(lambda: server.configurations)()

    # Build embed + report data
    match notification_type:
        case NotificationType.BAN:
            embed_data = config.get_discord_embed("ban")
            report_data = {
                "player_name": extra.get("player_name", ""),
                "date": extra["ban"].banned_at.strftime("%Y-%m-%d %H:%M:%S"),
                "duration": extra["ban"].duration.strftime("%Y-%m-%d %H:%M:%S"),
                "reason": extra["ban"].reason,
                "screenshot_url": f"{settings.SITE_DOMAIN}{settings.MEDIA_URL}{extra['report'].screenshot.name}",
            }

        case NotificationType.UNBAN:
            embed_data = config.get_discord_embed("unban")
            report_data = {
                "player_name": extra.get("player_name", ""),
                "date": extra["ban"].banned_at.strftime("%Y-%m-%d %H:%M:%S"),
                "reason": extra["ban"].reason,
            }

        case NotificationType.KICK:
            embed_data = config.get_discord_embed("kick")
            report_data = {
                "player_name": extra.get("player_name", ""),
                "date": extra["kick"].kicked_at.strftime("%Y-%m-%d %H:%M:%S"),
                "reason": extra["kick"].reason,
            }

        case NotificationType.SCREENSHOT:
            embed_data = config.get_discord_embed("screenshot")
            report_data = {
                "player_name": extra.get("player_name", ""),
                "date": extra["report"].created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "screenshot_url": f"{settings.SITE_DOMAIN}{settings.MEDIA_URL}{extra['screenshot']}",
            }

        case _:
            raise ValueError(f"Unknown notification type: {notification_type}")

    webhook_url = config.get_webhook_url(notification_type.value)
    embed = build_embed(embed_data, report_data)

    try:
        async with ClientSession() as session:
            webhook = nextcord.Webhook.from_url(webhook_url, session=session)
            if extra.get("image_buffer"):
                await webhook.send(
                    embed=embed,
                    username="AntiCheat Notification",
                    avatar_url=settings.BOT_AVATAR_URL,
                    file=nextcord.File(BytesIO(extra["image_buffer"]), "image.jpg"),
                )
            else:
                await webhook.send(
                    embed=embed,
                    username="AntiCheat Notification",
                    avatar_url=settings.BOT_AVATAR_URL,
                )
    except Exception:
        logger.exception("Failed to send webhook notification")


def notify_server(
    notification_type: NotificationType,
    server,
    **extra: Dict[str, Union[str, Any]],
) -> None:
    """
    Sync-friendly wrapper.

    - If called from a plain sync thread: runs the async implementation and waits for it to complete (via async_to_sync).
    - If called on a thread that already has a running event loop: schedules the async implementation on that loop (fire-and-forget).
      This avoids AsyncToSync/CurrentThreadExecutor errors.
    NOTE: If you want to block inside an async context, call `await notify_server_async(...)` instead.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        # No running loop in this thread: safe to block with async_to_sync
        async_to_sync(notify_server_async)(notification_type, server, **extra)
        return

    # There is a running loop in this thread:
    # schedule the coroutine (fire-and-forget) on the running loop.
    # If you need to await in async code, call notify_server_async(...) directly.
    loop.create_task(notify_server_async(notification_type, server, **extra))
