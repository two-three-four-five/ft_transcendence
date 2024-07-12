from enum import Enum
from django.db import models
from django.conf import settings


class NotificationType(Enum):
    FRIEND_REQUEST = 0
    FRIEND_APPROVED = 1
    FRIEND_DECLINED = 2
    NEW_CHATTING = 3
    GAME_REQUEST = 4


class Notification(models.Model):
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="notification_sender",
        on_delete=models.CASCADE,
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="notification_receiver",
        on_delete=models.CASCADE,
    )
    type = models.IntegerField(
        choices=[(tag.value, tag.name) for tag in NotificationType],
        default=NotificationType.FRIEND_REQUEST.value,
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} ({self.get_type_display()})"
