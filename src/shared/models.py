from django.db import models


class ServerTypes(models.IntegerChoices):
    MTASA = 1, "MTA:SA"
