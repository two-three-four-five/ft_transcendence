from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView, status

from user.serializers import UserSerializer


class UserTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data.get("email"), status=status.HTTP_200_OK)
