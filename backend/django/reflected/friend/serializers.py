from rest_framework import serializers

from user.serializers import UserSerializer
from friend.models import FriendRequestStatus, FriendRequest, Friend


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = FriendRequest
        fields = "__all__"

    def get_status(self, obj):
        return FriendRequestStatus(obj.status).name


class FriendSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    friend = UserSerializer(read_only=True)

    class Meta:
        model = Friend
        fields = ("id", "user", "friend", "created_at")
