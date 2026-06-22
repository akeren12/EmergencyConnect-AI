"""
Views for AI-powered emergency analysis endpoints.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit

from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
)

from .gemini_service import generate_ai_response

from .serializers import (
    AIRequestSerializer,
    AIResponseSerializer,
    AIAnalysisSerializer,
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
    request=AIRequestSerializer,
    responses={
        200: AIResponseSerializer,
        400: None,
    },
    examples=[
        OpenApiExample(
            "Cardiac Arrest",
            value={
                "description": "A person is unconscious and not breathing."
            },
        )
    ],
)
@method_decorator(
    ratelimit(
        key="ip",
        rate="10/m",
        method="POST"
    ),
    name="post"
)
class AIAnalysisView(APIView):
    """
    Analyze emergency descriptions using Gemini AI.
    """

    def post(self, request):

        serializer = AIAnalysisSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        description = serializer.validated_data[
            "description"
        ]

        result = generate_ai_response(
            description
        )

        return Response(
            result,
            status=status.HTTP_200_OK
        )