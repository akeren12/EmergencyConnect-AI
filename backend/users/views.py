from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema

from utils.supabase_client import get_supabase

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    RegisterResponseSerializer,
    LoginResponseSerializer,
)


@extend_schema(
    request=RegisterSerializer,
    responses={
        201: RegisterResponseSerializer,
        400: None,
    },
    summary="Register User",
    description="Register a new user using Supabase Authentication.",
)
@api_view(["POST"])
def register(request):
    """
    Register a new user using Supabase Authentication.
    """

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {
                "error": "Email and password are required"
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        supabase = get_supabase()

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
            {
                "error": "Registration failed"
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception as e:
        return Response(
            {
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@extend_schema(
    request=LoginSerializer,
    responses={
        200: LoginResponseSerializer,
        400: None,
    },
    summary="Login User",
    description="Login using Supabase Authentication.",
)
@api_view(["POST"])
def login(request):
    """
    Login an existing user using Supabase Authentication.
    """

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {
                "error": "Email and password are required"
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        supabase = get_supabase()

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
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "error": "Invalid credentials"
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception as e:
        return Response(
            {
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST,
        )