from django.shortcuts import HttpResponseRedirect, redirect
from django.utils import timezone

from urllib.parse import urlencode

from rest_framework.views import APIView
from rest_framework.response import Response

import requests

from user.models import User, SocialType

from rest_framework_simplejwt.tokens import RefreshToken

from reflected.settings import HOSTNAME, NGINX_PORT, DJANGO_PORT, FORTYTWO_CLIENT_ID, FORTYTWO_SECRET, GOOGLE_CLIENT_ID


class OAuthFtView(APIView):
    def get(self, request, format=None):
        base_url = "https://api.intra.42.fr/oauth/authorize"

        params = {
            "client_id": FORTYTWO_CLIENT_ID,
            "redirect_uri": "http://"
            + HOSTNAME
            + ":"
            + DJANGO_PORT
            + "/v1/auth/oauth/ft/callback",
            "response_type": "code",
        }
        url = f"{base_url}?{urlencode(params)}"
        return redirect(url)


class OauthFtCallbackView(APIView):
    def get(self, request, *args, **kwargs):
        code = request.query_params.get("code")
        if not code:
            return Response({"error": "Code not provided"}, status=400)

        try:
            token_response = requests.post(
                "https://api.intra.42.fr/oauth/token",
                data={
                    "grant_type": "authorization_code",
                    "client_id": FORTYTWO_CLIENT_ID,
                    "client_secret": FORTYTWO_SECRET,
                    "code": code,
                    "redirect_uri": "http://"
                    + HOSTNAME
                    + ":"
                    + DJANGO_PORT
                    + "/v1/auth/oauth/ft/callback",
                },
            )
            token_response_data = token_response.json()

            if token_response.status_code != 200:
                raise Exception(
                    {
                        "error": "Failed to fetch access token",
                        "details": token_response_data,
                        "status": token_response.status_code,
                    }
                )

            access_token = token_response_data.get("access_token")

            user_response = requests.get(
                "https://api.intra.42.fr/v2/me",
                headers={
                    "Authorization": f"Bearer {access_token}",
                },
            )

            user_reponse_data = user_response.json()  # error check needed?
            ft_id = user_reponse_data.get("id")  # error check needed?

            if User.objects.filter(
                social_id=ft_id, social_type=SocialType.Ft.value
            ).exists():
                user = User.objects.get(
                    social_type=SocialType.Ft.value, social_id=ft_id
                )
                user.last_login = timezone.now()
                user.save()
            else:
                user = User.objects.create_user(
                    email=user_reponse_data.get("email"),
                    nickname=user_reponse_data.get("login") + ".42",
                    social_type=SocialType.Ft.value,
                    social_id=ft_id,
                )
            refresh = RefreshToken.for_user(user)

            tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}
            return redirect(
                "http://"
                + HOSTNAME
                + ":"
                + NGINX_PORT
                + f'/#access_token={tokens["access"]}&refresh_token={tokens["refresh"]}'
            )

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class OAuthGoogleView(APIView):
    def get(self, request, format=None):
        return


class OAuthGoogleCallbackView(APIView):
    def get(self, request, format=None):
        return
