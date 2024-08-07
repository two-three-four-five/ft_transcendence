import Api from "/src/utils/api.js";
import OffcanvasManager from "/src/components/offcanvas/offcanvas.js";

import { API_CONFIG } from "/src/utils/variables.js";
import { showToast } from "/src/components/toast/toast.js";

const chatList = document.getElementById("offcanvas-chat-list");
const chatHeader = document.getElementById("offcanvas-chat-header");

const myNickname = localStorage.getItem("nickname");

export async function setChat(chatroomId) {
  let chatsLists = chatList.querySelectorAll(":scope > div");
  chatsLists.forEach((div) => {
    if (div.id != `offcanvas-chat-list-${chatroomId}`) {
      div.hide();
    } else {
      div.show();
    }
  });

  const response = await Api.get(
    `${API_CONFIG.ENDPOINT.CHATROOMS}${chatroomId}`
  );

  if (!response.ok) {
  }
  const data = await response.json();
  for (const participant of data.participants) {
    if (participant != myNickname) {
      chatHeader.innerText = participant;
      break;
    }
  }

  const chatInput = document.getElementById("offcanvas-chat-input");
  const newInput = chatInput.cloneNode(true);
  chatInput.parentNode.replaceChild(newInput, chatInput);

  newInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.isComposing === false) {
      event.preventDefault();
      var message = newInput.value.trim();
      newInput.value = "";
      if (!message) return;
      sendChat(chatroomId, message);
    }
  });

  let chatSendBtn = document.getElementById("offcanvas-chat-send-btn");
  let newButton = chatSendBtn.cloneNode(true);
  chatSendBtn.parentNode.replaceChild(newButton, chatSendBtn);

  newButton.addEventListener("click", async () => {
    var message = newInput.value.trim();
    newInput.value = "";
    if (!message) return;
    sendChat(chatroomId, message);
  });
}

export async function updateChat(chatroomId) {
  let chatsList = document.getElementById(`offcanvas-chat-list-${chatroomId}`);
  chatsList.innerText = "";

  let response = await Api.get(
    `${API_CONFIG.ENDPOINT.CHATROOMS}${chatroomId}/chats/`
  );
  if (!response.ok) {
    return;
  }

  let data = await response.json();
  if (data) {
    data.forEach((item) => {
      if (item.from_user.nickname == myNickname) {
        chatsList.innerHTML += `
        <div class="chat-message-me d-flex px-3 py-2">
          <div class="d-inline-flex flex-column align-items-end gap-2 w-100">
            <div class="chat-message-box px-3 py-3 mw-100">
              <span class="medium" style="word-break: break-all; overflow-wrap: break-word;">${item.message}</span>
            </div>
            <span class="small chat-timestamp">00:00</span>
          </div>
        </div>
      `;
      } else {
        chatsList.innerHTML += `
        <div class="chat-message-other d-flex px-3 py-2">
          <div class="d-inline-flex flex-column align-items-start gap-2 w-100">
            <div class="chat-message-box px-3 py-3 mw-100">
              <span class="medium" style="word-break: break-all; overflow-wrap: break-word;">${item.message}</span>
            </div>
            <span class="small chat-timestamp">00:00</span>
          </div>
        </div>
      `;
      }
    });
  }

  const lastMessage = chatsList.lastElementChild;
  if (lastMessage) {
    lastMessage.scrollIntoView();
    // lastMessage.scrollIntoView({ behavior: "smooth" });
  }

  const challengeBtn = document.getElementById("offcanvas-chat-challenge-btn");
  const infoBtn = document.getElementById("offcanvas-chat-info-btn");

  challengeBtn.addEventListener("click", () => {
    OffcanvasManager.hide("offcanvas-chat");
    OffcanvasManager.show("offcanvas-friend");

    var name = document.getElementById("friend-profile-name-card-nickname");
    // name.innerText = item.friend.nickname;

    var about = document.getElementById(
      "friend-profile-name-card-register-date"
    );
    // about.innerText =
    //   formatDate(item.friend.date_joined) +
    //   " " +
    //   getSocialTypeName(item.friend.social_type) +
    //   " 가입";
  });
  infoBtn.addEventListener("click", () => {});
}

async function sendChat(chatroomId, message) {
  let response = await Api.post(API_CONFIG.ENDPOINT.CHATS, {
    chatroom: chatroomId,
    message: message,
  });
  if (!response.ok) {
    showToast("close", "red", "메세지 전송실패");
    return;
  }
  let data = await response.json();
  {
  }
}
