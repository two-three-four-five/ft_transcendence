import Api from "/src/utils/api.js";
import { navigateTo } from "/src/utils/display.js";
import { showToast } from "/src/components/toast/toast.js";
import { updateMypage } from "/src/views/home/mypage.js";

const buttons = [
  { id: "home-play-btn", handler: handlePlayButtonClick },
  {
    id: "home-collections-btn",
    handler: handleCollectionsButtonClick,
  },
  {
    id: "home-store-btn",

    handler: handleStoreButtonClick,
  },
  {
    id: "home-mypage-btn",
    handler: handleMypageButtonClick,
  },
];

function handlePlayButtonClick() {
  navigateTo("app-play");
}

function handleCollectionsButtonClick() {
  navigateTo("app-collections");
}

function handleStoreButtonClick() {
  navigateTo("app-store");
}

function handleMypageButtonClick() {
  updateMypage();
  navigateTo("app-mypage");
}

function setHomeButtons() {
  buttons.forEach((button) => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener("click", () => button.handler());
    } else {
      console.error(`Element with ID '${button.id}' not found.`);
    }
  });
}

export function setHome() {
  setHomeButtons();
}

export async function updateHome() {
  let response = await Api.get("v1/users/me");
  if (!response.ok) {
    /* TODO: error handling */
    return;
  }
  let data = await response.json();
  showToast("check", "green", `환영합니다,  ${data["nickname"]}님`);

  localStorage.setItem("nickname", data["nickname"]);
  localStorage.setItem("date_joined", data["date_joined"]);
  localStorage.setItem("social_type", data["social_type"]);

  updateMypage();
}
