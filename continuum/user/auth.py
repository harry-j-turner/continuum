import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework_simplejwt.authentication import JWTAuthentication


User = get_user_model()


class Auth0Authentication(authentication.BaseAuthentication):

    def authenticate(self, request):

        jwt_authenticator = JWTAuthentication()
        header = jwt_authenticator.get_header(request)

        if header is None:
            return None

        raw_token = jwt_authenticator.get_raw_token(header)
        validated_token = jwt_authenticator.get_validated_token(raw_token)
        payload = validated_token.payload

        user, created = User.objects.get_or_create(sub=payload.get("sub"))

        if created:

            endpoint = settings.SIMPLE_JWT.get("USER_INFO_ENDPOINT", None)
            user_info = requests.get(endpoint, headers={"Authorization": header}).json()

            if email := user_info.get("email"):
                user.username = email
                user.email = email
                user.save()
                user.onboard()

        return (user, validated_token)
