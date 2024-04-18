import pytest
from thought.models import Tag


@pytest.mark.django_db
def test_tag_model():
    """Create, save, and retrieve Tag."""

    # Given - Tag details
    tag_name = "Test Tag"
    tag_description = "A sample tag for testing."
    tag_colour = "blue"

    # When - Creating and saving a Tag instance
    tag = Tag(name=tag_name, description=tag_description, colour=tag_colour)
    tag.save()

    # Then - Retrieve the Tag and verify essential attributes
    retrieved_tag = Tag.objects.get(id=tag.id)
    assert retrieved_tag.name == tag_name
    assert retrieved_tag.description == tag_description
    assert retrieved_tag.colour == tag_colour
