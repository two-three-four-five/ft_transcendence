import { showToast } from "/src/scripts/utils/toast.js";

const notificationsList = document.getElementById("notifications-list");

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

export function updateNotifications() {
  const accessToken = localStorage.getItem("accessToken");
  notificationsList.innerHTML = "";

  const url = `http://localhost:2344/v1/notifications/`;
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((notification) => {
        let icon = getNotificationIcon(notification.type);
        let message = getNotificationMessage(
          notification.from_user.nickname,
          notification.type
        );

        notificationsList.innerHTML += `
              <div
                class="w-100 p-3 list d-flex flex-row justify-content-start align-items-center gap-3"
              >
                <span class="material-symbols-rounded"> ${icon} </span>
                <span class="medium"> ${message} </span>
              </div>`;
      });
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
    });
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
