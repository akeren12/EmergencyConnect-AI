from rest_framework.test import APIClient
from unittest.mock import Mock, patch
from rest_framework.test import APIClient
client = APIClient()


client = APIClient()


@patch("users.views.supabase.auth.sign_up")
def test_register(mock_signup):

    fake_response = Mock()
    fake_user = Mock()

    fake_user.email = "pytest@test.com"
    fake_response.user = fake_user

    mock_signup.return_value = fake_response

    response = client.post(
        "/api/users/register/",
        {
            "email": "pytest@test.com",
            "password": "Password123",
        },
        format="json",
    )

    assert response.status_code == 201


def test_login():

    response = client.post(

        "/api/users/login/",

        {

            "email": "pytest@test.com",

            "password": "Password123"

        },

        format="json"

    )

    assert response.status_code == 200