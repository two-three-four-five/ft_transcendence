from django.urls import path

from .views import UserMyselfView


# host/user/
urlpatterns = [
    path("me", UserMyselfView.as_view()),
]
