from unittest.mock import patch

from rest_framework.test import APIClient

client = APIClient()


def test_ai_missing_description():

    response = client.post(

        "/api/ai/analyze/",

        {},

        format="json",

    )

    assert response.status_code == 400


@patch("ai_assistant.views.generate_ai_response")
def test_ai_success(mock_ai):

    mock_ai.return_value = {

        "emergency_type": "Cardiac Arrest",

        "priority": "CRITICAL",

        "summary": "Person unconscious",

        "first_aid": [

            "Call emergency"

        ],

        "disclaimer": "AI guidance",

    }

    response = client.post(

        "/api/ai/analyze/",

        {

            "description": "Person collapsed"

        },

        format="json",

    )

    assert response.status_code == 200

    assert response.data["priority"] == "CRITICAL"