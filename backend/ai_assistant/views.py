from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .gemini_service import generate_ai_response


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

        result = generate_ai_response(description)

        return Response(result)
def emergency_view(request):
    description = request.GET.get('description', '')
    # The view doesn't know HOW it's analyzed, it just gets the result
    result = generate_ai_response(description)
    return JsonResponse(result) 

