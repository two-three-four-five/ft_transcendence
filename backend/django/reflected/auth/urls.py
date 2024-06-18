from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from .views import (
    OAuthFtView,
    OauthFtCallbackView,
    OAuthGoogleView,
    OAuthGoogleCallbackView,
    OAuthNaverView,
    OAuthNaverCallbackView,
    OAuthKakaoView,
    OAuthKakaoCallbackView,
)

# host/v1/auth/
urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("oauth/ft", OAuthFtView.as_view()),
    path("oauth/ft/callback", OauthFtCallbackView.as_view()),
    path("oauth/google", OAuthGoogleView.as_view()),
    path("oauth/google/callback", OAuthGoogleCallbackView.as_view()),
    path("oauth/naver", OAuthNaverView.as_view()),
    path("oauth/naver/callback", OAuthNaverCallbackView.as_view()),
    path("oauth/kakao", OAuthKakaoView.as_view()),
    path("oauth/kakao/callback", OAuthKakaoCallbackView.as_view()),
]
