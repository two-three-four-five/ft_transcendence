from rest_framework.routers import SimpleRouter
from .views import FriendRequestViewSet, FriendViewSet

FriendRouter = SimpleRouter(trailing_slash=False)

FriendRouter.register(r"requests", FriendRequestViewSet, basename="requests")
FriendRouter.register(r"", FriendViewSet, basename="friends")
