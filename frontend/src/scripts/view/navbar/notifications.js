import { showToast } from "/src/scripts/utils/toast.js";

const accessToken = localStorage.getItem("accessToken");

function getNotificationIcon(notification) {
  switch (notification.type) {
    case "FRIEND_REQUEST":
      return "person_alert";
    case "REQUEST_ACCEPTED":
      return "person_check";
    case "REQUEST_DECLINED":
      return "person_cancel";
    case "NEW_CHATTING":
      return "mark_chat_unread";
    case "GAME_REQUEST":
      return "videogame_asset";
    default:
      return "person";
  }
}

function getNotificationMessage(notification) {
  switch (notification.type) {
    case "FRIEND_REQUEST":
      return `${notification.from_user.nickname}님이 친구를 신청했습니다.`;
    case "REQUEST_ACCEPTED":
      return `${notification.from_user.nickname}님이 친구를 수락했습니다.`;
    case "REQUEST_DECLINED":
      return `${notification.from_user.nickname}님이 친구를 거절했습니다.`;
    case "NEW_CHATTING":
      return `${notification.from_user.nickname}님에게 새로 온 메세지가 있습니다.`;
    case "GAME_REQUEST":
      return `${notification.from_user.nickname}님이 승부를 신청했습니다.`;
    default:
      return "You have a new notification";
  }
}

const notificationsList = document.getElementById("notifications-list");

export function loadNotifications() {
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
        let icon = getNotificationIcon(notification);
        let message = getNotificationMessage(notification);

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
  const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsScheme}://localhost:2344/ws/notifications/?token=${accessToken}`;
  const socket = new WebSocket(wsUrl);

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    showToast(
      "알림!!",
      data.from_user + "님의 type : " + data.notification_type
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
