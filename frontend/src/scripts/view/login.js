import { showToast } from "/src/scripts/utils/toast.js";
import { getHostname, getDjangoPort } from "/src/scripts/utils/var.js";
import { navigateTo } from "/src/scripts/utils/display.js";
import { alertNotifications } from "/src/scripts/view/navbar/notifications.js";

const ftLoginButton = document.getElementById("btn-oauth-ft");
const googleLoginButton = document.getElementById("btn-oauth-google");
const naverLoginButton = document.getElementById("btn-oauth-naver");
const kakaoLoginButton = document.getElementById("btn-oauth-kakao");

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function setLogin() {
  ftLoginButton.addEventListener("click", function () {
    navigateTo("app-spinner", false);

    window.location.href =
      "http://" + getHostname() + ":" + getDjangoPort() + "/v1/auth/oauth/ft";
  });
  // "http://" + getHostname() + ":" + getDjangoPort() + "/v1/auth/oauth/ft";
  googleLoginButton.href =
    "http://" + getHostname() + ":" + getDjangoPort() + "/v1/auth/oauth/google";
  naverLoginButton.href =
    "http://" + getHostname() + ":" + getDjangoPort() + "/v1/auth/oauth/naver";
  kakaoLoginButton.href =
    "http://" + getHostname() + ":" + getDjangoPort() + "/v1/auth/oauth/kakao";
}

export function login() {
  const hash = window.location.hash.substring(1);
  const tokens = new URLSearchParams(hash);
  var accessToken = tokens.get("access_token");
  var refreshToken = tokens.get("refresh_token");

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (window.location.hash) {
    window.history.replaceState(null, document.title, window.location.pathname);
  }

  if (accessToken == null) {
    accessToken = localStorage.getItem("accessToken");
  }

  const url =
    "http://" + getHostname() + ":" + getDjangoPort() + "/v1/users/me";

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
      return response.json();
    })
    .then((data) => {
      navigateTo("app-home", false);
      showToast("check", data["nickname"]);

      localStorage.setItem("nickname", data["nickname"]);
      localStorage.setItem("date_joined", data["date_joined"]);
      localStorage.setItem("social_type", data["social_type"]);

      alertNotifications();
    })
    .catch((error) => {
      navigateTo("app-login", false);
      setLogin();
      console.error("There was a problem with your fetch operation:", error);
    });
}
