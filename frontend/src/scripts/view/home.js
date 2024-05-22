import { navigateTo } from "/src/scripts/utils/display.js";

const buttons = [
  { id: "home-play-btn", target: "app-play" },
  { id: "home-collections-btn", target: "app-collections" },
  { id: "home-store-btn", target: "app-store" },
  { id: "home-mypage-btn", target: "app-mypage" },
];

export function setHome() {
  buttons.forEach((button) => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener("click", () => navigateTo(button.target));
    } else {
      console.error(`Element with ID '${button.id}' not found.`);
    }
  });
}
