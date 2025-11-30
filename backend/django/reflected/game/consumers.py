import json
import logging
import asyncio
import math
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

X = 0
Y = 1


class SingleGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.group_name = f"single_game_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

            self.ball_position = [50, 50]  # 공의 위치 (x, y)
            self.ball_velocity = [0.5, 0.5]  # 공의 속도 (x 방향, y 방향)
            self.host_slider = 50
            self.guest_slider = 50
            self.score_changed = False
            self.host_score = 0
            self.guest_score = 0
            self.game_finished = False

            logger.info(f"User {self.user.id} connected to single game")

        else:
            logger.warning(f"Connection failed")
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            logger.info(f"")
            self.update_loop.cancel()

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data["type"] == "start":
            await self.channel_layer.group_send(self.group_name, {"type": "game_start"})
        elif data["type"] == "slider":
            direction = data["direction"]
            if direction == "ArrowLeft":
                self.guest_slider -= 2.5
            elif direction == "ArrowRight":
                self.guest_slider += 2.5

            if self.guest_slider < 10:
                self.guest_slider = 10
            if self.guest_slider > 90:
                self.guest_slider = 90

    async def game_start(self, event):
        await self.send(text_data=json.dumps({"type": "game_start"}))
        self.update_task = asyncio.create_task(self.update_loop())

    async def update_loop(self):
        min_speed = 1
        max_speed = 2
        max_offset = 11.5
        while True:
            if self.host_score == 5 or self.guest_score == 5:
                self.game_finished = True
                await self.channel_layer.group_send(self.group_name, {"type": "finish"})
                self.update_task.cancel()

            new_ball_position = [0, 0]
            new_ball_position[X] = self.ball_position[X] + self.ball_velocity[X]
            new_ball_position[Y] = self.ball_position[Y] + self.ball_velocity[Y]
            # self.ball_position[0] += self.ball_velocity[0]
            # self.ball_position[1] += self.ball_velocity[1]

            if new_ball_position[X] <= 2.25:
                self.ball_velocity[X] = abs(self.ball_velocity[X])
                new_ball_position[X] = 2.25

            elif new_ball_position[X] >= 97.75:
                self.ball_velocity[X] = -abs(self.ball_velocity[X])
                new_ball_position[X] = 97.75

            if (
                # 5 + 1.5 <
                new_ball_position[Y] <= 5 + 1.5 + 1.5
                and self.host_slider - 10 - 1.5
                < new_ball_position[X]
                < self.host_slider + 10 + 1.5
            ):
                offset = abs(new_ball_position[X] - self.host_slider)
                direction = 1 if new_ball_position[X] > self.host_slider else -1
                radian = math.radians((offset / max_offset) * 60)
                speed = min_speed + (offset / max_offset) * (max_speed - min_speed)
                self.ball_velocity[0] = speed * direction * math.sin(radian)
                self.ball_velocity[1] = speed * math.cos(radian)
                new_ball_position[Y] = 8
            elif (
                95 - 1.5 - 1.5 <= new_ball_position[Y]
                # < 95 - 1.5
                and self.guest_slider - 10 - 1.5
                < self.ball_position[X]
                < self.guest_slider + 10 + 1.5
            ):
                offset = abs(new_ball_position[X] - self.guest_slider)
                direction = 1 if new_ball_position[X] > self.guest_slider else -1
                radian = math.radians(offset / max_offset * 60)
                speed = min_speed + (offset / max_offset) * (max_speed - min_speed)
                self.ball_velocity[X] = speed * direction * math.sin(radian)
                self.ball_velocity[Y] = -speed * math.cos(radian)
                new_ball_position[Y] = 92

            if new_ball_position[Y] <= 5:
                self.guest_score += 1
                new_ball_position = [50, 50]
                self.ball_velocity = [0.5, 0.5]
            if new_ball_position[Y] >= 95:
                self.host_score += 1
                new_ball_position = [50, 50]
                self.ball_velocity = [0.5, -0.5]

            self.ball_velocity[0] = max(
                min_speed, min(max_speed, abs(self.ball_velocity[0]))
            ) * (1 if self.ball_velocity[0] > 0 else -1)
            self.ball_velocity[1] = max(
                min_speed, min(max_speed, abs(self.ball_velocity[1]))
            ) * (1 if self.ball_velocity[1] > 0 else -1)

            self.host_slider = new_ball_position[0]
            if self.host_slider < 10:
                self.host_slider = 10
            if self.host_slider > 90:
                self.host_slider = 90

            self.ball_position = new_ball_position

            await self.channel_layer.group_send(self.group_name, {"type": "update"})
            await asyncio.sleep(0.016)

    async def update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "update",
                    "ball": self.ball_position,
                    "host_slider": self.host_slider,
                    "guest_slider": self.guest_slider,
                    "host_score": self.host_score,
                    "guest_score": self.guest_score,
                }
            )
        )

    async def finish(self, event):
        await self.send(text_data=json.dumps({"type": "finish"}))


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        if self.user.is_authenticated:

            self.group_name = f"game_{self.game_id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

            self.ball_position = [0.5, 0.5]
            self.ball_velocity = [0.01, 0.01]
            self.ready_players = set()

            logger.info(f"User {self.user.id} connected to game {self.game_id}")
        else:
            logger.warning(f"Connection Failed")
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            logger.info(f"")

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data["type"] == "join":
            self.ready_players.add(self.user.id)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "member_update",
                    "user_id": self.user.id,
                },
            )

        elif data["type"] == "ready":
            self.ready_players.add(self.user.id)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "ready_update",
                    "user_id": self.user.id,
                    "detail": "ready",
                },
            )

        elif data["type"] == "unready":
            self.ready_players.remove(self.user.id)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "ready_update",
                    "user_id": self.user.id,
                    "detail": "unready",
                },
            )

        elif data["type"] == "start":
            if len(self.ready_players) == 1:
                await self.channel_layer.group_send(
                    self.group_name, {"type": "game_start"}
                )
                # self.update_task = asyncio.create_tast(self.update_ball())

        # elif data["type"] == "slider_move":
        #     # 슬라이더 좌표와 유저 ID를 다른 유저에게 전송
        #     await self.channel_layer.group_send(
        #         self.group_name,
        #         {
        #             "type": "slider_update",
        #             "user_id": data["user_id"],
        #             "position": data["position"],
        #         },
        #     )

    async def member_update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "member_update",
                    "user_id": event["user_id"],
                }
            )
        )

    async def ready_update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "ready_update",
                    "user_id": event["user_id"],
                    "detail": event["detail"],
                }
            )
        )

    async def game_start(self, event):
        await self.send(text_data=json.dumps({"type": "game_start"}))

    # async def slider_update(self, event):
    #     # 슬라이더 좌표와 유저 ID를 클라이언트에 전송
    #     await self.send(
    #         text_data=json.dumps(
    #             {
    #                 "type": "slider_update",
    #                 "user_id": event["user_id"],
    #                 "position": event["position"],
    #             }
    #         )
    #     )
