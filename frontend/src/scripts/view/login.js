import { getHostname, getDjangoPort } from "/src/scripts/utils/var.js";
import { navigateTo } from "/src/scripts/utils/display.js";

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
      showToast(data["nickname"]);

      // const accessToken = localStorage.getItem("accessToken");
      const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
      const wsUrl = `${wsScheme}://localhost:2344/ws/notifications/?token=${accessToken}`;

      const socket = new WebSocket(wsUrl);

      socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("New notification:", data.message);
      };

      socket.onclose = function (event) {
        console.error("WebSocket closed unexpectedly:", event);
      };

      socket.onopen = function (event) {
        console.log("WebSocket connection opened:", event);
      };

      socket.onerror = function (event) {
        console.error("WebSocket error observed:", event);
      };

      //////////////////////////////////

      function generateNotificationContent(notification) {
        switch (notification.type) {
          case "FRIEND_REQUEST":
            return `New friend request from ${notification.from_user.nickname}`;
          case "NEW_CHATTING":
            return `New message from ${notification.from_user.nickname}`;
          case "GAME_REQUEST":
            return `New game invite from ${notification.from_user.nickname}`;
          default:
            return "You have a new notification";
        }
      }

      function fetchNotifications() {
        const url = `http://localhost:2344/v1/notifications/`;
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            data.forEach((notification) => {
              let content = generateNotificationContent(notification);
              console.log(`New notification: ${content}`);
              // 여기에 알림을 UI에 표시하는 코드를 추가합니다.
            });
          })
          .catch((error) => {
            console.error("Error fetching notifications:", error);
          });
      }

      fetchNotifications();

      ////////////////////////////////
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
  body.textContent = "Welcome, " + data;

  // Append header and body to the toast element
  toast.appendChild(header);
  toast.appendChild(body);

  // Append the toast element to the toast container
  document.querySelector(".toast-container").appendChild(toast);

  // Initialize the toast and show it
  let bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}
