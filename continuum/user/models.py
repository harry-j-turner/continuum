from uuid import uuid4

from django.contrib.auth.models import AbstractUser
from django.db import models


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

        pass
