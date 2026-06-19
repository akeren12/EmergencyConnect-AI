
from unittest.mock import Mock, patch

from ai_assistant.gemini_service import (
    fallback_response,
    parse_json,
    get_gemini_client,
    get_supabase_client,
    save_to_supabase,
    health_check,
    generate_ai_response,
)


# =====================================================
# Gemini Client Tests
# =====================================================

def test_get_gemini_client_without_key():

    with patch("ai_assistant.gemini_service.GEMINI_API_KEY", None):

        assert get_gemini_client() is None


@patch("ai_assistant.gemini_service.genai.Client")
def test_get_gemini_client_success(mock_client):

    with patch(
        "ai_assistant.gemini_service.GEMINI_API_KEY",
        "fake-api-key",
    ):

        mock_client.return_value = Mock()

        assert get_gemini_client() is not None


@patch("ai_assistant.gemini_service.genai.Client")
def test_get_gemini_client_exception(mock_client):

    with patch(
        "ai_assistant.gemini_service.GEMINI_API_KEY",
        "fake-api-key",
    ):

        mock_client.side_effect = Exception()

        assert get_gemini_client() is None


# =====================================================
# Supabase Client Tests
# =====================================================

def test_get_supabase_client_without_keys():

    with patch("ai_assistant.gemini_service.SUPABASE_URL", None):

        assert get_supabase_client() is None


@patch("ai_assistant.gemini_service.create_client")
def test_get_supabase_client_success(mock_create):

    with patch(
        "ai_assistant.gemini_service.SUPABASE_URL",
        "url",
    ), patch(
        "ai_assistant.gemini_service.SUPABASE_KEY",
        "key",
    ):

        mock_create.return_value = Mock()

        assert get_supabase_client() is not None


@patch("ai_assistant.gemini_service.create_client")
def test_get_supabase_client_exception(mock_create):

    with patch(
        "ai_assistant.gemini_service.SUPABASE_URL",
        "url",
    ), patch(
        "ai_assistant.gemini_service.SUPABASE_KEY",
        "key",
    ):

        mock_create.side_effect = Exception()

        assert get_supabase_client() is None


# =====================================================
# Fallback Response Tests
# =====================================================

def test_fallback_response():

    response = fallback_response()

    assert response["priority"] == "HIGH"
    assert response["emergency_type"] == "Unknown Emergency"
    assert isinstance(response["first_aid"], list)


# =====================================================
# JSON Parsing Tests
# =====================================================

def test_parse_json_markdown():

    text = """
    ```json
    {
        "emergency_type":"Fire",
        "priority":"HIGH",
        "summary":"Fire Emergency",
        "first_aid":["Call emergency services"],
        "disclaimer":"AI"
    }
    ```
    """

    data = parse_json(text)

    assert data["emergency_type"] == "Fire"
    assert data["priority"] == "HIGH"


def test_parse_json_invalid():

    data = parse_json("Not a JSON string")

    assert data["priority"] == "HIGH"
    assert data["emergency_type"] == "Unknown Emergency"


# =====================================================
# Supabase Save Tests
# =====================================================

@patch("ai_assistant.gemini_service.get_supabase_client")
def test_save_to_supabase_without_client(mock_client):

    mock_client.return_value = None

    save_to_supabase(
        "test input",
        {"result": "ok"},
    )


@patch("ai_assistant.gemini_service.get_supabase_client")
def test_save_to_supabase_success(mock_client):

    fake_client = Mock()

    fake_client.table.return_value.insert.return_value.execute.return_value = {
        "status": "success"
    }

    mock_client.return_value = fake_client

    save_to_supabase(
        "test",
        {"priority": "HIGH"},
    )

    fake_client.table.assert_called_once_with("ai_logs")


@patch("ai_assistant.gemini_service.get_supabase_client")
def test_save_to_supabase_exception(mock_client):

    fake_client = Mock()

    fake_client.table.side_effect = Exception("Insert failed")

    mock_client.return_value = fake_client

    save_to_supabase(
        "test",
        {"priority": "HIGH"},
    )


# =====================================================
# Health Check Tests
# =====================================================

