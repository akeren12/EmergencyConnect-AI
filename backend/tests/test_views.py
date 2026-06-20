from rest_framework.test import APIClient

client = APIClient()


def test_home():

    response = client.get("/")

    assert response.status_code == 200


def test_swagger():

    response = client.get("/api/schema/")

    assert response.status_code == 200

from emergency.views import (
    EmergencyContactViewSet,
    EmergencyReportViewSet,
    SafetyTipViewSet,
)
from emergency.serializers import (
    EmergencyContactSerializer,
    EmergencyReportSerializer,
    SafetyTipSerializer,
)


def test_contact_viewset_configuration():
    assert EmergencyContactViewSet.serializer_class == EmergencyContactSerializer
    assert "name" in EmergencyContactViewSet.search_fields
    assert "relationship" in EmergencyContactViewSet.search_fields


def test_report_viewset_configuration():
    assert EmergencyReportViewSet.serializer_class == EmergencyReportSerializer
    assert "title" in EmergencyReportViewSet.search_fields
    assert "location" in EmergencyReportViewSet.search_fields


def test_safetip_viewset_configuration():
    assert SafetyTipViewSet.serializer_class == SafetyTipSerializer