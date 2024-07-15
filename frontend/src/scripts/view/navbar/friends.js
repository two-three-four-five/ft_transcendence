import { getAPI, postAPI } from "/src/scripts/utils/fetch.js";

export function setFriends() {
  const friendsList = document.getElementById("nav-friend-btn");
  friendsList.addEventListener("click", updateFriends);
}

export function setAddFriend() {
  const friendRequest = document.getElementById("friends-add");
  friendRequest.addEventListener("click", function () {
    var addFriendModal = new bootstrap.Modal(
      document.getElementById("addFriendModal"),
      {
        backdrop: false, // 백드롭 비활성화
      }
    );
    addFriendModal.show();
  });

  const submitFriendRequest = document.getElementById("submitAddFriend");
  submitFriendRequest.addEventListener("click", async function () {
    var friendNickname = document.getElementById("friendNickname").value;

    const friendRequestSuccess = await postAPI("v1/friends/requests", {
      nickname: friendNickname,
    });
    if (friendRequestSuccess) {
      alert("Friend added successfully!");
    } else {
      alert("There was a problem with your request");
    }
    addFriendModal.hide();
  });
}

let friendsData = [];

export async function updateFriends() {
  const data = await getAPI("v1/friends/");
  if (data) {
    friendsData = data;
    displayFriends(data);
  }
}

export async function updateFriendRequests() {
  const data = await getAPI("v1/friends/requests");
  if (data) {
    const friendRequestList = document.getElementById(
      "offcanvas-friends-requests-list"
    );
    friendRequestList.innerHTML = "";
    data.forEach((item) => {
      friendRequestList.innerHTML += `
        <div
          class="friend-item d-flex flex-row w-100 px-3 py-2 align-items-center justify-content-between"
        >
          <div
            class="d-flex flex-row gap-3 p-0 align-items-center justify-content-center"
          >
            <span class="material-symbols-rounded"> person_alert </span>
            <p class="m-auto">${item.from_user.nickname}</p>
          </div>
          <div
            class="d-flex flex-row gap-2 p-0 align-items-center justify-content-center"
          >
            <div
              class="btn btn-navbar p-2"
            >
              <span class="material-symbols-rounded"> check_circle </span>
            </div>
            <div
              class="btn btn-navbar p-2"
            >
              <span class="material-symbols-rounded"> cancel </span>
            </div>
          </div>
        </div>
      `;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(
    '.form-control[placeholder="Search"]'
  );
  searchInput.addEventListener("input", filterFriends);
});

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
                class="btn btn-navbar p-2"
              >
                <span class="material-symbols-rounded"> forum </span>
              </div>
              <div
                class="btn btn-navbar p-2"
              >
                <span class="material-symbols-rounded"> info </span>
              </div>
				    </div>
			    </div>
		    `;
  });
}
