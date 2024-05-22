import { getHostname, getDjangoPort } from "/src/scripts/utils/var.js";
import { navigateTo } from "/src/scripts/utils/display.js";

const ftLoginButton = document.getElementById("btn-oauth-ft");
const googleLoginButton = document.getElementById("btn-oauth-google");
const naverLoginButton = document.getElementById("btn-oauth-naver");
const kakaoLoginButton = document.getElementById("btn-oauth-kakao");

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
    "http://" + getHostname() + ":" + getDjangoPort() + "/v1/users/test";

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
      navigateTo("app-home", false);
      showToast(data);
    })
    .catch((error) => {
      navigateTo("app-login", false);
      setLogin();
      console.error("There was a problem with your fetch operation:", error);
    });
}

function showToast(data) {
  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  // Create the toast header
  let header = document.createElement("div");
  header.classList.add("toast-header");
  let title = document.createElement("strong");
  title.classList.add("me-auto");
  title.textContent = "Login Success";
  let button = document.createElement("button");
  button.classList.add("btn-close");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-dismiss", "toast");
  button.setAttribute("aria-label", "Close");
  header.appendChild(title);
  header.appendChild(button);

  // Create the toast body
  let body = document.createElement("div");
  body.classList.add("toast-body");
  body.textContent = "Welcome, " + data.substring(1, data.lastIndexOf("@"));

  // Append header and body to the toast element
  toast.appendChild(header);
  toast.appendChild(body);

  // Append the toast element to the toast container
  document.querySelector(".toast-container").appendChild(toast);

  // Initialize the toast and show it
  let bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}
