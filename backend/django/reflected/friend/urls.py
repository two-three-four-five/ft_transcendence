from rest_framework.routers import DefaultRouter
from .views import FriendRequestViewSet, FriendViewSet

FriendRouter = DefaultRouter()

FriendRouter.register(r"requests", FriendRequestViewSet, basename="requests")
FriendRouter.register(r"", FriendViewSet, basename="friends")
