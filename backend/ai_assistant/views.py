from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class AIAnalysisView(APIView):

    def post(self, request):

        description = request.data.get("description", "")
        location = request.data.get("location", "")

        # TODO:
        # Build system prompt
        # Call OpenAI API
        # Store response in Supabase

        mock_response = {
            "emergency_type": "Medical Emergency",
            "priority": "High",
            "summary": "AI endpoint skeleton working.",
            "first_aid": [
                "Stay calm.",
                "Contact emergency services if needed."
            ]
        }

        return Response(mock_response, status=status.HTTP_200_OK)