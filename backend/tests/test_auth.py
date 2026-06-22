"""
Unit tests for User Authentication Views.
"""

from unittest.mock import Mock, patch
from rest_framework.test import APIClient

client = APIClient()


# =====================================================
# Register Tests
# =====================================================

@patch("users.views.get_supabase")
def test_register_success(mock_get_supabase):

    mock_supabase = Mock()

    fake_response = Mock()

    fake_user = Mock()
    fake_user.email = "pytest@test.com"

    fake_response.user = fake_user

    mock_supabase.auth.sign_up.return_value = fake_response
    mock_get_supabase.return_value = mock_supabase

    response = client.post(
        "/api/users/register/",
        {
            "email": "pytest@test.com",
            "password": "Password123",
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.data["message"] == "User registered successfully"
    assert response.data["email"] == "pytest@test.com"


@patch("users.views.get_supabase")
def test_register_failure(mock_get_supabase):

    mock_supabase = Mock()

    fake_response = Mock()
    fake_response.user = None

    mock_supabase.auth.sign_up.return_value = fake_response
    mock_get_supabase.return_value = mock_supabase

    response = client.post(
        "/api/users/register/",
        {
            "email": "pytest@test.com",
            "password": "Password123",
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.data["error"] == "Registration failed"


# =====================================================
# Login Tests
# =====================================================

@patch("users.views.get_supabase")
def test_login_success(mock_get_supabase):

    mock_supabase = Mock()

    fake_response = Mock()

    fake_user = Mock()
    fake_user.email = "pytest@test.com"

    fake_session = Mock()
    fake_session.access_token = "fake-access-token"

    fake_response.user = fake_user
    fake_response.session = fake_session

    mock_supabase.auth.sign_in_with_password.return_value = fake_response
    mock_get_supabase.return_value = mock_supabase

    response = client.post(
        "/api/users/login/",
        {
            "email": "pytest@test.com",
            "password": "Password123",
        },
        format="json",
    )

    assert response.status_code == 200
    assert response.data["message"] == "Login successful"
    assert response.data["email"] == "pytest@test.com"
    assert response.data["access_token"] == "fake-access-token"


@patch("users.views.get_supabase")
def test_login_failure(mock_get_supabase):

    mock_supabase = Mock()

    fake_response = Mock()
    fake_response.user = None

    mock_supabase.auth.sign_in_with_password.return_value = fake_response
    mock_get_supabase.return_value = mock_supabase

    response = client.post(
        "/api/users/login/",
        {
            "email": "pytest@test.com",
            "password": "WrongPassword",
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.data["error"] == "Invalid credentials"