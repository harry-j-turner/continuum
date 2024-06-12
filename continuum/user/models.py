"""User app ORM models."""

import json
import pathlib
from uuid import uuid4
from datetime import datetime
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from thought import tasks
from guardian.shortcuts import assign_perm

from thought.models import Tag, Thought


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

        onboarding_content_file = pathlib.Path(__file__).parent / "onboarding_content.json"
        with open(onboarding_content_file) as f:
            ONBOARDING_CONTENT = json.load(f)

        # Onboarding tag.
        onboarding_tag = Tag.objects.create(
            name="onboarding", colour="rgb(234, 225, 223)", description="Tag for onboarding thoughts."
        )
        assign_perm("view_tag", self, onboarding_tag)

        # # Onboarding content.
        # for day, entry_content in enumerate(ONBOARDING_CONTENT):
        #     entry = Entry.objects.create(date=datetime.now().date() - timedelta(days=day))

        #     for content in entry_content:
        #         thought = Thought.objects.create(content=content, entry=entry)
        #         thought.tags.add(onboarding_tag)
        #         tasks.extract_mood.delay(thought.id)
        #         tasks.extract_actions.delay(thought.id)
        #         thought.save()

        #     entry.save()
        #     assign_perm("view_entry", self, entry)
