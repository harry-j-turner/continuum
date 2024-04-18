import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from guardian.shortcuts import assign_perm
from thought.tests.factories import EntryFactory, ThoughtFactory

from thought.models import Entry, Thought


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
def test_create_entry(authenticated_client, user):
    """User can create a new Entry."""

    url = reverse("entry-list")

    # Given - An entry data
    entry_data = {"date": "2023-10-01"}

    # When - The user creates a new entry
    response = authenticated_client.post(url, entry_data)

    # Then - The response is successful
    assert response.status_code == status.HTTP_201_CREATED

    # And - The entry is created in the database with correct permissions
    assert Entry.objects.filter(date="2023-10-01").exists()
    new_entry = Entry.objects.get(date="2023-10-01")
    assert user.has_perm("view_entry", new_entry)


@pytest.mark.django_db
def test_view_entry_with_thoughts(authenticated_client, user):
    """User can view an entry with associated thoughts."""

    # Given - An entry with associated thoughts
    entry = EntryFactory(date="2023-10-02")
    ThoughtFactory(entry=entry, content="Thought 1")
    ThoughtFactory(entry=entry, content="Thought 2")
    assign_perm("view_entry", user, entry)

    url = reverse("entry-detail", kwargs={"pk": entry.id})

    # When - The user retrieves the entry
    response = authenticated_client.get(url)

    # Then - The response is successful and includes the associated thoughts
    assert response.status_code == status.HTTP_200_OK
    assert response.data["date"] == "2023-10-02"
    thoughts = {thought["content"] for thought in response.data["thoughts"]}
    assert thoughts == {"Thought 1", "Thought 2"}


@pytest.mark.django_db
def test_view_entry_no_permission(authenticated_client, user):
    """User cannot view an entry without permission."""

    # Given - An entry without view permission
    entry = EntryFactory(date="2023-10-03")
    ThoughtFactory(entry=entry, content="Thought 1")
    ThoughtFactory(entry=entry, content="Thought 2")

    url = reverse("entry-detail", kwargs={"pk": entry.id})

    # When - The user retrieves the entry
    response = authenticated_client.get(url)

    # Then - The response is forbidden
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_add_thought_to_entry(authenticated_client, user):
    """User can add a new Thought to an Entry they have permissions for."""

    # Given - An Entry with view and add permissions
    entry = EntryFactory()
    assign_perm("view_entry", user, entry)

    url = reverse("entry-add-thought", kwargs={"pk": entry.id})

    # Given - Thought data
    thought_data = {"content": "New insightful thought"}

    # When - The user posts a new Thought to the Entry
    response = authenticated_client.post(url, thought_data)

    print(response.json())

    # Then - The response is successful and Thought is added
    assert response.status_code == status.HTTP_201_CREATED
    assert Thought.objects.filter(content="New insightful thought", entry=entry).exists()


@pytest.mark.django_db
def test_add_thought_to_entry_without_permission(authenticated_client, user):
    """User cannot add a new Thought to an Entry they do not have permissions for."""

    # Given - An Entry without add permissions
    entry = EntryFactory()

    url = reverse("entry-add-thought", kwargs={"pk": entry.id})

    # Given - Thought data
    thought_data = {"content": "Unauthorized thought"}

    # When - The user tries to post a Thought to the Entry
    response = authenticated_client.post(url, thought_data)

    # Then - The response should be forbidden
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert not Thought.objects.filter(content="Unauthorized thought", entry=entry).exists()


@pytest.mark.django_db
def test_edit_thought_with_permission(authenticated_client, user):
    """User can edit an existing Thought when they have the appropriate permissions."""

    # Given - An existing Thought with edit permissions
    entry = EntryFactory()
    thought = ThoughtFactory(entry=entry, content="Original thought")
    assign_perm("view_entry", user, entry)
    assign_perm("change_thought", user, thought)

    url = reverse("entry-edit-thought", kwargs={"pk": entry.id, "thought_id": thought.id})

    # Given - Updated Thought data
    updated_thought_data = {"content": "Updated thought"}

    # When - The user updates the Thought
    response = authenticated_client.put(url, updated_thought_data)

    # Then - The response is successful and Thought is updated
    assert response.status_code == status.HTTP_200_OK
    thought.refresh_from_db()
    assert thought.content == "Updated thought"


@pytest.mark.django_db
def test_edit_thought_without_permission(authenticated_client, user):
    """User cannot edit an existing Thought without the appropriate permissions."""

    # Given - An existing Thought without edit permissions
    entry = EntryFactory()
    thought = ThoughtFactory(entry=entry, content="Original thought")

    url = reverse("entry-edit-thought", kwargs={"pk": entry.id, "thought_id": thought.id})

    # Given - Updated Thought data
    updated_thought_data = {"content": "Updated thought"}

    # When - The user tries to update the Thought
    response = authenticated_client.put(url, updated_thought_data)

    # Then - The response should be forbidden
    assert response.status_code == status.HTTP_404_NOT_FOUND
    thought.refresh_from_db()
    assert thought.content == "Original thought"


@pytest.mark.django_db
def test_delete_thought_with_permission(authenticated_client, user):
    """User can delete an existing Thought when they have the appropriate permissions."""

    # Given - An existing Thought with delete permissions
    entry = EntryFactory()
    thought = ThoughtFactory(entry=entry, content="Deletable thought")
    assign_perm("view_entry", user, entry)
    assign_perm("delete_thought", user, thought)

    url = reverse("entry-delete-thought", kwargs={"pk": entry.id, "thought_id": thought.id})

    # When - The user deletes the Thought
    response = authenticated_client.delete(url)

    # Then - The response is successful and Thought is deleted
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Thought.objects.filter(id=thought.id).exists()


@pytest.mark.django_db
def test_delete_thought_without_permission(authenticated_client, user):
    """User cannot delete an existing Thought without the appropriate permissions."""

    # Given - An existing Thought without delete permissions
    entry = EntryFactory()
    thought = ThoughtFactory(entry=entry, content="Non-deletable thought")

    url = reverse("entry-delete-thought", kwargs={"pk": entry.id, "thought_id": thought.id})

    # When - The user tries to delete the Thought
    response = authenticated_client.delete(url)

    # Then - The response should be forbidden
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert Thought.objects.filter(id=thought.id).exists()
