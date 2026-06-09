from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
try:
    from rest_framework_simplejwt.views import (
        TokenObtainPairView,
        TokenRefreshView,
    )
except Exception:
    # Package may not be installed in the environment used by linters/IDEs.
    # Provide placeholders to avoid import errors during static analysis.
    TokenObtainPairView = None
    TokenRefreshView = None

def home(request):
    return JsonResponse({
        "message": "EmergencyConnect AI Backend Running",
        "status": "success"
    })

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path( "api/emergency/",include("emergency.urls")),
    path("api/token/",TokenObtainPairView.as_view()),
    path("api/token/refresh/",TokenRefreshView.as_view()),
]