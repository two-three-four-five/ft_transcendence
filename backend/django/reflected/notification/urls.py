from django.urls import path
from .views import NotificationListView, NotificationReadView


# host/notification/
urlpatterns = [
    path("", NotificationListView.as_view()),
    path("<int:notification_id>", NotificationReadView.as_view()),
]
