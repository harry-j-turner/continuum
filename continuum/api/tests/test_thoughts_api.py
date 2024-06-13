import pytest
from datetime import datetime, timedelta
from dateutil.parser import parse as parse_date
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from guardian.shortcuts import assign_perm
from thought.tests.factories import ThoughtFactory, TagFactory

from thought.models import Thought


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
def test_create_thought(authenticated_client, user):
    """User can create a new Thought."""

    url = reverse("thought-list")

    # Given - An thought data
    thought_data = {"content": "This is a thought"}

    # When - The user creates a new thought
    response = authenticated_client.post(url, thought_data)

    print(response.json())

    # Then - The response is successful
    assert response.status_code == status.HTTP_201_CREATED

    # And - The thought is created in the database with correct permissions
    assert Thought.objects.filter(content="This is a thought").exists()
    new_thought = Thought.objects.get(content="This is a thought")
    assert user.has_perm("view_thought", new_thought)


@pytest.mark.django_db
def test_list_thoughts_with_permissions(authenticated_client, user):
    """User can list only thoughts they have permission to view."""

    # Given - Two thoughts with view permissions assigned to the user
    thought1 = ThoughtFactory()
    thought2 = ThoughtFactory()
    assign_perm("view_thought", user, thought1)
    assign_perm("view_thought", user, thought2)

    url = reverse("thought-list")

    # When - The user retrieves the list of thoughts
    response = authenticated_client.get(url)

    # Then - The response is successful and includes the thoughts
    assert response.status_code == status.HTTP_200_OK
    results = response.json()["results"]
    assert len(results) == 2


@pytest.mark.django_db
def test_thoughts_are_listed_in_creation_order(authenticated_client, user):
    """Thoughts are listed in creation order."""

    # Given - Two thoughts with view permissions assigned to the user
    thought1 = ThoughtFactory()
    thought2 = ThoughtFactory()
    thought3 = ThoughtFactory()
    assign_perm("view_thought", user, thought1)
    assign_perm("view_thought", user, thought2)
    assign_perm("view_thought", user, thought3)

    thought1.created_at = datetime.now() - timedelta(days=1)
    thought2.created_at = datetime.now() - timedelta(days=2)
    thought3.created_at = datetime.now() - timedelta(days=3)

    thought1.save()
    thought2.save()
    thought3.save()

    url = reverse("thought-list")

    # When - The user retrieves the list of thoughts
    response = authenticated_client.get(url)

    # Then - The response is successful and includes the thoughts
    assert response.status_code == status.HTTP_200_OK
    results = response.json()["results"]
    assert len(results) == 3
    assert results[0]["id"] == str(thought1.id)
    assert results[1]["id"] == str(thought2.id)
    assert results[2]["id"] == str(thought3.id)


@pytest.mark.django_db
def test_max_ten_thoughts_are_listed(authenticated_client, user):
    """No more than ten thoughts are listed."""

    # Given - Eleven thoughts with view permissions assigned to the user
    for _ in range(11):
        thought = ThoughtFactory()
        assign_perm("view_thought", user, thought)

    url = reverse("thought-list")

    # When - The user retrieves the list of thoughts
    response = authenticated_client.get(url)

    # Then - The response is successful and includes the thoughts
    assert response.status_code == status.HTTP_200_OK
    results = response.json()["results"]
    assert len(results) == 10


@pytest.mark.django_db
def test_filter_thoughts_by_start_date(authenticated_client, user):
    """Setting start_date return only thoughts created after that date."""

    # Given - Two thoughts with view permissions assigned to the user
    thought1 = ThoughtFactory()
    thought2 = ThoughtFactory()
    assign_perm("view_thought", user, thought1)
    assign_perm("view_thought", user, thought2)

    thought1.created_at = parse_date("2021-01-01")
    thought2.created_at = parse_date("2021-01-05")

    thought1.save()
    thought2.save()

    url = reverse("thought-list")

    # When - The user retrieves the list of thoughts with a start_date filter
    response = authenticated_client.get(url, {"start_date": "2021-01-03"})

    # Then - The response is successful and includes the thoughts
    assert response.status_code == status.HTTP_200_OK
    results = response.json()["results"]
    assert len(results) == 1
    assert results[0]["id"] == str(thought2.id)


