from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.core.exceptions import ObjectDoesNotExist
from user.models import User


@database_sync_to_async
def get_user(token_key):
    try:
        token = AccessToken(token_key)
        user = User.objects.get(id=token["user_id"])
        return user
    except (ObjectDoesNotExist, Exception):
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        token_key = dict(x.split("=") for x in query_string.split("&")).get(
            "token", None
        )
        if token_key:
            scope["user"] = await get_user(token_key)
        else:
            scope["user"] = AnonymousUser()
        return await super().__call__(scope, receive, send)
