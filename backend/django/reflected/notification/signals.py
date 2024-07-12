from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from friend.models import FriendRequest
from notification.models import Notification, NotificationType


@receiver(post_save, sender=FriendRequest)
def create_friend_request_notification(sender, instance, created, **kwargs):
    if created:  # and instance.status == FriendRequestStatus.PENDING.value
        Notification.objects.create(
            from_user=instance.from_user,
            to_user=instance.to_user,
            type=NotificationType.FRIEND_REQUEST.value,
        )


@receiver(post_save, sender=Notification)
def send_notification(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{instance.to_user.id}",
            {
                "type": "send_notification",
                "notification_type": f"{instance.type}",
                "from_user": f"{instance.from_user.nickname}",
            },
        )
