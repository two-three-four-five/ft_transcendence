import { showErrorPage404 } from "./view/errorPage.js";
import { showHome } from "./view/home.js";
import { showPlay, showSinglePlay, showMultiPlay } from "./view/play.js";
import { showRank } from "./view/rank.js";
import { showMypage } from "./view/mypage.js";
import { showSettings } from "./view/settings.js";
import { showCollection } from "./view/collection.js";
import { showShop } from "./view/shop.js";

const router = {
  "/": () => showHome(),
  "/index.html": () => showHome(),
  "/play": () => showPlay(),
  "/play/single": () => showSinglePlay(),
  "/play/multi": () => showMultiPlay(),
  "/rank": () => showRank(),
  "/collection": () => showCollection(),
  "/shop": () => showShop(),
  "/mypage": () => showMypage(),
  "/settings": () => showSettings(),
};

function navigate(path) {
  window.history.pushState({}, path, window.location.origin + path);
  route();
}

function route() {
  const path = window.location.pathname;
  // Replace "\\w+" with "[^/]+" to match any character except "/"
  // This will allow the capture of segments with hyphens
  const route = Object.keys(router).find((r) =>
    path.match(new RegExp("^" + r.replace(/:\w+/g, "[^/]+") + "$"))
  );

  if (route) {
    const match = path.match(new RegExp(route.replace(/:\w+/g, "([^/]+)")));
    const args = match ? match.slice(1) : null; // Capture groups로부터 인자 추출
    router[route].apply(null, args);
  } else {
    // don't go from here
    showErrorPage404();
  }
}

// 브라우저 뒤로 가기/앞으로 가기 대응
window.addEventListener("popstate", route);

// 초기 라우트 실행
document.addEventListener("DOMContentLoaded", route);

// 예시를 위한 링크 클릭 이벤트 핸들링 (실제 구현에서는 더 견고한 방법을 사용해야 할 수 있습니다)
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.href);
  }
});

window.onload = function () {
  const hash = window.location.hash.substr(1);
  const tokens = new URLSearchParams(hash);
  var accessToken = tokens.get("access_token");
  const refreshToken = tokens.get("refresh_token");

  // 토큰이 존재할 때만 localStorage에 저장
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (accessToken == null) accessToken = localStorage.getItem("accessToken");
  const url = "http://localhost:8000/v1/users/test";
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
};