@pytest.mark.django_db
def test_filter_thoughts_by_end_date(authenticated_client, user):
    """Setting end_date return only thoughts created before that date."""

    # Given - Two thoughts with view permissions assigned to the user
    thought1 = ThoughtFactory()
    thought2 = ThoughtFactory()
    assign_perm("view_thought", user, thought1)
    assign_perm("view_thought", user, thought2)

    thought1.created_at = parse_date("2021-01-01")
    thought2.created_at = parse_date("2021-01-05")

    thought1.save()
    thought2.save()

    url = reverse("thought-list")

    # When - The user retrieves the list of thoughts with a end_date filter
    response = authenticated_client.get(url, {"end_date": "2021-01-03"})

    # Then - The response is successful and includes the thoughts
    assert response.status_code == status.HTTP_200_OK
    results = response.json()["results"]
    assert len(results) == 1
    assert results[0]["id"] == str(thought1.id)


@pytest.mark.django_db
def test_filter_thoughts_by_tags(authenticated_client, user):
    """Setting tags return only thoughts with those tags."""

    # Given - Two thoughts with view permissions assigned to the user
    thought1 = ThoughtFactory()
    thought2 = ThoughtFactory()
    assign_perm("view_thought", user, thought1)
    assign_perm("view_thought", user, thought2)

    tag1 = TagFactory(name="tag1")
    tag2 = TagFactory(name="tag2")

    thought1.tags.add(tag1)
    thought2.tags.add(tag2)

    url = reverse("thought-list")

    # When - The user retrieves the list of thoughts with a tags filter
    response = authenticated_client.get(url, {"tags": [tag1.id]})

    # Then - The response is successful and includes the thoughts
    assert response.status_code == status.HTTP_200_OK
    results = response.json()["results"]
    assert len(results) == 1
    assert results[0]["id"] == str(thought1.id)


@pytest.mark.django_db
def test_view_thought(authenticated_client, user):
    """User with permission can view an existing Thought."""

    # Given - An existing Thought with view permission
    thought = ThoughtFactory(content="This is a thought")
    assign_perm("view_thought", user, thought)

    url = reverse("thought-detail", kwargs={"pk": thought.id})

    # When - The user retrieves the Thought
    response = authenticated_client.get(url)

    # Then - The response is successful and includes the Thought
    assert response.status_code == status.HTTP_200_OK
    assert response.data["content"] == "This is a thought"


@pytest.mark.django_db
def test_view_thought_no_permission(authenticated_client, user):
    """User cannot view an entry without permission."""

    # Given - An entry without view permission
    thought = ThoughtFactory(content="This is a thought")

    url = reverse("thought-detail", kwargs={"pk": thought.id})

    # When - The user retrieves the entry
    response = authenticated_client.get(url)

    # Then - The response is forbidden
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_edit_thought(authenticated_client, user):
    """User can edit an existing Thought."""

    # Given - An existing Thought with edit permissions
    thought = ThoughtFactory(content="Original thought")
    assign_perm("change_thought", user, thought)

    url = reverse("thought-detail", kwargs={"pk": thought.id})

    # Given - Updated Thought data
    updated_thought_data = {"content": "Updated thought"}

    # When - The user updates the Thought
    response = authenticated_client.put(url, updated_thought_data)

    # Then - The response is successful and Thought is updated
    assert response.status_code == status.HTTP_200_OK
    thought.refresh_from_db()
    assert thought.content == "Updated thought"


@pytest.mark.django_db
def test_edit_thought_no_permission(authenticated_client, user):
    """User cannot edit an existing Thought without the appropriate permissions."""

    # Given - An existing Thought without edit permissions
    thought = ThoughtFactory(content="Original thought")

    url = reverse("thought-detail", kwargs={"pk": thought.id})

    # Given - Updated Thought data
    updated_thought_data = {"content": "Updated thought"}

    # When - The user tries to update the Thought
    response = authenticated_client.put(url, updated_thought_data)

    # Then - The response should be forbidden
    assert response.status_code == status.HTTP_404_NOT_FOUND
    thought.refresh_from_db()
    assert thought.content == "Original thought"


@pytest.mark.django_db
def test_delete_thought(authenticated_client, user):
    """User can delete an existing Thought."""

    # Given - An existing Thought with delete permissions
    thought = ThoughtFactory(content="Deletable thought")
    assign_perm("delete_thought", user, thought)

    url = reverse("thought-detail", kwargs={"pk": thought.id})

    # When - The user deletes the Thought
    response = authenticated_client.delete(url)

    # Then - The response is successful and Thought is deleted
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Thought.objects.filter(id=thought.id).exists()


@pytest.mark.django_db
def test_delete_thought_no_permission(authenticated_client, user):
    """User cannot delete an existing Thought without the appropriate permissions."""

    # Given - An existing Thought without delete permissions
    thought = ThoughtFactory(content="Non-deletable thought")

    url = reverse("thought-detail", kwargs={"pk": thought.id})

    # When - The user tries to delete the Thought
    response = authenticated_client.delete(url)

    # Then - The response should be forbidden
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert Thought.objects.filter(id=thought.id).exists()
