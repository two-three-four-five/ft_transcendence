from django.urls import path

from rest_framework.routers import DefaultRouter
from . import views
from .views import ChatRoomViewSet, ChatViewSet

ChatRouter = DefaultRouter(trailing_slash=False)
ChatRouter.register(r"", ChatViewSet, basename="chats")

ChatRoomRouter = DefaultRouter(trailing_slash=False)
ChatRoomRouter.register(r"", ChatRoomViewSet, basename="chatrooms")
