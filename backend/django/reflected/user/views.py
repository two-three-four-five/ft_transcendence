from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView, status


class UserTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        return Response("logined!", status=status.HTTP_200_OK)
