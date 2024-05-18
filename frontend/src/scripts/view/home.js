const main = document.getElementById("main-content");
const apps = document.querySelectorAll(".container-app");

export function showHome() {
  apps.forEach((app) => {
    app.classList.replace("d-block", "d-none");
  });

  // 요청받은 섹션만 보여줍니다.
  const targetSection = document.getElementById("home");
  if (targetSection) {
    targetSection.classList.replace("d-none", "d-block");
  }
}
