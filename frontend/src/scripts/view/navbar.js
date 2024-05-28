import { navigateTo } from "/src/scripts/utils/display.js";
import { getAccessToken, login } from "/src/scripts/view/login.js";

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

function loadFriend() {
  const token = getAccessToken();
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
    })
    .catch((error) => {
      console.error("Error fetching friend data:", error);
    });
}

export function setNavbar() {
  setLogout();
  setBack();
  setMenuOffcanvas();
  loadFriend();

  const friendsList = document.getElementById("nav-friend-btn");
  friendsList.addEventListener("click", loadFriend);
}
