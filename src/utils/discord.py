import nextcord
from django.conf import settings
from aiohttp import ClientSession
from typing import List, Tuple, Optional


async def send_discord_embed(
    webhook_url: str,
    title: str,
    description: str,
    fields: Optional[List[Tuple[str, str]]] = [],
    footer: Optional[str] = None,
    image: Optional[str] = None,
    color: Optional[nextcord.Color] = nextcord.Color.dark_gold(),
    bot_name: Optional[str] = f"{settings.ANTICHEAT_NAME} AntiCheat",
):
    embed = nextcord.Embed(
        title=title,
        description=description,
        color=color
    )
    for field in fields:
        embed.add_field(name=field[0], value=field[1], inline=field[2])

    if footer:
        embed.set_footer(text=footer)
    if image:
        embed.set_image(url=image)

    async with ClientSession() as session:
        webhook = nextcord.Webhook.from_url(webhook_url, session=session)
        await webhook.send(embed=embed, username=bot_name, avatar_url=settings.BOT_AVATAR_URL)
