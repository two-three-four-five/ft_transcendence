from django.shortcuts import HttpResponseRedirect, redirect
from django.utils import timezone

from urllib.parse import urlencode

from rest_framework.views import APIView
from rest_framework.response import Response

import requests

from user.models import User, SocialType

from rest_framework_simplejwt.tokens import RefreshToken

from reflected.settings import (
	HOSTNAME, 
    NGINX_PORT, 
    DJANGO_PORT, 
    FORTYTWO_CLIENT_ID, 
    FORTYTWO_SECRET, 
    GOOGLE_CLIENT_ID, 
    GOOGLE_SECRET,
    NAVER_CLIENT_ID,
    NAVER_SECRET,
    KAKAO_CLIENT_ID,
    KAKAO_SECRET,
)


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
        base_url = "https://accounts.google.com/o/oauth2/v2/auth"

        params = {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": "http://"
            + HOSTNAME
            + ":"
            + DJANGO_PORT
            + "/v1/auth/oauth/google/callback",
            "response_type": "code",
            "scope": "openid email profile",
        }
        url = f"{base_url}?{urlencode(params)}"
        return redirect(url)


class OAuthGoogleCallbackView(APIView):
    def get(self, request, format=None):
        code = request.query_params.get("code")
        if not code:
            return Response({"error": "Code not provided"}, status=400)

        try:
            token_response = requests.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "grant_type": "authorization_code",
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_SECRET,
                    "code": code,
                    "redirect_uri": "http://"
                    + HOSTNAME
                    + ":"
                    + DJANGO_PORT
                    + "/v1/auth/oauth/google/callback",
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
                "https://www.googleapis.com/oauth2/v1/userinfo",
                headers={
                    "Authorization": f"Bearer {access_token}",
                },
            )

            user_reponse_data = user_response.json()  # error check needed?
            google_id = user_reponse_data.get("id")  # error check needed?

            if User.objects.filter(
                social_id=google_id, social_type=SocialType.Google.value
            ).exists():
                user = User.objects.get(
                    social_type=SocialType.Google.value, social_id=google_id
                )
                user.last_login = timezone.now()
                user.save()
            else:
                user = User.objects.create_user(
                    email=user_reponse_data.get("email"),
                    nickname=user_reponse_data.get("email").split("@")[0] + ".G",
                    social_type=SocialType.Google.value,
                    social_id=google_id,
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

class OAuthNaverView(APIView):
    def get(self, request, format=None):
        base_url = "https://nid.naver.com/oauth2.0/authorize"

        params = {
            "client_id": NAVER_CLIENT_ID,
            "redirect_uri": "http://"
            + HOSTNAME
            + ":"
            + DJANGO_PORT
            + "/v1/auth/oauth/naver/callback",
            "response_type": "code",
            "state": "test",
        }
        url = f"{base_url}?{urlencode(params)}"
        return redirect(url)


class OAuthNaverCallbackView(APIView):
    def get(self, request, format=None):
        code = request.query_params.get("code")
        if not code:
            return Response({"error": "Code not provided"}, status=400)

        try:
            token_response = requests.post(
                "https://nid.naver.com/oauth2.0/token",
                data={
                    "grant_type": "authorization_code",
                    "client_id": NAVER_CLIENT_ID,
                    "client_secret": NAVER_SECRET,
                    "code": code,
                    "state": "test",
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
                "https://openapi.naver.com/v1/nid/me",
                headers={
                    "Authorization": f"Bearer {access_token}",
                },
            )

            user_reponse_data = user_response.json().get("response")  # error check needed?
            
            naver_id = user_reponse_data.get("id")  # error check needed?

            if User.objects.filter(
                social_id=naver_id, social_type=SocialType.Naver.value
            ).exists():
                user = User.objects.get(
                    social_type=SocialType.Naver.value, social_id=naver_id
                )
                user.last_login = timezone.now()
                user.save()
            else:
                user = User.objects.create_user(
                    email=user_reponse_data.get("email"),
                    nickname=user_reponse_data.get("email").split("@")[0] + ".N",
                    social_type=SocialType.Naver.value,
                    social_id=naver_id,
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

class OAuthKakaoView(APIView):
    def get(self, request, format=None):
        base_url = "https://kauth.kakao.com/oauth/authorize"

        params = {
            "client_id": KAKAO_CLIENT_ID,
            "redirect_uri": "http://"
            + HOSTNAME
            + ":"
            + DJANGO_PORT
            + "/v1/auth/oauth/kakao/callback",
            "response_type": "code",
        }
        url = f"{base_url}?{urlencode(params)}"
        return redirect(url)


class OAuthKakaoCallbackView(APIView):
    def get(self, request, format=None):
        code = request.query_params.get("code")
        if not code:
            return Response({"error": "Code not provided"}, status=400)

        try:
            token_response = requests.post(
                "https://kauth.kakao.com/oauth/token",
                data={
                    "grant_type": "authorization_code",
                    "client_id": KAKAO_CLIENT_ID,
                    "client_secret": KAKAO_SECRET,
                    "code": code,
                    "redirect_uri": "http://"
					+ HOSTNAME
					+ ":"
					+ DJANGO_PORT
					+ "/v1/auth/oauth/kakao/callback",
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
                "https://kapi.kakao.com/v2/user/me",
                headers={
                    "Authorization": f"Bearer {access_token}",
                },
            )

            user_reponse_data = user_response.json() # error check needed?
            
            kakao_id = user_reponse_data.get("id")  # error check needed?

            if User.objects.filter(
                social_id=kakao_id, social_type=SocialType.Kakao.value
            ).exists():
                user = User.objects.get(
                    social_type=SocialType.Kakao.value, social_id=kakao_id
                )
                user.last_login = timezone.now()
                user.save()
            else:
                user = User.objects.create_user(
                    email=user_reponse_data.get("kakao_account").get("email"),
                    nickname=user_reponse_data.get("kakao_account").get("email").split("@")[0] + ".K",
                    social_type=SocialType.Kakao.value,
                    social_id=kakao_id,
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
