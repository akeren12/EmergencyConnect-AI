from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .gemini_service import analyze_emergency


class AIAnalysisView(APIView):

    def post(self, request):

        description = request.data.get("description")

        if not description:

            return Response(

                {

                    "error": "Description required"

                },

                status=status.HTTP_400_BAD_REQUEST

            )

        result = analyze_emergency(description)

        return Response(result)
    


