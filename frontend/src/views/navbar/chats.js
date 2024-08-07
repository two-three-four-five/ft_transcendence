import Api from "/src/utils/api.js";
import OffcanvasManager from "/src/components/offcanvas/offcanvas.js";

import { API_CONFIG } from "/src/utils/variables.js";
import { setChat, updateChat } from "./chats/chat.js";

const chatsList = document.getElementById("offcanvas-chats-list");
const chatList = document.getElementById("offcanvas-chat-list");
const myNickname = localStorage.getItem("nickname");

export function setChats() {
  const chatroomBtn = document.getElementById("nav-chats-btn");
  chatroomBtn.addEventListener("click", updateChats);
}

export async function updateChats() {
  let response = await Api.get(API_CONFIG.ENDPOINT.CHATROOMS);
  if (!response.ok) {
    return;
  }
  let data = await response.json();
  chatsList.innerHTML = "";

  for (let item of data) {
    await (async (item) => {
      let friendNickname = await item.participants.find(
        (participant) => participant !== myNickname
      );
      chatsList.innerHTML += `
      <div
        id="offcanvas-chats-room-${item.id}"
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

    let chatListDiv = document.getElementById(`offcanvas-chat-list-${item.id}`);
    if (!chatListDiv) {
      chatList.innerHTML += `
        <div id="offcanvas-chat-list-${item.id}" class="d-flex flex-column gap-1"></div>
      `;
    }
  }
  for (let item of data) {
    document
      .getElementById(`offcanvas-chats-room-${item.id}`)
      .addEventListener("click", () => {
        OffcanvasManager.hide("offcanvas-chats");
        OffcanvasManager.show("offcanvas-chat");
        setChat(item.id);
        updateChat(item.id);
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
      updateChat(data.chatroom_id);
    } else if (data.object == "chatroom") {
      updateChats();
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
