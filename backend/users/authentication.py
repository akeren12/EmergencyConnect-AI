from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from utils.supabase_client import get_supabase


class SupabaseUser:
    def __init__(self, user_data):
        self.user_data = user_data
        self.is_authenticated = True

    @property
    def id(self):
        return self.user_data.id

    @property
    def email(self):
        return self.user_data.email


class SupabaseAuthentication(BaseAuthentication):

    def authenticate(self, request):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None

        try:
            if not auth_header.startswith("Bearer "):
                raise AuthenticationFailed("Invalid auth header")

            token = auth_header.split(" ")[1]

            supabase = get_supabase()

            response = supabase.auth.get_user(token)

            if not response.user:
                raise AuthenticationFailed("Invalid token")

            return (
                SupabaseUser(response.user),
                token,
            )

        except Exception as e:
            raise AuthenticationFailed(str(e))