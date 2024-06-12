import pytest
from django.utils import timezone
from thought.models import Tag, Thought, Entry


@pytest.mark.django_db
def test_thought_and_entry_models():
    """Create, save, and retrieve Thought with associated Entry and Tag."""

    # Given - Entry and Tag details
    entry_date = timezone.now().date()
    entry = Entry(date=entry_date)
    entry.save()

    tag_name = "Reflective"
    tag_description = "Used for reflective thoughts."
    tag_colour = "green"
    tag = Tag(name=tag_name, description=tag_description, colour=tag_colour)
    tag.save()

    # When - Creating and saving a Thought instance linked to Entry and Tag
    thought_content = "Today was a good day."
    thought_mood = 4  # Happy
    thought_actions = "Went for a walk in the park."
    thought = Thought(content=thought_content, entry=entry, mood=thought_mood, actions=thought_actions)
    thought.save()
    thought.tags.add(tag)

    # Then - Retrieve the Thought and verify attributes including relationships
    retrieved_thought = Thought.objects.get(id=thought.id)
    assert retrieved_thought.content == thought_content
    assert retrieved_thought.entry.date == entry_date
    assert tag in retrieved_thought.tags.all()
    assert retrieved_thought.mood == thought_mood
    assert retrieved_thought.actions == thought_actions