@patch("ai_assistant.gemini_service.get_gemini_client")
def test_health_check_offline(mock_client):

    mock_client.return_value = None

    response = health_check()

    assert response["status"] == "offline"


@patch("ai_assistant.gemini_service.get_gemini_client")
def test_health_check_online(mock_client):

    fake = Mock()

    fake.models.generate_content.return_value.text = "OK"

    mock_client.return_value = fake

    response = health_check()

    assert response["status"] == "online"
    assert response["message"] == "OK"


@patch("ai_assistant.gemini_service.get_gemini_client")
def test_health_check_exception(mock_client):

    fake = Mock()

    fake.models.generate_content.side_effect = Exception()

    mock_client.return_value = fake

    response = health_check()

    assert response["status"] == "offline"


# =====================================================
# AI Response Tests
# =====================================================

@patch("ai_assistant.gemini_service.get_gemini_client")
@patch("ai_assistant.gemini_service.save_to_supabase")
def test_generate_ai_response_without_client(
    mock_save,
    mock_client,
):

    mock_client.return_value = None

    response = generate_ai_response("Help!")

    assert response["priority"] == "HIGH"

    mock_save.assert_called_once()


@patch("ai_assistant.gemini_service.get_gemini_client")
@patch("ai_assistant.gemini_service.save_to_supabase")
def test_generate_ai_response_success(
    mock_save,
    mock_client,
):

    fake = Mock()

    fake.models.generate_content.return_value.text = """
    {
        "emergency_type":"Cardiac Arrest",
        "priority":"CRITICAL",
        "summary":"Medical Emergency",
        "first_aid":["Call ambulance"],
        "disclaimer":"AI"
    }
    """

    mock_client.return_value = fake

    response = generate_ai_response(
        "Person collapsed and is unconscious"
    )

    assert response["priority"] == "CRITICAL"
    assert response["emergency_type"] == "Cardiac Arrest"

    mock_save.assert_called_once()


@patch("ai_assistant.gemini_service.time.sleep")
@patch("ai_assistant.gemini_service.get_gemini_client")
@patch("ai_assistant.gemini_service.save_to_supabase")
def test_generate_ai_retry(
    mock_save,
    mock_client,
    mock_sleep,
):

    fake = Mock()

    success = Mock()

    success.text = """
    {
        "emergency_type":"Fire",
        "priority":"HIGH",
        "summary":"Building Fire",
        "first_aid":["Evacuate immediately"],
        "disclaimer":"AI"
    }
    """

    fake.models.generate_content.side_effect = [
        Exception("Temporary Error"),
        success,
    ]

    mock_client.return_value = fake

    response = generate_ai_response("Fire in apartment")

    assert response["priority"] == "HIGH"

    mock_sleep.assert_called_once()

    mock_save.assert_called_once()


@patch("ai_assistant.gemini_service.time.sleep")
@patch("ai_assistant.gemini_service.get_gemini_client")
@patch("ai_assistant.gemini_service.save_to_supabase")
def test_generate_ai_retry_failure(
    mock_save,
    mock_client,
    mock_sleep,
):

    fake = Mock()

    fake.models.generate_content.side_effect = Exception("API Error")

    mock_client.return_value = fake

    response = generate_ai_response("Help")

    assert response["priority"] == "HIGH"

    assert mock_sleep.call_count == 2

    mock_save.assert_called_once()


@patch("ai_assistant.gemini_service.get_gemini_client")
@patch("ai_assistant.gemini_service.save_to_supabase")
def test_generate_ai_long_input(
    mock_save,
    mock_client,
):

    fake = Mock()

    fake.models.generate_content.return_value.text = """
    {
        "emergency_type":"Test",
        "priority":"LOW",
        "summary":"Test Summary",
        "first_aid":["Step 1"],
        "disclaimer":"AI"
    }
    """

    mock_client.return_value = fake

    response = generate_ai_response("A" * 5000)

    assert response["priority"] == "LOW"

    mock_save.assert_called_once()


@patch("ai_assistant.gemini_service.get_gemini_client")
def test_generate_ai_empty_input(mock_client):

    mock_client.return_value = Mock()

    response = generate_ai_response("")

    assert response["priority"] == "HIGH"

