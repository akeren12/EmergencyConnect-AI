from rest_framework.test import APIClient

client = APIClient()


def test_home():

    response = client.get("/")

    assert response.status_code == 200


def test_swagger():

    response = client.get("/api/schema/")

    assert response.status_code == 200