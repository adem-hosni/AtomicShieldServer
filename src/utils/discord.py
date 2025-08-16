import logging
import nextcord
from io import BytesIO
from django.conf import settings
from aiohttp import ClientSession
from typing import List, Tuple, Optional


logger = logging.getLogger(__name__)

async def send_discord_embed(
    webhook_url: str,
    title: str,
    description: str,
    fields: Optional[List[Tuple[str, str, bool]]] = [],
    author: Optional[str] = None,  
    author_icon_url: Optional[str] = None,  
    footer: Optional[str] = None,
    footer_icon_url: Optional[str] = None,  
    image_buffer: Optional[bytes] = None,
    color: Optional[nextcord.Color] = 0x111629,
    bot_name: Optional[str] = f"{settings.ANTICHEAT_NAME} AntiCheat",
    avatar_url: Optional[str] = None,  
):
    if isinstance(color, str):
        color = nextcord.Colour(int(color[1:], 16))

    embed = nextcord.Embed(title=title, description=description, color=color)
    
    if author:
        embed.set_author(name=author, icon_url=author_icon_url if author_icon_url else "")

    for field in fields:
        embed.add_field(name=field[0], value=field[1], inline=field[2])

    if footer:
        embed.set_footer(text=footer, icon_url=footer_icon_url if footer_icon_url else "")

    if image_buffer:
        embed.set_image(url="attachment://image.jpg")    

    async with ClientSession() as session:
        webhook = nextcord.Webhook.from_url(webhook_url, session=session)
        if image_buffer:
            response = await webhook.send(
                embed=embed, 
                username=bot_name, 
                avatar_url=avatar_url or settings.BOT_AVATAR_URL,  # Use custom or default avatar
                file=nextcord.File(BytesIO(image_buffer), "image.jpg")
            )
        else:
            response = await webhook.send(
                embed=embed, 
                username=bot_name, 
                avatar_url=avatar_url or settings.BOT_AVATAR_URL  # Use custom or default avatar
            )

