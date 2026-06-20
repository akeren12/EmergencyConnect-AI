
"""
Unit tests for Emergency Serializers.
"""

from emergency.serializers import (
    EmergencyContactSerializer,
    EmergencyReportSerializer,
    SafetyTipSerializer,
)


# =====================================================
# EmergencyContactSerializer Tests
# =====================================================

def test_emergency_contact_serializer_valid():

    data = {
        "name": "John Doe",
        "phone_number": "9876543210",
        "relationship": "Friend",
    }

    serializer = EmergencyContactSerializer(data=data)

    assert serializer.is_valid()

    assert serializer.validated_data["name"] == "John Doe"
    assert serializer.validated_data["phone_number"] == "9876543210"
    assert serializer.validated_data["relationship"] == "Friend"


def test_emergency_contact_serializer_missing_name():

    data = {
        "phone_number": "9876543210",
        "relationship": "Friend",
    }

    serializer = EmergencyContactSerializer(data=data)

    assert not serializer.is_valid()

    assert "name" in serializer.errors


def test_emergency_contact_serializer_missing_phone_number():

    data = {
        "name": "John Doe",
        "relationship": "Friend",
    }

    serializer = EmergencyContactSerializer(data=data)

    assert not serializer.is_valid()

    assert "phone_number" in serializer.errors


# =====================================================
# EmergencyReportSerializer Tests
# =====================================================

def test_emergency_report_serializer_valid():

    data = {
        "title": "Road Accident",
        "description": "Two vehicles collided",
        "emergency_type": "Accident",
        "severity": "HIGH",
        "location": "Kochi",
        "image_url": "https://example.com/image.jpg",
    }

    serializer = EmergencyReportSerializer(data=data)

    assert serializer.is_valid()

    assert serializer.validated_data["title"] == "Road Accident"
    assert serializer.validated_data["severity"] == "HIGH"
    assert serializer.validated_data["location"] == "Kochi"


def test_emergency_report_serializer_without_image():

    data = {
        "title": "Fire",
        "description": "Small kitchen fire",
        "emergency_type": "Fire",
        "severity": "MEDIUM",
        "location": "Ernakulam",
    }

    serializer = EmergencyReportSerializer(data=data)

    assert serializer.is_valid()


def test_emergency_report_serializer_missing_title():

    data = {
        "description": "Missing title",
        "emergency_type": "Fire",
        "severity": "HIGH",
        "location": "Kochi",
    }

    serializer = EmergencyReportSerializer(data=data)

    assert not serializer.is_valid()

    assert "title" in serializer.errors


# =====================================================
# SafetyTipSerializer Tests
# =====================================================

def test_safety_tip_serializer_valid():

    data = {
        "title": "Fire Safety",
        "tip": "Use the nearest exit immediately.",
    }

    serializer = SafetyTipSerializer(data=data)

    assert serializer.is_valid()

    assert serializer.validated_data["title"] == "Fire Safety"
    assert (
        serializer.validated_data["tip"]
        == "Use the nearest exit immediately."
    )


def test_safety_tip_serializer_missing_title():

    data = {
        "tip": "Stay calm.",
    }

    serializer = SafetyTipSerializer(data=data)

    assert not serializer.is_valid()

    assert "title" in serializer.errors


def test_safety_tip_serializer_missing_tip():

    data = {
        "title": "General Safety",
    }

    serializer = SafetyTipSerializer(data=data)

    assert not serializer.is_valid()

    assert "tip" in serializer.errors

