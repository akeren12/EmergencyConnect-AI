from rest_framework.routers import DefaultRouter

from .views import (
    EmergencyContactViewSet,
    EmergencyReportViewSet,
)

router = DefaultRouter()

router.register(
    r"contacts",
    EmergencyContactViewSet,
    basename="contacts",
)

router.register(
    r"reports",
    EmergencyReportViewSet,
    basename="reports",
)

urlpatterns = router.urls