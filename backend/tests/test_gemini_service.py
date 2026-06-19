from ai_assistant.gemini_service import (
    fallback_response,
    parse_json,
)


def test_fallback_response():

    response = fallback_response()

    assert response["priority"] == "HIGH"

    assert "first_aid" in response


def test_parse_json_valid():

    text = """
    {
        "emergency_type":"Fire",
        "priority":"HIGH",
        "summary":"Fire detected",
        "first_aid":["Call emergency services"],
        "disclaimer":"AI guidance"
    }
    """

    data = parse_json(text)

    assert data["priority"] == "HIGH"


def test_parse_json_invalid():

    data = parse_json("invalid json")

    assert data["priority"] == "HIGH"