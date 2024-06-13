from django.core.management.base import BaseCommand
from thought.models import Tag, Thought
from user.models import User
from datetime import datetime
from datetime import timedelta
from random import randint, choice
from guardian.shortcuts import assign_perm

TAGS = [
    {"name": "tag_1", "description": "Description for tag_1", "colour": "rgb(185,131,137)"},
    {"name": "tag_2", "description": "Description for tag_2", "colour": "rgb(181,157,164)"},
    {"name": "tag_3", "description": "Description for tag_3", "colour": "rgb(172,143,154)"},
]

THOUGHTS = {}
for i in range(1, 30):
    THOUGHTS[f"thought_{i}"] = {
        "content": f"Thought {i}",
        "mood": randint(1, 5),
        "actions": "",
        "created_at": datetime.now() - timedelta(days=i),
        "tags": [choice(TAGS) for _ in range(randint(1, 2))],
    }


class Command(BaseCommand):
    help = "Seed the database with initial data."

    def handle(self, *args, **options):
        """Seed the database with initial data."""

        self.stdout.write(self.style.HTTP_INFO("Creating Users..."))
        user_admin, _ = User.objects.get_or_create(username="admin")
        user_admin.set_password("admin")
        user_admin.is_superuser = True
        user_admin.is_staff = True
        user_admin.save()
        henry, _ = User.objects.get_or_create(
            username="henry.j.turner@gmail.com", sub="google-oauth2|106315701179260082674"
        )

        self.stdout.write(self.style.HTTP_INFO("Creating Tags..."))
        tags = {}
        for t in TAGS:
            tag, _ = Tag.objects.get_or_create(name=t["name"], description=t["description"], colour=t["colour"])
            assign_perm("view_tag", henry, tag)
            tags[tag.name] = tag

        self.stdout.write(self.style.HTTP_INFO("Creating Thoughts..."))
        for t in THOUGHTS.values():
            thought, _ = Thought.objects.get_or_create(content=t["content"], mood=t["mood"])
            for tag in t["tags"]:
                thought.tags.add(tags[tag["name"]])

            # Override created at.
            thought.created_at = t["created_at"]
            thought.save()
            assign_perm("view_thought", henry, thought)

        self.stdout.write(self.style.SUCCESS("Successfully seeded database."))
