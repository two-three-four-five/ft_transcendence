import { navigateTo } from "/src/scripts/utils/display.js";

import { setMypage } from "/src/scripts/view/home/mypage.js";

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
  setMypage();
  navigateTo("app-mypage");
}

export function setHome() {
  buttons.forEach((button) => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener("click", () => button.handler());
    } else {
      console.error(`Element with ID '${button.id}' not found.`);
    }
  });
}
