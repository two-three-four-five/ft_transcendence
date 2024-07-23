import Api from "/src/utils/api.js";
import { showToast } from "/src/components/toast/toast.js";
import { HTTPCODE } from "/src/utils/variables.js";

var friendOffcanvas = new bootstrap.Offcanvas(
  document.getElementById("offcanvas-friends")
);

export async function updateFriendRequests() {
  let response = await Api.get("v1/friends/requests");
  if (!response.ok) {
    /* TODO: error handling */
    return;
  }
  let data = await response.json();
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
              id="friend-request-accept-btn-${item.id}"
              class="btn btn-navbar p-2"
            >
            <span class="material-symbols-rounded"> check_circle </span>
            </div>
            <div
              id="friend-request-decline-btn-${item.id}"
              class="btn btn-navbar p-2"
            >
              <span class="material-symbols-rounded"> cancel </span>
            </div>
          </div>
        </div>
      `;
    });

    data.forEach((item) => {
      document
        .getElementById(`friend-request-accept-btn-${item.id}`)
        .addEventListener("click", async () => {
          console.log("click accept");
          const response = await Api.post(
            `v1/friends/requests/${item.id}/accept`,
            {}
          );
          const data = await response.json();
          switch (response.status) {
            case HTTPCODE.OK:
              showToast(
                "check",
                "green",
                `${data.friend_request.from_user.nickname} 님과 친구가 되었습니다.`
              );
              break;
            default:
              showToast(
                "close",
                "red",
                `${data.friend_request.from_user.nickname} 님과 친구가 되지 않았습니다.`
              );
              break;
          }
          friendOffcanvas.hide();
          updateFriendRequests();
        });
      document
        .getElementById(`friend-request-decline-btn-${item.id}`)
        .addEventListener("click", async () => {
          const response = await Api.post(
            `v1/friends/requests/${item.id}/decline`,
            {}
          );
          const data = await response.json();
          switch (response.status) {
            case HTTPCODE.OK:
              showToast(
                "check",
                "green",
                `${data.friend_request.from_user.nickname} 님의 친구 신청을 거절했습니다.`
              );
              break;
            default:
              showToast(
                "close",
                "red",
                `${data.friend_request.from_user.nickname} 님의 친구 신청 거절을 실패했습니다.`
              );
              break;
          }
          friendOffcanvas.hide();
          updateFriendRequests();
        });
    });
  }
}

export function setAddFriend() {
  let addFriendModal = new bootstrap.Modal(
    document.getElementById("modal-friend-request"),
    {
      backdrop: false,
    }
  );

  const friendRequest = document.getElementById("friends-add");
  friendRequest.addEventListener("click", function () {
    addFriendModal.show();
  });

  const friendRequestSubmitButton = document.getElementById(
    "friend-request-submit-button"
  );

  const friendNicknameInput = document.getElementById(
    "friend-request-nickname-input"
  );
  friendRequestSubmitButton.addEventListener("click", async function () {
    var friendNickname = friendNicknameInput.value;

    if (!friendNickname) {
      alert("닉네임을 입력하십시오.");
      return;
    }

    const response = await Api.post("v1/friends/requests", {
      nickname: friendNickname,
    });
    switch (response.status) {
      case HTTPCODE.OK:
      case HTTPCODE.CREATED:
        showToast(
          "check",
          "green",
          `${friendNickname}님에게 친구 신청을 성공했습니다.`
        );
        break;
      case HTTPCODE.BAD_REQUEST:
        showToast("close", "yellow", `${friendNickname}님과 이미 친구입니다.`);
        break;
      case HTTPCODE.NOT_FOUND:
        showToast(
          "close",
          "yellow",
          `${friendNickname}님은 존재하지 않습니다.`
        );
        break;
      case HTTPCODE.CONFLICT:
        showToast(
          "close",
          "yellow",
          `${friendNickname}님에게 이미 친구 신청을 했습니다.`
        );
        break;
      default:
        showToast(
          "close",
          "red",
          `${friendNickname}님에게 친구 신청을 실패했습니다.`
        );
        break;
    }
    addFriendModal.hide();
    friendOffcanvas.hide();
  });

  friendNicknameInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
}
