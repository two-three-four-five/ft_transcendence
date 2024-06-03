from rest_framework import serializers

from user.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "nickname",
            "email",
            'social_type',
            'date_joined'
        )  
