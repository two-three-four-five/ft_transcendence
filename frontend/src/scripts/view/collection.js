const main = document.getElementById("main-content");
const sections = document.querySelectorAll(".content-section");

export function showCollection() {
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // 요청받은 섹션만 보여줍니다.
  const targetSection = document.getElementById("collection");
  if (targetSection) {
    targetSection.style.display = "block";
  }
}
