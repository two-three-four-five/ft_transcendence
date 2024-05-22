import { navigateTo } from "/src/scripts/utils/display.js";
import { login } from "/src/scripts/view/login.js";

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

export function setNavbar() {
  setLogout();
  setBack();
  setMenuOffcanvas();
}
