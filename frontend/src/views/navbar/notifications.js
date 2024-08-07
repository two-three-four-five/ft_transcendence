import Api from "/src/utils/api.js";
import OffcanvasManager from "/src/components/offcanvas/offcanvas.js";

import { API_CONFIG } from "/src/utils/variables.js";
import { showToast } from "/src/components/toast/toast.js";
import { updateFriends } from "./friends.js";
import { updateFriendRequests } from "./friends/friendRequests.js";
import { updateChats } from "./chats.js";

const notificationsList = document.getElementById(
  "offcanvas-notifications-list"
);

function getNotificationIcon(notificaitonType) {
  switch (notificaitonType) {
    case "0":
    case "FRIEND_REQUEST":
      return "person_alert";
    case "1":
    case "FRIEND_ACCEPTED":
      return "person_check";
    case "2":
    case "FRIEND_DECLINED":
      return "person_cancel";
    case "3":
    case "NEW_CHATTING":
      return "mark_chat_unread";
    case "4":
    case "GAME_REQUEST":
      return "videogame_asset";
    default:
      return "person";
  }
}

function getNotificationMessage(fromUser, notificaitonType) {
  switch (notificaitonType) {
    case "0":
    case "FRIEND_REQUEST":
      return `${fromUser}님이 친구를 신청했습니다.`;
    case "1":
    case "FRIEND_ACCEPTED":
      return `${fromUser}님이 친구를 수락했습니다.`;
    case "2":
    case "FRIEND_DECLINED":
      return `${fromUser}님이 친구를 거절했습니다.`;
    case "3":
    case "NEW_CHATTING":
      return `${fromUser}님에게 새로 온 메세지가 있습니다.`;
    case "4":
    case "GAME_REQUEST":
      return `${fromUser}님이 승부를 신청했습니다.`;
    default:
      return "You have a new notification";
  }
}

export async function updateNotifications() {
  const response = await Api.get(API_CONFIG.ENDPOINT.NOTIFICATIONS);
  if (!response.ok) {
  }
  const data = await response.json();

  notificationsList.innerHTML = "";
  for (let item of data) {
    let icon = getNotificationIcon(item.type);
    let message = getNotificationMessage(item.from_user.nickname, item.type);

    notificationsList.innerHTML += `
        <div
          id="offcanvas-notifications-list-${item.id}"
          class="w-100 p-3 list d-flex flex-row justify-content-start align-items-center gap-3"
        >
          <span class="material-symbols-rounded"> ${icon} </span>
          <span class="medium"> ${message} </span>
        </div>`;
  }

  for (let item of data) {
    document
      .getElementById(`offcanvas-notifications-list-${item.id}`)
      .addEventListener("click", () => {
        OffcanvasManager.hide("offcanvas-notifications");

        switch (item.type) {
          case "0":
          case "FRIEND_REQUEST":
            OffcanvasManager.show("offcanvas-friends");
            updateFriendRequests();
            break;
          case "1":
          case "FRIEND_ACCEPTED":
          case "2":
          case "FRIEND_DECLINED":
            OffcanvasManager.show("offcanvas-friends");
            updateFriends();
          case "3":
          case "NEW_CHATTING":
            OffcanvasManager.show("offcanvas-chats");
            updateChats();
          case "4":
          case "GAME_REQUEST":
            break;
          default:
            break;
        }
      });
  }
}

export function alertNotifications() {
  const accessToken = localStorage.getItem("accessToken");

  const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsScheme}://localhost:2344/ws/notifications/?token=${accessToken}`;
  const socket = new WebSocket(wsUrl);

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    showToast(
      getNotificationIcon(data.notification_type),
      "yellow",
      getNotificationMessage(data.from_user, data.notification_type)
    );
  };

  socket.onclose = function (event) {
    console.error("WebSocket closed unexpectedly:", event);
  };

  socket.onopen = function (event) {
    console.log("WebSocket connection opened:", event);
  };

  socket.onerror = function (event) {
    console.error("WebSocket error observed:", event);
  };
}
