from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from utils.supabase_client import supabase


@api_view(["POST"])
def register(request):

    email = request.data.get("email")
    password = request.data.get("password")

    response = supabase.auth.sign_up(
        {
            "email": email,
            "password": password,
        }
    )

    if response.user:
        return Response(
            {
                "message": "User registered successfully",
                "email": response.user.email,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {"error": "Registration failed"},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
def login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    response = supabase.auth.sign_in_with_password(
        {
            "email": email,
            "password": password,
        }
    )

    if response.user:
        return Response(
            {
                "message": "Login successful",
                "email": response.user.email,
                "access_token": response.session.access_token,
            }
        )

    return Response(
        {"error": "Invalid credentials"},
        status=status.HTTP_400_BAD_REQUEST,
    )