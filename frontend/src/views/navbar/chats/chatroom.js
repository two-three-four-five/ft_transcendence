import Api from "/src/utils/api.js";
import { showToast } from "/src/components/toast/toast.js";

const chatroomList = document.getElementById("chatrooms-list");
const chatroom = document.getElementById("chatroom");
const chatroomBottom = document.getElementById("chatroom-bottom");

export async function showChatroom(chatroomId) {
  chatroomList.hide();
  chatroom.show();
  chatroomBottom.show();

  let chatsLists = chatroom.querySelectorAll(":scope > div");
  chatsLists.forEach((div) => {
    if (div.id != `chats-list-${chatroomId}`) {
      div.hide();
    } else {
      div.show();
    }
  });

  const chatInput = document.getElementById("chatting-input");
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

  let chatSendBtn = document.getElementById("btn-sendchat");
  let newButton = chatSendBtn.cloneNode(true);
  chatSendBtn.parentNode.replaceChild(newButton, chatSendBtn);

  newButton.addEventListener("click", async () => {
    var message = newInput.value.trim();
    newInput.value = "";
    if (!message) return;
    sendChat(chatroomId, message);
  });
}

export async function updateChatroom(chatroomId) {
  const myNickname = localStorage.getItem("nickname");

  let chatsList = document.getElementById(`chats-list-${chatroomId}`);
  chatsList.innerText = "";

  let response = await Api.get(`v1/chatrooms/${chatroomId}/chats`);
  if (!response.ok) {
    return;
  }

  let data = await response.json();
  if (data) {
    data.forEach((item) => {
      if (item.from_user.nickname == myNickname) {
        chatsList.innerHTML += `
        <div class="chat-message-me d-flex px-3 py-2">
          <div class="d-inline-flex flex-column gap-2">
            <div class="chat-message-box px-3 py-3">
              <span class="medium" style="word-break: break-all;">${item.message}</span>
            </div>
            <span class="small chat-timestamp">00:00</span>
          </div>
        </div>
      `;
      } else {
        chatsList.innerHTML += `
        <div class="chat-message-other d-flex px-3 py-2">
          <div class="d-inline-flex flex-column gap-2">
            <div class="chat-message-box px-3 py-3">
              <span class="medium" style="word-break: break-all;">${item.message}</span>
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
}

async function sendChat(chatroomId, message) {
  let response = await Api.post("v1/chats/", {
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
