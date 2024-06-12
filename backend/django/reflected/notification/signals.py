from django.db.models.signals import post_save
from django.dispatch import receiver
from friend.models import FriendRequest, FriendRequestStatus
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@receiver(post_save, sender=FriendRequest)
def send_friend_request_notification(sender, instance, created, **kwargs):
    if created and instance.status == FriendRequestStatus.PENDING.value:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{instance.to_user.id}",
            {
                "type": "send_notification",
                "notification": f"New friend request from {instance.from_user.nickname}",
            },
        )
