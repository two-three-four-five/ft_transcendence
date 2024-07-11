from django.db.models.signals import post_save
from django.dispatch import receiver
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
