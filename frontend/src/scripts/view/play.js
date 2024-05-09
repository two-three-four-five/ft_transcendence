const main = document.getElementById("main-content");
const sections = document.querySelectorAll(".content-section");

export function showPlay() {
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // 요청받은 섹션만 보여줍니다.
  const targetSection = document.getElementById("play");
  if (targetSection) {
    targetSection.style.display = "block";
  }
}

export function showSinglePlay() {
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // 요청받은 섹션만 보여줍니다.
  const targetSection = document.getElementById("singleplay");
  if (targetSection) {
    targetSection.style.display = "block";
  }
}

export function showMultiPlay() {
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // 요청받은 섹션만 보여줍니다.
  const targetSection = document.getElementById("multiplay");
  if (targetSection) {
    targetSection.style.display = "block";
  }
}
