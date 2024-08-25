from django.contrib import admin
from .models import GameServers, Announcements, PatchNotes


class GameServerAdmin(admin.ModelAdmin):
    list_display = ["address", "owner", "type"]

    @admin.display(description="Address")
    def address(self, obj: GameServers):
        return f"{obj.ip}:{obj.port}"

    @admin.display(description="Owner")
    def address(self, obj: GameServers):
        return f"{obj.owner.username}"

    @admin.display(description="Type")
    def address(self, obj: GameServers):
        return f"{obj.type}"


admin.site.register(GameServers, GameServerAdmin)
admin.site.register(Announcements)
admin.site.register(PatchNotes)
