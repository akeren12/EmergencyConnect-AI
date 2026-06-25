"""
Views for emergency reports and resources.
"""

from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from .models import (
    EmergencyContact,
    EmergencyReport,
    SafetyTip,
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
    permission_classes = [IsAuthenticated]

    serializer_class = EmergencyContactSerializer

    pagination_class = EmergencyPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "relationship"]

    def get_queryset(self):
        return EmergencyContact.objects.filter(
            user_id=self.request.user.id
        )

    def perform_create(self, serializer):
        serializer.save(
            user_id=self.request.user.id
        )


class EmergencyReportViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    serializer_class = EmergencyReportSerializer

    pagination_class = EmergencyPagination
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "title",
        "emergency_type",
        "location",
    ]

    def get_queryset(self):
        return EmergencyReport.objects.filter(
            user_id=self.request.user.id
        )

    def perform_create(self, serializer):
        serializer.save(
            user_id=self.request.user.id
        )


class SafetyTipViewSet(viewsets.ModelViewSet):
    queryset = SafetyTip.objects.all()

    serializer_class = SafetyTipSerializer

    permission_classes = [IsAuthenticated]