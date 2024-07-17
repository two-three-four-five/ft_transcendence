from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import FriendRequestStatus, FriendRequest, Friend
from .serializers import UserSerializer, FriendRequestSerializer, FriendSerializer
from user.models import User


class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        to_user_nickname = request.data.get("nickname")
        to_user = User.objects.filter(nickname=to_user_nickname).first()
        # if already friend : 400 BAD REQUEST
        if Friend.objects.filter(user=request.user, friend=to_user).exists():
            return Response(
                {"detail": "Already Friends."}, status=status.HTTP_400_BAD_REQUEST
            )
        if not to_user:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )
        if FriendRequest.objects.filter(
            from_user=request.user,
            to_user=to_user,
            status=FriendRequestStatus.PENDING.value,
        ).exists():
            return Response(
                {"detail": "Friend request already sent."},
                status=status.HTTP_409_CONFLICT,
            )

        friend_request = FriendRequest(from_user=request.user, to_user=to_user)
        friend_request.save()
        return Response(
            FriendRequestSerializer(friend_request).data, status=status.HTTP_201_CREATED
        )

    def list(self, request, *args, **kwargs):
        requests = FriendRequest.objects.filter(
            to_user=request.user, status=FriendRequestStatus.PENDING.value
        )
        return Response(FriendRequestSerializer(requests, many=True).data)

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        friend_request = self.get_object()
        if friend_request.to_user != request.user:
            return Response(
                {
                    "detail": "You are not allowed to accept this friend request.",
                    "friend_request": FriendRequestSerializer(friend_request).data,
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if friend_request.status != FriendRequestStatus.PENDING.value:
            return Response(
                {
                    "detail": "You cannot accept this friend request.",
                    "friend_request": FriendRequestSerializer(friend_request).data,
                },
                status=status.HTTP_409_CONFLICT,
            )
        if Friend.objects.filter(
            user=friend_request.to_user, friend=friend_request.from_user
        ).exists():
            return Response(
                {
                    "detail": "You are already friend.",
                    "friend_request": FriendRequestSerializer(friend_request).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        Friend.objects.create(
            user=friend_request.from_user, friend=friend_request.to_user
        )
        Friend.objects.create(
            user=friend_request.to_user, friend=friend_request.from_user
        )
        friend_request.status = FriendRequestStatus.ACCEPTED.value
        friend_request.save()
        return Response(
            {
                "detail": "Friend request accepted.",
                "friend_request": FriendRequestSerializer(friend_request).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def decline(self, request, pk=None):
        friend_request = self.get_object()
        if friend_request.to_user != request.user:
            return Response(
                {
                    "detail": "You are not allowed to decline this friend request.",
                    "friend_request": FriendRequestSerializer(friend_request).data,
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if friend_request.status != FriendRequestStatus.PENDING.value:
            return Response(
                {
                    "detail": "You cannot decline this friend request.",
                    "friend_request": FriendRequestSerializer(friend_request).data,
                },
                status=status.HTTP_409_CONFLICT,
            )
        if Friend.objects.filter(
            user=friend_request.to_user, friend=friend_request.from_user
        ).exists():
            return Response(
                {
                    "detail": "You are already friend.",
                    "friend_request": FriendRequestSerializer(friend_request).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        friend_request.status = FriendRequestStatus.DECLINED.value
        friend_request.save()
        return Response(
            {
                "detail": "Friend request declined.",
                "friend_request": FriendRequestSerializer(friend_request).data,
            },
            status=status.HTTP_200_OK,
        )


class FriendViewSet(viewsets.ModelViewSet):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        friends = Friend.objects.filter(Q(user=request.user))
        return Response(FriendSerializer(friends, many=True).data)

    def destroy(self, request, *args, **kwargs):
        friend_pk = kwargs.get("pk")
        try:
            friend = Friend.objects.get(pk=friend_pk)
            if friend.user == request.user:
                Friend.objects.filter(
                    Q(user=friend.user, friend=friend.friend)
                    | Q(user=friend.friend, friend=friend.user)
                ).delete()
                return Response(
                    {"detail": "Friend deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                Response(
                    {"detail": "You cannot delete this friendship"},
                    status=status.HTTP_403_FORBIDDEN,
                )
        except Friend.DoesNotExist:
            return Response(
                {"detail": "Friend not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
