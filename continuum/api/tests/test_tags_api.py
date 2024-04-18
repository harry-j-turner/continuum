import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from guardian.shortcuts import assign_perm
from thought.tests.factories import TagFactory

from thought.models import Tag


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    user_model = get_user_model()
    user = user_model.objects.create_user(username="user", password="password")
    user.save()
    return user


@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.mark.django_db
def test_create_tag(authenticated_client, user):
    """User can create a new Tag."""

    url = reverse("tag-list")

    # Given - A tag.
    tag_data = {"name": "Test Tag", "description": "A tag created during testing", "colour": "blue"}

    # When - The user creates a new tag.
    response = authenticated_client.post(url, tag_data)

    # Then - The response is successful.
    assert response.status_code == status.HTTP_201_CREATED

    # And - The tag is created in the database with correct permissions.
    assert Tag.objects.filter(name="Test Tag").exists()
    new_tag = Tag.objects.get(name="Test Tag")
    assert user.has_perm("view_tag", new_tag)


@pytest.mark.django_db
def test_list_tags_with_permissions(authenticated_client, user):
    """User can list only tags they have permission to view."""

    # Given - Two tags with view permissions assigned to the user
    tag1 = TagFactory()
    tag2 = TagFactory()
    assign_perm("view_tag", user, tag1)
    assign_perm("view_tag", user, tag2)

    url = reverse("tag-list")

    # When - The user lists tags
    response = authenticated_client.get(url)

    # Then - The response is successful and only permitted tags are listed
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data["results"]) == 2
    assert {tag["name"] for tag in response.data["results"]} == {tag1.name, tag2.name}


@pytest.mark.django_db
def test_retrieve_tag_with_permissions(authenticated_client, user):
    """User can retrieve a tag they have permission to view."""

    # Given - A tag with view permission
    tag = TagFactory()
    assign_perm("view_tag", user, tag)

    url = reverse("tag-detail", kwargs={"pk": tag.id})

    # When - The user retrieves the tag
    response = authenticated_client.get(url)

    # Then - The response is successful and correct tag is retrieved
    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == tag.name


@pytest.mark.django_db
def test_list_tags_no_permissions(authenticated_client, user):
    """User cannot list tags without permissions."""

    # Given - Two tags without view permissions
    TagFactory()
    TagFactory()

    url = reverse("tag-list")

    # When - The user attempts to list tags
    response = authenticated_client.get(url)

    # Then - The response is successful but no tags are listed
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data["results"]) == 0
