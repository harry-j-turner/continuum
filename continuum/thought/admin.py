from django.contrib import admin
from guardian.admin import GuardedModelAdmin
from guardian.shortcuts import get_users_with_perms

from .models import Entry, Tag, Thought, Task


@admin.register(Tag)
class TagAdmin(GuardedModelAdmin):
    list_display = ["name", "colour", "description"]
    search_fields = ["name"]


class ThoughtInline(admin.TabularInline):
    model = Thought
    extra = 0


@admin.register(Entry)
class EntryAdmin(GuardedModelAdmin):
    list_display = ["date", "id", "updated_at", "user"]
    search_fields = ["date"]
    inlines = [ThoughtInline]

    def user(self, obj):
        """Returns a comma-separated list of users with any permission on this object."""

        users = get_users_with_perms(obj, attach_perms=True).keys()
        return ", ".join(user.username for user in users)


@admin.register(Thought)
class ThoughtAdmin(GuardedModelAdmin):
    list_display = ["content", "entry", "created_at", "updated_at"]
    search_fields = ["content", "entry__id"]


@admin.register(Task)
class TaskAdmin(GuardedModelAdmin):
    list_display = ["name", "created_at", "updated_at"]
    search_fields = ["name"]
