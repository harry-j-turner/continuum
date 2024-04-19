"""User app ORM models."""

from uuid import uuid4
from datetime import datetime
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from thought import tasks
from guardian.shortcuts import assign_perm

from thought.models import Entry, Tag, Thought

ONBOARDING_CONTENT = [
    [
        "Welcome to Continuum.",
        "This is a thought, it represents a single idea or piece of information. Thoughts can be tagged. Click this text to edit or add more content.",
        "An entry can contain many thoughts. Click 'New Thought' to add a new one.",
        "Click on yesterday's entry in the navigator on the left to continue...",
    ],
    [
        "Notice how yesterday's entry is now read-only. You can still view and change the tags, but you can't edit the content. This is deliberate, it's designed to capture a snapshot of your current state of mind. This is not a note taking system.",
        "All thoughts are analysed by the AI. It predicts your mood, and it scrapes ideas and todo items. Whenever you make a change to a thought, it is reanalysed and the analysis is updated.",
        "Go to the next day to continue...",
    ],
    [
        "Continuum analyses the sentiment of each of your thoughts. This is a positive thought. I am very happy and have had a great day! Continuum easily handles positive entries like this.",
        "Continuum easily tracks requests to capture todo items. Remember to buy milk on the way home. Continuum will capture that.",
        "Go to the next day to continue...",
    ],
    [
        "But Continuum can be much more nuanced than that. It can handle complex thoughts and moods. For example let's embed a slightly tricky action into this text. I am writing this onboarding post and I want to review the tone of the content and check it's appropriate. Did you notice the action? Continuum will have hopefully caught that.",
        "Enough example content. Click on the Analysis tab to see the results.",
    ],
]


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
            name="onboarding", colour="rgb(234, 225, 223)", description="Tag for onboarding thoughts."
        )
        assign_perm("view_tag", self, onboarding_tag)

        # Onboarding content.
        for day, entry_content in enumerate(ONBOARDING_CONTENT):
            entry = Entry.objects.create(date=datetime.now().date() - timedelta(days=day))

            for content in entry_content:
                thought = Thought.objects.create(content=content, entry=entry)
                thought.tags.add(onboarding_tag)
                tasks.extract_mood.delay(thought.id)
                tasks.extract_actions.delay(thought.id)
                thought.save()

            entry.save()
            assign_perm("view_entry", self, entry)
