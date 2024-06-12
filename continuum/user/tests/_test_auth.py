import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


# Tests
#######


@pytest.mark.django_db
def test_auth0_missing_header(api_client):
    """Test that missing header results in unauthenticated."""

    # Given - No header.

    # When - The user tries to access a protected endpoint.
    response = api_client.get(reverse("tag-list"))

    # Then - The user is unauthenticated.
    assert response.status_code == status.HTTP_403_FORBIDDEN
