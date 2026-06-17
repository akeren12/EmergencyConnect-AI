from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
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
    path("api/ai/",include("ai_assistant.urls")),
     path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/swagger-ui/",SpectacularSwaggerView.as_view(url_name="schema"),name="swagger-ui",),
    path("api/schema/redoc/", SpectacularRedocView.as_view(url_name="schema"),name="redoc",),
]