from rest_framework import serializers

from user.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # 여기에는 사용자 모델을 지정합니다.
        fields = (
            "id",
            "nickname",
            "email",
        )  # 반환할 필드를 선택합니다.
