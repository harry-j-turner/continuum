import pytest
from unittest.mock import Mock
from django.conf import settings
from thought.tasks import extract_mood
from thought.tests.factories import ThoughtFactory


@pytest.mark.django_db
def test_extract_mood(mocker):
    """extract_mood sets the mood on the thought."""

    # Given - A thought.
    thought = ThoughtFactory(content="I feel fantastic!", set_mood=None)  # Explicitly set mood to None

    # And - Assume the thought content is happy.
    mock_openai_response = Mock()
    mock_openai_response.choices = [Mock(message=Mock(content="4"))]  # Happy mood response
    mocker.patch.object(
        settings, "OPENAI_CLIENT", chat=Mock(completions=Mock(create=Mock(return_value=mock_openai_response)))
    )

    # When - the extract_mood task is called
    extract_mood(thought_id=thought.id)

    # Then - the mood is correctly extracted and saved
    thought.refresh_from_db()
    assert thought.mood == 4


@pytest.mark.django_db
def test_extract_mood_bad(mocker):
    """extract_mood sets the mood to None if the response is not a valid mood value."""

    # Given - A thought.
    thought = ThoughtFactory(content="The weather is sunny.", set_mood=None)  # Explicitly set mood to None

    # And - Assume the response from the system is not a valid mood number.
    mock_openai_response = Mock()
    mock_openai_response.choices = [Mock(message=Mock(content="the user is happy"))]  # Invalid mood response
    mocker.patch.object(
        settings, "OPENAI_CLIENT", chat=Mock(completions=Mock(create=Mock(return_value=mock_openai_response)))
    )

    # When - the extract_mood task is called
    extract_mood(thought_id=thought.id)

    # Then - the mood is set to None due to the invalid response
    thought.refresh_from_db()
    assert thought.mood is None
