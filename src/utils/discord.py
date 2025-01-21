import nextcord
from io import BytesIO
from django.conf import settings
from aiohttp import ClientSession
from typing import List, Tuple, Optional


async def send_discord_embed(
    webhook_url: str,
    title: str,
    description: str,
    fields: Optional[List[Tuple[str, str]]] = [],
    footer: Optional[str] = None,
    image_buffer: Optional[bytes] = None,
    color: Optional[nextcord.Color] = 0x01e4f4,
    bot_name: Optional[str] = f"{settings.ANTICHEAT_NAME} AntiCheat",
):
    embed = nextcord.Embed(title=title, description=description, color=color)
    for field in fields:
        embed.add_field(name=field[0], value=field[1], inline=field[2])

    if footer:
        embed.set_footer(text=footer)
    
    if image_buffer:
        embed.set_image(url="attachment://image.jpg")

    async with ClientSession() as session:
        webhook = nextcord.Webhook.from_url(webhook_url, session=session)
        await webhook.send(
            embed=embed, username=bot_name, avatar_url=settings.BOT_AVATAR_URL,
            file=nextcord.File(BytesIO(image_buffer), "image.jpg")
        )
