from rest_framework.routers import DefaultRouter

from .views import (
    EmergencyContactViewSet,
    EmergencyReportViewSet,
    SafetyTipViewSet,
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

router.register(

r"tips",

SafetyTipViewSet,

basename="tips"

)


urlpatterns = router.urls