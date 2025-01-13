import json
from logging import getLogger
from functools import update_wrapper
from django.contrib import admin
from django.http import HttpRequest, Http404
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.conf import settings
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import (
    UserAdmin as BaseUserAdmin,
    GroupAdmin as BaseGroupAdmin,
)
from .models import GameServer, Announcements, PatchNotes, ServerSubscription

from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm


admin.site.unregister(User)
admin.site.unregister(Group)


logger = getLogger(__name__)


def protected_admin_view(view, cacheable: bool = False):
    """
    Overwrite the default admin view to return 404 for the users that doesnt have permissions.
    """

    def inner(request: HttpRequest, *args, **kwargs):
        request_ip = request.META.get("HTTP_X_REAL_IP", request.META.get("REMOTE_ADDR"))
        with open(f"{settings.CONFIG_DIR}\\admins.json", "r") as file:
            admins = json.load(file)
        if not request_ip in admins:
            logger.warning(f"{request_ip} trying to view admin dashboard. Unauthorized access!")
            raise Http404()
        return view(request, *args, **kwargs)

    if not cacheable:
        inner = never_cache(inner)

    # We add csrf_protect here so this function can be used as a utility
    # function for any view, without having to repeat 'csrf_protect'.
    if not getattr(view, "csrf_exempt", False):
        inner = csrf_protect(inner)

    return update_wrapper(inner, view)


admin.site.admin_view = protected_admin_view


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm


@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin): ...


class GameServerAdmin(ModelAdmin):
    list_display = ["name", "address", "owner", "type"]

    @admin.display(description="Address")
    def address(self, obj: GameServer):
        return f"{obj.ip}:{obj.port}"

    @admin.display(description="Owner")
    def owner(self, obj: GameServer):
        return f"{obj.owner.username}"

    @admin.display(description="Type")
    def type(self, obj: GameServer):
        return f"{obj.type}"


class AnnouncementAdmin(ModelAdmin):
    list_display = ["title", "author", "description"]

    @admin.display(description="Author")
    def announcement(self, obj: Announcements):
        return obj.author

    @admin.display(description="Description")
    def description(self, obj: Announcements):
        return obj.announcement


class PatchNotesAdmin(ModelAdmin):
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


class ServerSubscriptionAdmin(ModelAdmin):
    list_display = ["name", "owner", "type", "status"]

    @admin.display(description="Name")
    def name(self, obj: ServerSubscription):
        return obj.name

    @admin.display(description="Owner")
    def owner(self, obj: ServerSubscription):
        return obj.owner.username

    @admin.display(description="Type")
    def type(self, obj: ServerSubscription):
        return obj.type

    @admin.display(description="Status")
    def status(self, obj: ServerSubscription):
        return obj.status


admin.site.register(GameServer, GameServerAdmin)
admin.site.register(Announcements, AnnouncementAdmin)
admin.site.register(PatchNotes, PatchNotesAdmin)
admin.site.register(ServerSubscription, ServerSubscriptionAdmin)
