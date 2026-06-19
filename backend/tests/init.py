from unittest.mock import patch
from rest_framework.test import APIClient

client = APIClient()


@patch("ai_assistant.gemini_service.generate_ai_response")
def test_ai_endpoint(mock_ai):

    mock_ai.return_value = {

        "emergency_type": "Cardiac Arrest",

        "priority": "CRITICAL",

        "summary": "Person unconscious",

        "first_aid": [

            "Call emergency services"

        ],

        "disclaimer": "AI guidance"

    }

    response = client.post(

        "/api/ai/analyze/",

        {

            "description": "Person collapsed"

        },

        format="json"

    )

    assert response.status_code == 200

    assert response.data["priority"] == "CRITICAL"