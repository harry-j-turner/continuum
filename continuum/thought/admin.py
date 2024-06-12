from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Tag, Thought


@admin.register(Tag)
class TagAdmin(GuardedModelAdmin):
    list_display = ["name", "colour", "description"]
    search_fields = ["name"]


class ThoughtInline(admin.TabularInline):
    model = Thought
    extra = 0


@admin.register(Thought)
class ThoughtAdmin(GuardedModelAdmin):
    list_display = ["content", "created_at", "updated_at"]
    search_fields = ["content"]

