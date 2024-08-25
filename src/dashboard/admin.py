from django.contrib import admin
from .models import GameServers, Announcements, PatchNotes


class GameServerAdmin(admin.ModelAdmin):
    list_display = ["address", "owner", "type"]


    @admin.display(description="Address")
    def address(self, obj: GameServers):
        return f"{obj.ip}:{obj.port}"

    @admin.display(description="Owner")
    def owner(self, obj: GameServers):
        return f"{obj.owner.username}"

    @admin.display(description="Type")
    def type(self, obj: GameServers):
        return f"{obj.type}"


class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["announcement", "author", "description"]

    @admin.display(description="Announcement")
    def announcement(self, obj: Announcements):
        return obj.title

    @admin.display(description="Author")
    def announcement(self, obj: Announcements):
        return obj.author

    @admin.display(description="Description")
    def description(self, obj: Announcements):
        return obj.announcement


class PatchNotesAdmin(admin.ModelAdmin):
    list_display = ["patchnote", "author", "description"]

    @admin.display(description="Patchnote")
    def patchnote(self, obj: PatchNotes):
        return obj.title

    @admin.display(description="Author")
    def announcement(self, obj: PatchNotes):
        return obj.author

    @admin.display(description="Description")
    def description(self, obj: PatchNotes):
        return obj.patchnotes


admin.site.register(GameServers, GameServerAdmin)
admin.site.register(Announcements, AnnouncementAdmin)
admin.site.register(PatchNotes, PatchNotesAdmin)
