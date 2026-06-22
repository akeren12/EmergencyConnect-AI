"""
Views for emergency reports and resources.
"""
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from .models import (
    EmergencyContact,
    EmergencyReport,
    SafetyTip
)

from .serializers import (
    EmergencyContactSerializer,
    EmergencyReportSerializer,
    SafetyTipSerializer,
)


class EmergencyPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 20

class EmergencyContactViewSet(viewsets.ModelViewSet):

    queryset = EmergencyContact.objects.select_related("user")
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = EmergencyPagination

    filter_backends = [filters.SearchFilter]

    search_fields = ["name", "relationship"]
    
class EmergencyReportViewSet(viewsets.ModelViewSet):

    queryset = EmergencyReport.objects.all()

    serializer_class = EmergencyReportSerializer

    permission_classes = [IsAuthenticated]

    pagination_class = EmergencyPagination

    filter_backends = [filters.SearchFilter]

    search_fields = [
        "title",
        "location",
        "emergency_type",
        "severity",
    ]

class SafetyTipViewSet(viewsets.ModelViewSet):

    queryset=SafetyTip.objects.all()

    serializer_class=SafetyTipSerializer

    permission_classes=[IsAuthenticated]