from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from chat.models import Chat, ChatRoom
from chat.serializers import ChatSerializer, ChatRoomSerializer
from user.models import User
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.db.models import Count, Q

User = get_user_model()


def index(request):
    return render(request, "chat/index.html")


def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        to_user_nicknames = request.data.get("nicknames")
        if not to_user_nicknames or not isinstance(to_user_nicknames, list):
            return Response(
                {"detail": 'Invalid or missing "nicknames" field'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        from_user = request.user
        users = User.objects.filter(nickname__in=to_user_nicknames)
        # TODO: 친구 검사 필요
        if not users.exists():
            return Response(
                {"detail": "No valid users found for the provided nicknames"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check for existing chat room
        participants = list(users) + [from_user]
        participants_ids = [user.id for user in participants]

        # Annotate rooms with the number of participants matching the users' ids
        existing_chat_room = ChatRoom.objects.annotate(
            num_participants=Count("participants"),
            match_participants=Count(
                "participants", filter=Q(participants__in=participants_ids)
            ),
        ).filter(
            num_participants=len(participants_ids),
            match_participants=len(participants_ids),
        )

        if existing_chat_room.exists():
            chat_room = existing_chat_room.first()
        else:
            # 새로운 ChatRoom 객체 생성 및 저장
            chat_room = ChatRoom()
            chat_room.save()
            chat_room.participants.add(from_user, *users)

        serializer = ChatRoomSerializer(chat_room)
        return Response(
            serializer.data,
            status=(
                status.HTTP_201_CREATED
                if not existing_chat_room.exists()
                else status.HTTP_200_OK
            ),
        )

    def list(self, request, *args, **kwargs):
        user = request.user
        chat_rooms = ChatRoom.objects.filter(participants=user)
        serializer = self.get_serializer(chat_rooms, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="chats/")
    def chats(self, request, pk=None):
        chat_room = self.get_object()
        if request.user not in chat_room.participants.all():
            return Response(
                {"detail": "You do not have permission to view this chat room."},
                status=status.HTTP_403_FORBIDDEN,
            )
        chats = chat_room.chats.order_by("created_at")
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        chatroom_id = request.data.get("chatroom")
        message = request.data.get("message")

        if not chatroom_id or not message:
            return Response(
                {"detail": 'Invalid or missing "chatroom" or "message" field'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            chatroom = ChatRoom.objects.get(pk=chatroom_id)
        except ChatRoom.DoesNotExist:
            return Response(
                {"detail": "ChatRoom not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        from_user = request.user
        if from_user not in chatroom.participants.all():
            return Response(
                {"detail": "You are not a participant in this ChatRoom"},
                status=status.HTTP_403_FORBIDDEN,
            )

        chat = Chat(room=chatroom, from_user=from_user, message=message)
        chat.save()
        return Response(ChatSerializer(chat).data, status=status.HTTP_201_CREATED)
