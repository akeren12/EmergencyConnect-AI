from django.urls import path
from .views import AIAnalysisView

urlpatterns = [
    path("analyze/", AIAnalysisView.as_view(), name="ai-analysis"),
]