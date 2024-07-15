import { navigateTo } from "/src/scripts/utils/display.js";
import { getAPI } from "/src/scripts/utils/fetch.js";
import { showToast } from "/src/scripts/utils/toast.js";
import { updateMypage } from "/src/scripts/view/home/mypage.js";

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
  let data = await getAPI("v1/users/me");
  showToast("check", `환영합니다,  ${data["nickname"]}님`);

  localStorage.setItem("nickname", data["nickname"]);
  localStorage.setItem("date_joined", data["date_joined"]);
  localStorage.setItem("social_type", data["social_type"]);

  updateMypage();
}
