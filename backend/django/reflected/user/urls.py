from django.urls import path

from .views import UserTestView


# host/auth/
urlpatterns = [
    path("test/", UserTestView.as_view()),
]
