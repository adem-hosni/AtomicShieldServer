from django.db import models


class ServerType(models.IntegerChoices):
    FIVEM = 2, "FiveM"
    MTASA = 1, "Multi Theft Auto: San Andreas (MTA:SA)"
