import Api from "/src/utils/api.js";
import { updateFriendRequests } from "./friends/friendRequests.js";
import { API_CONFIG } from "../../utils/variables.js";
import { showChatroom, updateChatroom } from "./chats/chatroom.js";

let friendsData = [];

const friendNicknameSearchInput = document.getElementById(
  "friend-nickname-search-input"
);

document.addEventListener("DOMContentLoaded", () => {
  friendNicknameSearchInput.addEventListener("input", filterFriends);
});

export function setFriends() {
  const friendsList = document.getElementById("nav-friend-btn");
  friendsList.addEventListener("click", updateFriends);

  const friendsTab = document.getElementById("friends-tab");
  friendsTab.addEventListener("click", updateFriends);

  const friendRequestsTab = document.getElementById("friend-requests-tab");
  friendRequestsTab.addEventListener("click", updateFriendRequests);
}

export async function updateFriends() {
  let response = await Api.get(API_CONFIG.ENDPOINT.FRIENDS);
  if (!response.ok) {
    /* TODO: error handling */
    return;
  }
  let data = await response.json();
  friendsData = data;
  displayFriends(data);
}

function filterFriends(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredFriends = friendsData.filter((item) => {
    const nickname = item.friend.nickname || ""; // null 처리
    return nickname.toLowerCase().includes(searchTerm);
  });
  displayFriends(filteredFriends);
}

function displayFriends(data) {
  const friendList = document.getElementById("offcanvas-friends-list");
  friendList.innerHTML = "";
  data.forEach((item) => {
    friendList.innerHTML += `
			    <div
            class="friend-item d-flex flex-row w-100 px-3 py-2 align-items-center justify-content-between"
          >
				    <div
					    class="d-flex flex-row gap-3 p-0 align-items-center justify-content-center"
				    >
					    <span class="material-symbols-rounded"> local_fire_department </span>
					    <p class="m-auto">${item.friend.nickname}</p>
				    </div>
				    <div
					    class="d-flex flex-row gap-2 p-0 align-items-center justify-content-center"
				    >
              <div
                id="friend-chat-${item.id}"
                class="btn btn-navbar p-2"
              >
              <span class="material-symbols-rounded"> forum </span>
              </div>
              <div
                id="friend-info-${item.id}"
                class="btn btn-navbar p-2"
              >
                <span class="material-symbols-rounded"> info </span>
              </div>
				    </div>
			    </div>
		    `;
  });

  data.forEach((item) => {
    document
      .getElementById(`friend-chat-${item.id}`)
      .addEventListener("click", async () => {
        const response = await Api.post(API_CONFIG.ENDPOINT.CHATROOMS, {
          nicknames: [item.friend.nickname],
        });
        if (!response) {
        }
        let data = await response.json();
        {
          var friendsOffcanvas = document.getElementById("offcanvas-friends");
          var fOffcanvas =
            bootstrap.Offcanvas.getInstance(friendsOffcanvas) ||
            new bootstrap.Offcanvas(friendsOffcanvas);
          fOffcanvas.hide();

          var chatOffcanvas = document.getElementById("offcanvas-chat");
          var cOffcanvas =
            bootstrap.Offcanvas.getInstance(chatOffcanvas) ||
            new bootstrap.Offcanvas(chatOffcanvas);
          cOffcanvas.show();

          showChatroom(data.id);
          updateChatroom(data.id);
        }
      });
  });
}
