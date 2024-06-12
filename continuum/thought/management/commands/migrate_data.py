from django.core.management.base import BaseCommand
from thought.models import Tag, Thought
from user.models import User
from datetime import datetime
from datetime import timedelta
from random import randint, choice
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

        self.stdout.write(self.style.HTTP_INFO("Loading tags..."))
        

        self.stdout.write(self.style.SUCCESS("Successfully seeded database."))
