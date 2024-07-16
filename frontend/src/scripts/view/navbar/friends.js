import { getAPI, postAPI } from "/src/scripts/utils/fetch.js";
import { showToast } from "/src/scripts/utils/toast.js";

export function setFriends() {
  const friendsList = document.getElementById("nav-friend-btn");
  friendsList.addEventListener("click", updateFriends);
}

export function setAddFriend() {
  let addFriendModal = new bootstrap.Modal(
    document.getElementById("modal-friend-request"),
    {
      backdrop: false,
    }
  );

  let friendOffcanvas = new bootstrap.Offcanvas(
    document.getElementById("offcanvas-friends")
  );

  const friendRequest = document.getElementById("friends-add");
  friendRequest.addEventListener("click", function () {
    addFriendModal.show();
  });

  const submitFriendRequest = document.getElementById(
    "friend-request-submit-button"
  );
  submitFriendRequest.addEventListener("click", async function () {
    var friendNickname = document.getElementById(
      "friend-request-nickname-form"
    ).value;

    if (!friendNickname) {
      alert("닉네임을 입력하십시오.");
      return;
    }

    const friendRequestSuccess = await postAPI("v1/friends/requests", {
      nickname: friendNickname,
    });
    if (friendRequestSuccess) {
      showToast("check", `${friendNickname}님에게 친구 신청을 성공했습니다.`);
    } else {
      showToast("close", `${friendNickname}님에게 친구 신청을 실패했습니다.`);
    }
    addFriendModal.hide();
    friendOffcanvas.hide();
  });

  const friendNicknameInput = document.getElementById("friendNickname");
  friendNicknameInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 동작 방지
      // submitFriendRequest.click(); // 버튼 클릭을 수동으로 트리거
    }
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
