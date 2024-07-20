from django.contrib import admin
from .models import GameServers, Announcements, PatchNotes

admin.site.register(GameServers)
admin.site.register(Announcements)
admin.site.register(PatchNotes)
