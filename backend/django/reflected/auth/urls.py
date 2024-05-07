from django.urls import path

from .views import (
    OAuthFtView,
    OauthFtCallbackView,
    # OAuthGoogleView,
    # OAuthGoogleCallbackView,
)


# host/auth/
urlpatterns = [
    path("oauth/ft", OAuthFtView.as_view()),
    path("oauth/ft/callback", OauthFtCallbackView.as_view()),
    # path("oauth/google", OAuthFtView.as_view()),
    # path("oauth/google/callback", OauthFtCallbackView.as_view()),
]
