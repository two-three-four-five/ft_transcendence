from rest_framework import serializers
from user.serializers import UserSerializer
from notification.models import Notification, NotificationType


class NotificationSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    type = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = "__all__"

    def get_type(self, obj):
        return NotificationType(obj.type).name
