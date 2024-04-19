import pytest
from django.contrib.auth import get_user_model
from guardian.shortcuts import get_perms
from datetime import datetime
from unittest.mock import Mock
from datetime import timedelta
from thought import tasks
from user.models import Tag, Entry, Thought

User = get_user_model()


@pytest.mark.django_db
def test_onboarding(mocker):
    """Test that a new user is onboarded successfully."""

    mocker.patch.object(tasks, "extract_mood", return_value="1")
    mocker.patch.object(tasks, "extract_actions", return_value=["buy milk"])

    # Given - A new user.
    user = User.objects.create_user(username="testuser", password="12345", sub="unique-sub-id")

    # When - The user is onboarded.
    user.onboard()

    # Then - The tag is created.
    onboarding_tag = Tag.objects.get(name="onboarding")
    assert onboarding_tag.name == "onboarding"
    assert "view_tag" in get_perms(user, onboarding_tag)

    # And - Four entries are created and they have (some) thoughts.
    for day in [0, 1, 2, 3]:
        date = datetime.now().date() - timedelta(days=day)
        entry = Entry.objects.filter(date=date).first()
        assert entry is not None
        assert "view_entry" in get_perms(user, entry)
        assert entry.thought_set.count() > 0
