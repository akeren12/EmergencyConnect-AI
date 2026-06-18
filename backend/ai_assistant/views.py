"""
Views for AI-powered emergency analysis endpoints.
"""
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .gemini_service import generate_ai_response
from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
)


@extend_schema(
    summary="Analyze Emergency",
    description="""
Analyze an emergency description and generate:

• emergency type
• priority
• summary
• first aid recommendations
""",
    examples=[
        OpenApiExample(
            "Cardiac Arrest",
            value={
                "description": "A person is unconscious and not breathing."
            },
        )
    ],
)
class AIAnalysisView(APIView):
    """
    Analyze emergency descriptions using Gemini AI.
    """

    def post(self, request):
        description = request.data.get("description")
        if not description:
            return Response(
                {"error": "Description required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = generate_ai_response(description)
        return Response(result)


def emergency_view(request):
    description = request.GET.get('description', '')
