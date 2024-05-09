from django.urls import path

from .views import UserTestView


# host/user/
urlpatterns = [
    path("test/", UserTestView.as_view()),
]
