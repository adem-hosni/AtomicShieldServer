from django.db import models


class Application(models.Model):
    name = models.CharField(max_length=255)
    label = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    module = models.CharField(max_length=255)

    def __str__(self):
        return self.name
