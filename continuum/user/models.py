"""User app ORM models."""

from uuid import uuid4
from datetime import datetime
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from guardian.shortcuts import assign_perm

from thought.models import Entry, Tag, Thought

ONBOARDING_CONTENT = [[{"content": "Welcome to Continuum. "}]]


class User(AbstractUser):
    """Custom user model.

    The only change here form the default Django user model is the addition of the `sub` field which
    allows us to match users to their respective identity in the Identity Provider (Auth0).

    """

    sub = models.CharField(max_length=255, unique=True, default=uuid4)

    def __str__(self) -> str:
        return self.username

    def onboard(self):
        """Setup a basic set of objects for the user when they start."""

        # Onboarding tag.
        onboarding_tag = Tag.objects.create(
            name="onboarding", colour="blue", description="Tag for onboarding thoughts."
        )
        assign_perm("view_tag", self, onboarding_tag)

        # Todays entry.
        today_entry = Entry.objects.create(date=datetime.now())
        today_entry_thought_1 = Thought.objects.create(
            content="Welcome to Continuum! This is a thought, it represents a single idea or piece of information. Click this text to edit or add more.",
            entry=today_entry,
        )
        today_entry_thought_1.tags.add(onboarding_tag)
        today_entry_thought_1.save()
        today_entry.save()
        assign_perm("view_entry", self, today_entry)

        # Yesterday's entry.
        yesterday_entry = Entry.objects.create(date=datetime.now().date() - timedelta(days=1))
        yesterday_entry_thought_1 = Thought.objects.create(
            content="Thoughts in previous entries cannot be edited. This is deliberate, it tracks how your thoughts evolve over time!",
            entry=yesterday_entry,
        )
        yesterday_entry_thought_1.tags.add(onboarding_tag)
        yesterday_entry_thought_1.save()
        yesterday_entry.save()
        assign_perm("view_entry", self, yesterday_entry)
