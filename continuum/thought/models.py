from uuid import uuid4

from django.db import models


MOOD_CHOICES = [
    (1, "Very Unhappy"),
    (2, "Unhappy"),
    (3, "Neutral"),
    (4, "Happy"),
    (5, "Very Happy"),
]

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

    # Organisational fields.
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag, blank=True)

    # Content fields.
    content = models.TextField(blank=True)    
    mood = models.IntegerField(choices=MOOD_CHOICES, null=True)

    def __str__(self):
        return self.content

