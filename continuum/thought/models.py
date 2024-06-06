import datetime
from uuid import uuid4

from django.db import models


class Tag(models.Model):
    """Tag Model."""

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    description = models.TextField()
    colour = models.CharField(max_length=24)

    def __str__(self):
        return self.name


class Thought(models.Model):
    """Thought Model."""

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    content = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    entry = models.ForeignKey("Entry", on_delete=models.CASCADE)

    mood = models.IntegerField(
        choices=[(1, "Very Unhappy"), (2, "Unhappy"), (3, "Neutral"), (4, "Happy"), (5, "Very Happy")], null=True
    )
    actions = models.TextField(blank=True)

    def __str__(self):
        return self.content


class Entry(models.Model):
    """Entry Model, using date as primary key."""

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    date = models.DateField()


class Task(models.Model):
    """Task Model."""

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    snooze = models.DateTimeField(null=True)

    is_evergreen = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    is_ideal = models.BooleanField(default=False)

    def __str__(self):
        return self.name
