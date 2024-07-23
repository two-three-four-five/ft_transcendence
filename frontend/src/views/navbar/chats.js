import Api from "/src/utils/api.js";
import { showChatroom, updateChatroom } from "./chats/chatroom.js";

const chatroomList = document.getElementById("chatrooms-list");
const chatroom = document.getElementById("chatroom");
const chatroomBottom = document.getElementById("chatroom-bottom");
const myNickname = localStorage.getItem("nickname");

export function setChatrooms() {
  const chatroomBtn = document.getElementById("nav-chat-btn");
  chatroomBtn.addEventListener("click", updateChatrooms);
}

export async function updateChatrooms() {
  chatroomList.show();
  chatroom.hide();
  chatroomBottom.hide();

  let response = await Api.get("v1/chatrooms/");
  if (!response.ok) {
    return;
  }
  let data = await response.json();
  chatroomList.innerHTML = "";

  for (let item of data) {
    await (async (item) => {
      let friendNickname = await item.participants.find(
        (participant) => participant !== myNickname
      );
      chatroomList.innerHTML += `
      <div
        id="chatroom-${item.id}"
        class="chatroom-item card card--transparent d-flex flex-row w-100 px-3 py-2 align-items-center justify-content-between"
      >
        <div
          class="chatroom-left d-flex flex-row gap-3 align-items-center"
        >
          <div class="icon">
            <span class="material-symbols-rounded">
              sensors_off
            </span>
          </div>
          <div class="chatroom-info d-flex flex-column gap-1">
            <span class="medium">${friendNickname}</span>
            <span class="small">Recent Message?</span>
          </div>
        </div>
        <div
          class="chatroom-right d-flex flex-column gap-2 align-items-end"
        >
          <span class="small">15</span>
          <span class="small">24.01.01.</span>
        </div>
      </div>
    `;
    })(item);

    let chatListDiv = document.getElementById(`chats-list-${item.id}`);
    if (!chatListDiv) {
      chatroom.innerHTML += `
        <div id="chats-list-${item.id}" class="d-flex flex-column gap-1"></div>
      `;
    }
  }
  for (let item of data) {
    document
      .getElementById(`chatroom-${item.id}`)
      .addEventListener("click", () => {
        showChatroom(item.id);
        updateChatroom(item.id);
      });
  }
}

export function alertChats() {
  const accessToken = localStorage.getItem("accessToken");

  const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsScheme}://localhost:2344/ws/chats/?token=${accessToken}`;
  const socket = new WebSocket(wsUrl);

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.object == "chat") {
      updateChatroom(data.chatroom_id);
    } else if (data.object == "chatroom") {
      updateChatrooms();
    }
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
