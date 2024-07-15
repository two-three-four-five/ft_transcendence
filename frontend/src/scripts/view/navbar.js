import { navigateTo } from "/src/scripts/utils/display.js";
import { getAccessToken, login } from "/src/scripts/view/login.js";
import { loadNotifications } from "/src/scripts/view/navbar/notifications.js";

function setLogout() {
  document
    .getElementById("nav-logout-btn")
    .addEventListener("click", function () {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      window.history.replaceState(null, document.title, window.location.origin);
      login();
    });
}

function setBack() {
  document
    .getElementById("nav-back-btn")
    .addEventListener("click", function () {
      window.history.back();
    });
}

function setMenuOffcanvas() {
  const buttons = [
    { id: "menu-home-btn", target: "app-home" },
    { id: "menu-play-btn", target: "app-play" },
    { id: "menu-collections-btn", target: "app-collections" },
    { id: "menu-store-btn", target: "app-store" },
    { id: "menu-mypage-btn", target: "app-mypage" },
  ];

  buttons.forEach((button) => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener("click", () => navigateTo(button.target));
    } else {
      console.error(`Element with ID '${button.id}' not found.`);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(
    '.form-control[placeholder="Search"]'
  );
  searchInput.addEventListener("input", filterFriends);
  // loadFriend();
});

let friendsData = [];

function loadFriend() {
  const token = getAccessToken();
  console.log("loadFriend " + token);
  const url = "http://localhost:2344/v1/friends/";

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      friendsData = data;
      displayFriends(data);
    })
    .catch((error) => {
      console.error("Error fetching friend data:", error);
    });
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

function filterFriends(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredFriends = friendsData.filter((item) => {
    const nickname = item.friend.nickname || ""; // null 처리
    return nickname.toLowerCase().includes(searchTerm);
  });
  displayFriends(filteredFriends);
}

function loadFriendRequest() {
  const token = getAccessToken();
  const url = "http://localhost:2344/v1/friends/requests";

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
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
    })
    .catch((error) => {
      console.error("Error fetching friend data:", error);
    });
}

// CSRF 토큰을 얻는 함수
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function setNavbar() {
  setLogout();
  setBack();
  setMenuOffcanvas();
  loadNotifications();
  loadFriend();
  loadFriendRequest();

  const friendsList = document.getElementById("nav-friend-btn");
  friendsList.addEventListener("click", loadFriend);

  document.getElementById("friends-add").addEventListener("click", function () {
    var addFriendModal = new bootstrap.Modal(
      document.getElementById("addFriendModal"),
      {
        backdrop: false, // 백드롭 비활성화
      }
    );
    addFriendModal.show();
  });

  document
    .getElementById("submitAddFriend")
    .addEventListener("click", function () {
      var friendNickname = document.getElementById("friendNickname").value;

      // POST 요청 보내기
      fetch("http://localhost:2344/v1/friends/requests", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // CSRF 토큰 추가
        },
        body: JSON.stringify({ nickname: friendNickname }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          alert("Friend added successfully!");
        })
        .catch((error) => {
          alert("There was a problem with your request: " + error.message);
        });

      addFriendModal.hide();
    });
}
