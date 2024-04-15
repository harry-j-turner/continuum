from django.core.management.base import BaseCommand
from thought.models import Entry, Tag, Thought
from user.models import User
from datetime import datetime
from datetime import timedelta
from guardian.shortcuts import assign_perm


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

        today = datetime.now()

        self.stdout.write(self.style.HTTP_INFO("Creating Tags..."))
        tag_sleep, _ = Tag.objects.get_or_create(
            name="sleep", description="For thoughts about sleep.", colour="rgb(185,131,137)"
        )
        tag_projects, _ = Tag.objects.get_or_create(
            name="projects", description="For thoughts about projects.", colour="rgb(181,157,164)"
        )
        assign_perm("view_tag", henry, tag_sleep)
        assign_perm("view_tag", henry, tag_projects)

        self.stdout.write(self.style.HTTP_INFO("Creating entry 1..."))
        entry_1, _ = Entry.objects.get_or_create(date=today)
        assign_perm("view_entry", henry, entry_1)
        item_1, _ = Thought.objects.get_or_create(
            content="I think we should use React Native for the mobile app.",
            entry=entry_1,
            mood=3,
            actions="Use React Native for the mobile app.",
        )
        item_1.tags.set([tag_projects])

        item_2, _ = Thought.objects.get_or_create(
            content="I think we should use Django for the backend.",
            entry=entry_1,
            mood=3,
            actions="Use Django for the backend.",
        )
        item_2.tags.set([tag_projects])

        item_3, _ = Thought.objects.get_or_create(
            content="I have not been sleeping well at all lately.",
            entry=entry_1,
            mood=2,
        )
        item_3.tags.set([tag_sleep])

        self.stdout.write(self.style.HTTP_INFO("Creating entry 2..."))
        one_day_ago = today - timedelta(days=1)
        entry_2, _ = Entry.objects.get_or_create(date=one_day_ago)
        assign_perm("view_entry", henry, entry_2)
        item_4, _ = Thought.objects.get_or_create(
            content="I'm going to try going to bed earlier each night this week.",
            entry=entry_2,
            mood=3,
            actions="Go to bed earlier each night this week.",
        )
        item_4.tags.set([tag_sleep])

        item_5, _ = Thought.objects.get_or_create(
            content="Need to add more testing to Djano. I think we should use pytest.",
            entry=entry_2,
            mood=3,
            actions="Add more tests to Django using pytest.",
        )
        item_5.tags.set([tag_projects])

        self.stdout.write(self.style.HTTP_INFO("Creating entry 3..."))
        two_days_ago = today - timedelta(days=2)
        entry_3, _ = Entry.objects.get_or_create(date=two_days_ago)
        assign_perm("view_entry", henry, entry_3)
        item_6, _ = Thought.objects.get_or_create(
            content="I'm very much struggling with this new project, I hate it and I just want to quit.",
            entry=entry_3,
            mood=1,
        )
        item_6.tags.set([tag_projects])

        item_7, _ = Thought.objects.get_or_create(
            content="I've not been speaking with my friends recently, I don't think they want to talk to me.",
            entry=entry_3,
            mood=1,
        )
        item_7.tags.set([tag_projects])

        self.stdout.write(self.style.HTTP_INFO("Creating entry 4..."))
        three_days_ago = today - timedelta(days=3)
        entry_4, _ = Entry.objects.get_or_create(date=three_days_ago)
        assign_perm("view_entry", henry, entry_4)
        item_8, _ = Thought.objects.get_or_create(
            content="I'm feeling pretty good today, I think I might go for a walk.",
            entry=entry_4,
            mood=4,
            actions="Go for a walk.",
        )
        item_8.tags.set([tag_projects])

        item_9, _ = Thought.objects.get_or_create(
            content="I have a great idea for a new project, I can't wait to get started on it.",
            entry=entry_4,
            mood=5,
        )
        item_9.tags.set([tag_projects])

        self.stdout.write(self.style.SUCCESS("Successfully seeded database."))
