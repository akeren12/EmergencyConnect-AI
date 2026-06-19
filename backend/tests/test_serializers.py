"""
Tests for Emergency Serializers
"""

from emergency.serializers import (
    EmergencyContactSerializer,
    EmergencyReportSerializer,
    SafetyTipSerializer,
)


def test_emergency_contact_serializer_exists():

    serializer = EmergencyContactSerializer()

    assert serializer is not None


def test_emergency_report_serializer_exists():

    serializer = EmergencyReportSerializer()

    assert serializer is not None


def test_safety_tip_serializer_exists():

    serializer = SafetyTipSerializer()

    assert serializer is not None