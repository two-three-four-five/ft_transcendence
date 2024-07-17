from enum import Enum
from django.db import models
from django.conf import settings


class FriendRequestStatus(Enum):
    PENDING = 0
    ACCEPTED = 1
    DECLINED = 2


class FriendRequest(models.Model):
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="sent_friend_requests",
        on_delete=models.CASCADE,
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="received_friend_requests",
        on_delete=models.CASCADE,
    )
    status = models.IntegerField(
        choices=[(tag.value, tag.name) for tag in FriendRequestStatus],
        default=FriendRequestStatus.PENDING.value,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} ({self.get_status_display()})"


class Friend(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="friend_user",
        on_delete=models.CASCADE,
    )
    friend = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="friend_friend",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} & {self.friend}"

    class Meta:
        unique_together = ("user", "friend")
