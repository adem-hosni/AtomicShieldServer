from django.db import models


class ServerType(models.IntegerChoices):
    FIVEM = 2, "FiveM"
